if (!'serviceWorker' in navigator) {
  console.warn('Sorry, the service Worker is not available in your browser...');

  return;
}

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
    console.log(registration);
    console.log(permission);
  })
  .catch(error => {
    console.log(error);
  });
