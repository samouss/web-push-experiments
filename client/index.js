import encode from './encode';

if (!'serviceWorker' in navigator) {
  console.warn('Sorry, the service Worker is not available in your browser...');

  return;
}

const publicKey =
  'BAIv1EJPFImOtD8FJqp8700aQ0BVN9xArXeBPSeyooHCyz8Qp-_D7jncuWsucNvFmp7m5Jiitep7tx_idBqv-ZE';

const registerServiceWorker = () =>
  navigator.serviceWorker
    .register('./sw.js')
    .then(registration => {
      console.log('SW: register');
      return registration;
    })
    .catch(error => {
      console.log('SW: fail');
      console.log(error);
    });

const registerPush = registration =>
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: encode(publicKey),
  });

const askNotificationsPermission = () =>
  new Promise((resolve, reject) => {
    const permission = Notification.requestPermission(resolve);

    if (permission) {
      permission.then(resolve);
    }
  }).then(permission => {
    if (permission !== 'granted') {
      return Promise.reject(permission);
    }

    return permission;
  });

Promise.all([registerServiceWorker(), askNotificationsPermission()])
  .then(([registration, permission]) => {
    return registerPush(registration);
  })
  .then(subscription => {
    console.log(subscription);
  })
  .catch(error => {
    console.log(error);
  });
