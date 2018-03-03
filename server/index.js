const express = require('express');

const port = process.env.PORT || 3000;
const server = express();

server.listen(port, () => {
  console.log(`Server listen on port: ${port}`);
});
