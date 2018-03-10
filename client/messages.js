export const createFallbackMessage = ({
  isServiceWorkerSupported,
  isNotificationsSupported,
}) => {
  const fragments = [
    "Your browser doesn't support ",
    !isServiceWorkerSupported &&
      '<a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" target="_blank" rel="noopener">ServiceWorker</a>',
    !isServiceWorkerSupported && !isNotificationsSupported ? ' & ' : '',
    !isNotificationsSupported &&
      '<a href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" target="_blank" rel="noopener">Notifications</a>',
    '.',
  ];

  return fragments.filter(Boolean).join('');
};

export const createDisableMessage = () =>
  `The application requires the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" target="_blank" rel="noopener">Notifications</a> to be enabled.`;
