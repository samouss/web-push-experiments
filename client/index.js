import 'bulma/css/bulma.css';
import { encode, createDeviceId } from './utils';
import createClient from './createClient';

if (!'serviceWorker' in navigator) {
  console.warn('Sorry, the service Worker is not available in your browser...');

  return;
}

const endpoint = process.env.ENDPOINT || 'http://localhost:3000';
const publicKey =
  process.env.PUSH_PUBLIC_KEY ||
  'BAIv1EJPFImOtD8FJqp8700aQ0BVN9xArXeBPSeyooHCyz8Qp-_D7jncuWsucNvFmp7m5Jiitep7tx_idBqv-ZE';

const client = createClient(endpoint);
const deviceId = createDeviceId();

const registerServiceWorker = () =>
  navigator.serviceWorker
    .register('./serviceWorker.js')
    .then(registration => {
      return registration;
    })
    .catch(error => {
      return error;
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
    return client.subscriptions({
      deviceId,
      subscription,
    });
  })
  .catch(error => {
    console.log(error);
  });

const form = document.querySelector('form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const button = event.currentTarget.querySelector('button');
  const payload = [...event.currentTarget.elements]
    .filter(element => element.tagName === 'INPUT')
    .map(element => [element.name, element.value || element.placeholder])
    .reduce(
      (acc, [name, value]) => ({
        ...acc,
        [name]: value,
      }),
      {}
    );

  button.classList.add('is-loading');

  client
    .notifications({
      notification: payload,
      deviceId,
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      button.classList.remove('is-loading');
    });
});
