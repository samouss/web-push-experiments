const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const privateKey = process.env.PUSH_PRIVATE_KEY || '';

const state = new Set();
const server = express();

server.use(cors());
server.use(bodyParser.json());

// Register a subscription
server.post('/subscriptions', (req, res) => {
  state.add(req.body);

  res.status(201).end();
});

server.listen(port, () => {
  console.log(`Server listen on port: ${port}`);
});
