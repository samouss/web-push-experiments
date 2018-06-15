import 'bulma/css/bulma.css';
import { encode, createDeviceId } from './utils';
import { createNotificationElement, disableButtonElement } from './elements';
import { createFallbackMessage, createDisableMessage } from './messages';
import createClient from './createClient';

const isServiceWorkerSupported = 'serviceWorker' in navigator;
const isNotificationsSupported = 'Notification' in window;

const run = () => {
  if (!isServiceWorkerSupported || !isNotificationsSupported) {
    createNotificationElement(
      createFallbackMessage({
        isServiceWorkerSupported,
        isNotificationsSupported,
      })
    );

    disableButtonElement();

    return;
  }

  const endpoint = process.env.API_ENDPOINT || '';
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

  const requestNotificationsPermission = askNotificationsPermission().catch(
    permission => {
      createNotificationElement(createDisableMessage());

      disableButtonElement();

      return Promise.reject(permission);
    }
  );

  requestNotificationsPermission
    .then(() => registerServiceWorker())
    .then(registration => {
      return registerPush(registration);
    })
    .then(subscription => {
      return client.subscriptions({
        subscriptionId: subscription.endpoint,
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

    navigator.serviceWorker
      .getRegistration()
      .then(registration => registration.pushManager.getSubscription())
      .then(subscription => {
        return client.notifications({
          subscriptionId: subscription.endpoint,
          notification: payload,
        });
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
