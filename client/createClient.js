const createClient = endpoint => {
  const request = (url, options = {}) =>
    fetch(endpoint + url, {
      ...options,
      headers: {
        ...options.headers,
        'content-type': 'application/json',
      },
    }).then(response => {
      if (response.status === 201) {
        return;
      }

      return response.json();
    });

  const subscriptions = subscription =>
    request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });

  const notifications = notification =>
    request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });

  return {
    subscriptions,
    notifications,
  };
};

export default createClient;
