export const createNotificationElement = message => {
  const element = document.createElement('div');
  element.className = 'notification is-danger';

  const paragraph = document.createElement('p');
  paragraph.innerHTML = message;

  element.appendChild(paragraph);

  document
    .querySelector('.--content')
    .insertBefore(element, document.querySelector('.notification'));
};

export const disableButtonElement = () =>
  document.querySelector('.button').setAttribute('disabled', true);
