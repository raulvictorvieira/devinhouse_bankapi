const swaggerAutogen = require('swagger-autogen')();

const outputFile = "./src/swagger_output.json";
const endpointsFiles = ["./src/routes/index.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "DEVinBank Conta 365",
    description:
      "API desenvolvida em NodeJS(express) para o módulo 2 do DEVinHouse.",
  },
  host: "localhost:3333",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json", "application/xml"],
  produces: ["application/json"],
  tags: [
    {
      name: "User",
      description: "Endpoints",
    },
    {
      name: "Financial",
      description: "Endpoints",
    }
  ],
  definitions: {
    User: {
        id: 1998,
        name: "Gordon Freeman",
        email: "gordon123@halflife.com"
    },
    AddUser: {
        $name: "Gordon Freeman",
        $email: "gordon123@halflife.com"
    },
    Financial: {
      id: 1,
        userId: 1998,
        financialData: [{
            id: 1,
            price: 57.9,
            typesOfExpenses: "Toys",
            date: "06/06/2021",
            name: "Toy Store (eu ri desse trocadilho, me desculpe)"
        }]
  }
}
};

swaggerAutogen(outputFile, endpointsFiles, doc);