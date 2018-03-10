import 'bulma/css/bulma.css';
import { encode, createDeviceId, createFallbackMessage } from './utils';
import createClient from './createClient';

const isServiceWorkerSupported = 'serviceWorker' in navigator;
const isNotificationsSupported = 'Notification' in window;

const run = () => {
  if (!isServiceWorkerSupported || !isNotificationsSupported) {
    const before = document.querySelector('.notification');
    const element = document.createElement('div');
    element.className = 'notification is-danger';
    element.innerHTML = createFallbackMessage({
      isServiceWorkerSupported,
      isNotificationsSupported,
    });

    document.querySelector('.content').insertBefore(element, before);
    document.querySelector('.button').setAttribute('disabled', true);

    return;
  }

  const endpoint = process.env.ENDPOINT || 'http://localhost:3000';
  const publicKey = process.env.PUSH_PUBLIC_KEY || '';

  const client = createClient(endpoint);
  const deviceId = createDeviceId();

  const registerServiceWorker = () =>
    navigator.serviceWorker.register('./serviceWorker.js');

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

  askNotificationsPermission()
    .then(() => registerServiceWorker())
    .then(registration => {
      return registerPush(registration);
    })
    .then(subscription => {
      return client.subscriptions({
        deviceId,
        subscription,
      });
    })
    .catch(error => {
      console.warn('Oops', error);
    });

  document.querySelector('form').addEventListener('submit', event => {
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
        console.warn('Oops', error);
      })
      .finally(() => {
        button.classList.remove('is-loading');
      });
  });
};

run();
