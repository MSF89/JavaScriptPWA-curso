/*-------------------*/
/* VariablesGlobales */
/*-------------------*/

let listaProductos = []

/*-------------------*/
/*   localStorage    */
/*-------------------*/

function guardarListaProductos(lista){
    let prods = JSON.stringify(lista)
    localStorage.setItem('lista', prods)
}

function leerListaProductos(){
    let lista = []
    let prods = localStorage.getItem('lista')
    if(prods){
        try {
            lista = JSON.parse(prods)
            console.log('try', lista);
        } catch (error) {
            lista = []
            guardarListaProductos(lista)
            console.log('catch', lista);
        }
    }
    return lista
}

/*-------------------*/
/* funcionesGlobales */
/*-------------------*/

/* funcionBorrarProducto */
async function borrarProd(id){
    console.log('borrarProd', id);

    await apiProd.del(id)
    renderLista();
}

/* funcionCambiarCantidad */
async function cambiarValor(tipo, id, el){
    let index = listaProductos.findIndex(prod => prod.id == id)
    let valor = tipo == 'precio'? Number(el.value) : parseInt(el.value)
    console.log('cambioCantidad', tipo, index, valor)
    listaProductos[index][tipo] = valor
    let prod = listaProductos[index]
    
    await apiProd.put(prod, id)
} 

/* funcionRenderLista */

async function renderLista(){
    console.log('RenderLista');

    try {
        let plantilla = await $.ajax({url: 'plantillaLista.hbs'})

        //compilar plantilla
        let template = Handlebars.compile(plantilla)

        //obtener lista de productos del servidor remoto
        listaProductos = await apiProd.get()

        //guardo la lista de productos actual en el localStorage
        guardarListaProductos(listaProductos)

        //ejecutar plantilla compilada
        let html = template({listaProductos})
        $('#lista').html(html)
        let ul = $('#contenedorLista')

        componentHandler.upgradeElements(ul);

    } catch (error) {
        console.error('Error', error);
    }
}

/*-------------------*/
/*     listeners     */
/*-------------------*/

function configurarListeners(){
    console.log('ConfigurarListeners');

/*Ingreso producto nuevo */
    document.getElementById('btnEntradaProd').addEventListener('click', async  ()=>{
        console.log('btnEntradaProd');
        
        let input = $('#ingProd');
        let nombre = input.val();
        console.log(nombre);
        
        if(nombre){
            let producto = {nombre: nombre, cantidad:1, precio:0}
            await apiProd.post(producto)
            renderLista();
            input.val(null);
        }
    })


/*Borrar todos os productos */
document.getElementById('btnBorrarProd').addEventListener('click', ()=>{
    
    if(listaProductos.length){
        let dialog = $('dialog') [0]
        console.log(dialog)
        dialog.showModal()
    }
})
}



/*-------------------*/
/*    RegistroSW     */
/*-------------------*/

function registrarServiceWorker(){
    if('serviceWorker' in navigator){
        window.addEventListener('load', ()=>{
            this.navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('El serviceWorker se registro correctamente', reg)

                //habilitar el funcionamiento de las notificaciones push
                initialiseUI(reg)

                Notification.requestPermission(function(res){
                    if (res === 'granted') {
                        navigator.serviceWorker.ready.then(function(reg){
                            console.log(reg);
                        })
                    }
                })

                reg.onupdatefound = ()=>{
                    const installingWorker = reg.installing
                    installingWorker.onstatechange = ()=>{
                        console.log('SW!-------------> ', installingWorker.state);
                        if(installingWorker.state === 'activated'){
                            console.log('reiniciando en 5 segundos');

                            setTimeout(()=>{
                                console.log('ok!');
                                location.reload()
                            }, 5000)

                        }
                    }
                }
            })
            .catch(err => {
                console.warn('Error al registrar el serviceWorker', err);
            })
        })
    } else{
        console.error('ServiceWOrker no disponible ');
    }
}

/*-------------------*/
/*       Modal       */
/*-------------------*/

function iniDialog(){
    let dialog = $('dialog')[0]
    if(!dialog.showModal){
        dialogPolyfill.registerDialog(dialog)
    }

    $('dialog .aceptar').click(async () =>{
        await apiProd.deleteAll()
        renderLista()
        dialog.close()
    })

    $('dialog .cancelar').click(()=>{
        dialog.close()
    })
}

/*-------------------*/
/*  funcionesInicio  */
/*-------------------*/

function start(){
    
    iniDialog();
    registrarServiceWorker();
    configurarListeners();
    renderLista();
}

/*-------------------*/
/*     Ejecucion     */
/*-------------------*/

start();