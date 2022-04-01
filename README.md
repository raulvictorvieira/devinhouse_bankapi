# DEVinBank - Conta 365
Projeto realizado para avaliação de módulo do DEVinHouse. Os requisitos do projeto se encontram [aqui](https://docs.google.com/document/d/1WaBNrGNBo8ujxcHX2nnx28u82eHq0OS_6JySb_bkldE/edit).


## Instalação
```bash
npm install
```

Após a instalação das dependências é necessário a inicialização do swagger-autogen para gerar o arquivo output com dados para a nossa documentação através do comando a seguir:

```bash
npm run swagger-autogen
```

Por fim, execute o comando abaixo para iniciar o nosso servidor:

```bash
npm start
```

Por padrão o servidor estará rodando na porta:3333. Para acesso à documentação acesse :3333/docs conforme exemplos a seguir:

server:
[http://localhost:3333](http://localhost:3333)

documentação:
[http://localhost:3333/docs](http://localhost:3333/docs)

## Utilização da API
A API contém 7 endpoints separadas por funcionalidades voltadas especificamentes ao -usuário- e outras ao -financeiro-, conforme descrições a seguir:

### Usuários
```bash
# post
endpoint: /api/v1/user
"Endpoint para criar um novo usuário"

# patch
endpoint: /api/v1/user/:id
"Endpoint para atualizar um usuário"

# get
endpoint: /api/v1/user/:id
"Endpoint para obter dados cadastrais de um usuário específico"

# get
endpoint: /api/v1/users
"Endpoint para obter dados cadastrais de todos os usuários do banco de dados"
```

### Financeiro
```bash
# post
endpoint: /api/v1/financial/:userID
"Endpoint que recebe um arquivo xlsx com informações de despesas do usuário e os importa para o banco de dados"

# get
endpoint: /api/v1/financial/:userID
"Endpoint para devolver despesas de um usuário através de filtro com o tipo de despesa desejada"

# delete
endpoint: /api/v1/financial/:userID/:financialID
"Endpoint para deletar transações de um usuário específico"
```

## Documentação
Para facilitar a utilização e a compreenção da API, é importante verificar toda a documentação e fazer os testes dos endpoints através do swagger pela porta [http://localhost:3333/docs](http://localhost:3333/docs), conforme citado antes.
Abaixo, uma screenshot de como é a visualização dos endpoints na documentação:

![](https://user-images.githubusercontent.com/81329365/152688052-462e56a5-2ac7-4788-bbd3-a1ea65b016ac.png)

## Ferramentas e linguagens utilizadas no projeto

- nodeJS
- express
- router
- multer
- swagger-autogen
- swagger-ui-express
- xlsx-populate
- nodemon

## Licença
[MIT](LICENSE) License

## DevinHouse - React | NodeJS
![DEVinHouse](https://user-images.githubusercontent.com/81329365/152703043-fb718a84-5c88-4d95-af15-2834666ccfac.png)
