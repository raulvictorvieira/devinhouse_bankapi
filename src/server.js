const express = require('express');
const server = express();
const routes = require('./routes')

server.use(express.json());
server.use(routes);

const PORT = 3333 || process.env.PORT;
server.listen(PORT, () => console.log(`Executando na porta ${PORT}`));