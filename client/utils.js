const uniqueId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
};

export const encode = input => {
  const padding = '='.repeat((4 - input.length % 4) % 4);
  const base64 = (input + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const createDeviceId = () => {
  const key = 'pushExperimentsIdentifier';
  const item = window.localStorage.getItem(key);

  if (item) {
    return item;
  }

  const deviceId = uniqueId();
  window.localStorage.setItem(key, deviceId);

  return deviceId;
};
