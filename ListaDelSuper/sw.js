
console.log('serviceWorkwer');
const CACHE_STATIC_NAME = 'static-3'
const CACHE_INMUTABLE_NAME = 'inmutable-3'
const CACHE_DYNAMIC_NAME = 'dynamic-3'

self.addEventListener('install', e => {
    console.log('sw Install!!!');

    //-------------------------------------------
    //                cacheStatic
    //------------------------------------------- 

    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache =>{

        return cache.addAll([
            '/',
            '/index.html',
            '/css/style.css',
            '/js/index.js',
            '/js/api.js',
            '/plantillaLista.hbs',
            '/recursos/supermarket2.jpg'
        ])
        
        }).catch(()=>{
            console.log('recurso no encontrado');
        })
        
        //-------------------------------------------
        //             cacheInmutable
        //------------------------------------------- 
        
        const CacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache =>{
           // console.log(cache);

            return cache.addAll([
                'js/handlebars.min-v4.7.7.js',
                'https://code.jquery.com/jquery-3.6.3.min.js',
                'https://code.getmdl.io/1.3.0/material.blue_grey-pink.min.css',
                'https://code.getmdl.io/1.3.0/material.min.js'
            ])
            
        })

        e.waitUntil(Promise.all([cacheStatic, CacheInmutable]))
    })
    
    self.addEventListener('activate', e => {
        console.log('sw Activate');   

        const cacheWhiteList = [
            CACHE_STATIC_NAME,
            CACHE_INMUTABLE_NAME,
            CACHE_DYNAMIC_NAME
        ]   

        e.waitUntil(caches.keys().then(keys =>{

            return Promise.all(
                keys.map(key =>{
                    console.log(keys);
                    if(!cacheWhiteList.includes(key)){
                        return caches.delete(key)
                    }
                })
            )
        }))
    })

    
self.addEventListener('fetch', e => {
    console.log('sw Fetch');  
    let {url, method} = e.request //destructuracion   
    if(method === 'GET' && !url.includes('mockapi.io')){

        const respuesta = caches.match(e.request).then(res=>{
            if(res){

                return res            
            }
            return fetch(e.request).then(nuevaRespuesta =>{
                caches.open(CACHE_DYNAMIC_NAME).then(cache=>{
                    cache.put(e.request, nuevaRespuesta)
                })
                return nuevaRespuesta.clone()
            })
        })
        e.respondWith(respuesta)
    } else {
        console.warn('BYPASS', method, url);
    }

})   

self.addEventListener('push', e =>{
    console.log('PUSH!!', e);
    let datos = e.data.text();
    console.log(datos)
    const title = 'Super Lista!'
    const options = {
        body: `Mensajes: ${datos}`,
        icon: 'images/icons/icon-72x72.png'
    }
    e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', e => {
    console.log('click en notificacion recibido', e);

    e.notification.close()
    e.waitUntil(clients.openWindow('https://www.instagram.com'))
})


