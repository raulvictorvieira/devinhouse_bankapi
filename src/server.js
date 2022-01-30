const express = require('express');
const server = express();
const routes = require('./routes')

server.use(express.json());
server.use(routes);

const PORT = 3333;
server.listen(PORT, () => console.log('Executando'));