const apiProd = (function(){

    function getURL(id){
        return 'https://634dd73ef34e1ed8267f38f2.mockapi.io/product/' + (id || '')
    }

    //GET

    async function get(){
        try{ 
            let prods = await $.ajax({url: getURL()})
            return prods
        } catch (error){
            console.error('Error get', error);
            let prods = leerListaProductos()
            console.log(prods);
            return prods
        }
    }

    //POST
    async function post(prod){
        try {
            return await $.ajax({url: getURL(), method: 'post', data: prod})
        } catch (error) {
            console.error('Error post', error);
            return {}
        }
    }

    //PUT
   async function put(prod, id){
    try {
        return await $.ajax({url: getURL(id), method: 'put', data: prod})
    } catch (error) {
        console.error('Error put', error);
        return {}
    }
   }

    //DELETE

    async function del(id){
        try {
            return await $.ajax({url: getURL(id), method: 'delete'})
        } catch (error) {
            console.error('Error delete', error);
            return {}
        }
    }

    //DELETE ALL

    async function deleteAll(){
        //let progress = $('progress')
        let progress = document.querySelector('progress')
        progress.style.display = 'block'
        let porcentaje = 0
        for (let i = 0; i < listaProductos.length; i++) {
            
            porcentaje = parseInt((i * 100) / listaProductos.length)
            console.log(porcentaje);
            progress.value = porcentaje

            let id = listaProductos[i].id
            await del(id)
            
        }
        // termino el borrado total
        porcentaje = 100
        console.log(porcentaje);
        progress.value = porcentaje

        setTimeout(()=> {
            progress.style.display = 'none'
        }, 2000)
    }

    return{
        get: () => get(),
        post: producto => post(producto),
        put: (producto, id) => put(producto, id),
        del: id => del(id),
        deleteAll: () => deleteAll()
    }
})()