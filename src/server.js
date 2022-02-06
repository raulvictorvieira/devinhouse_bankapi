const express = require('express');
const server = express();
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

server.use(express.json());
server.use(routes);
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const PORT = 3333 || process.env.PORT;
server.listen(PORT, () => console.log(`Executando na porta ${PORT}`));