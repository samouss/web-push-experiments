const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webPush = require('web-push');

const port = process.env.PORT || 3000;
const publicKey = process.env.PUSH_PUBLIC_KEY || '';
const privateKey = process.env.PUSH_PRIVATE_KEY || '';

const state = new Map();
const server = express();

// prettier-ignore
webPush.setVapidDetails(
  'mailto:hello@world.com',
  publicKey,
  privateKey
);

server.use(cors());
server.use(bodyParser.json());

// Register a subscription
server.post('/subscriptions', (req, res) => {
  const { deviceId, subscription } = req.body;

  state.set(deviceId, subscription);

  res.status(201).end();
});

// Trigger notifications
server.post('/notifications', (req, res) => {
  const { deviceId, notification } = req.body;
  const subscription = state.get(deviceId);
  const payload = JSON.stringify(notification);

  webPush
    .sendNotification(subscription, payload)
    .then(() => {
      res.status(201).end();
    })
    .catch(error => {
      res.status(400).json({
        error,
      });
    });
});

// Launch the server
server.listen(port, () => {
  console.log(`Server listen on port: ${port}`);
});
