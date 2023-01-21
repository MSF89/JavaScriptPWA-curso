const applicationServerPublicKey = 'BGWNBaeEr4gwS0zrHkJGef-FzWCSYl2IpwLL9ypuKROVjxc0y55w6H62WEHncSvVoQYNL_WVk_ExMKvUjGfpsXY'
let pushButton = null;
let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String){
    const padding = '='.repeat ((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData; ++i){
        outputArray[i] = rawData.charCodeAt(i)
    }
}

return outputArray;

function updateBtn(){
    if(isSubscribed){
        pushButton.textContent = 'DesHabilitar Notificacions Push';
    } else {
        pushButton.textContent = 'Habilitar Notificaciones Push'
    }
    pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription){
    
    const subscriptionJson = document.querySelector('.js-subscription-json')
    const subscriptionDetails = document.querySelector('.js-subscription-details')
    
    if(subscription){
        subscriptionJson.textContent = JSON.stringify(subscription)
        subscriptionDetails.classList.remove('.is-visible')
    } else {
        subscriptionDetails.classList.add('.is-visible')
    }
}

function subscribeUser(){
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
    .then(function (subscription){
        console.log('User is subscribed', subscription);
        updateSubscriptionOnServer(subscription)
        isSubscribed = true
        updateBtn()
    })
    .catch(function(err){
        console.log('Failed to subscribe the user: ', err);
        updateBtn()
    })
}

function unsubscribeUser(){
    swRegistration.pushManager.getSubscription()
    .then(function(subscription){
        if(subscription){
            return subscription.unsubscribe()
        }
    })
    .catch(function(error){
        console.log('Error unsubscribing', error);
    })
    .then (function(){
        updateSubscriptionOnServer(null)
        console.log('User is unsubscripted.');
        isSubscribed = false
        updateBtn()
    })
}

function initialiseUI(reg){
    swRegistration = reg
    pushButton = document.querySelector('.js-push-btn')

    pushButton.addEventListener('click', function(){
        pushButton.disabled = true
        if(isSubscribed){
            unsubscribeUser()
        } else {
            subscribeUser()
        }
    })
    swRegistration.pushManager.getSubscription()
        .then(function(subscription){
            isSubscribed = !(subscription === null)

            if(isSubscribed){
                console.log('User Is subscribed.');
            }else {
                console.log('User is Not subscribed');
            }
            updateBtn();
        })
}