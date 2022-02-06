const xlsxPopulate = require('xlsx-populate');
const { getData, createOrUpdateData } = require('../utils/functions');

module.exports = {

    async xlsxImportExpenses(req, res) {

        // #swagger.tags = ['Financial']
        // #swagger.description = 'Endpoint que recebe um arquivo xlsx com informações de despesas do usuário e os importa para o banco de dados.'

        /*
          #swagger.consumes = ['multipart/form-data']  
          #swagger.parameters['xlsxFile'] = {
              in: 'formData',
              type: 'file',
              required: 'true',
              description: 'A planilha deve ter o seguinte cabeçalho: price, typeOfExpenses, date, name',
        } */

        const { userID } = req.params;
        const financialData = getData('financial.json');

        //Validação do Usuário
        const users = getData('users.json');
        const existUser = users.filter((item) => item.id === Number(userID));
        const [ user ] = existUser;
        if(!user) {
            /* #swagger.responses[404] = { 
               description: 'Usuário não encontrado!' 
        } */
            return res.status(404).send({ message: "Usuário não encontrado." })
        }

        //Transformando o buffer do xlsx em dados
        const xlsxBuffer = req.file.buffer;
        const xlsxData = await xlsxPopulate.fromDataAsync(xlsxBuffer);

        //Pegando os dados e manipulando-os em um obj
        const rows = xlsxData.sheet(0).usedRange().value();
        const [ firstRow ] = rows;
        const keys = [ 'price', 'typeOfExpenses', 'date', 'name' ];
        const existAllKeys = firstRow.every((item, index) => {
            return keys[index] === item
        });
        if(!existAllKeys || firstRow.length !== 4) {
            /* #swagger.responses[400] = { 
               description: 'A planilha deve estar na seguinte ordem: price, typeOfExpenses, date, name.' 
        } */
            return res.status(400).send({ message: 'A planilha deve estar na seguinte ordem: price, typeOfExpenses, date, name.' })
        }
        const filterRows = rows.filter((_, index) => index !== 0);
        const manipulatedDatas = filterRows.map((row) => {
            const result = row.map((cell, index) => {
                return {
                    [firstRow[index]]: !cell ? '' : cell
                }
            })
            return Object.assign({}, ...result);
        });

        //Conferir se há alguma transação já feita pelo cliente
        const transactionUser = financialData.filter((transaction) => transaction.userId === Number(userID));
        const [ transaction ] = transactionUser;
        
        //Se não encontrar alguma transação com o usuário especificado, é criada uma nova transação
        if (transaction === undefined) {
            const createNewTransaction = [ ...financialData, {
                "id": financialData.length + 1,
                "userId": Number(userID),
                "financialData": manipulatedDatas.map((item, index) => {
                    return {
                        id: index + 1, ...item
                    }
                })
            }]
            await createOrUpdateData('financial.json', createNewTransaction);
        
        //Caso encontre transação com o usuário, é incrementada as novas à lista de objetos
        } else {
            transaction.financialData = [
                ...transaction.financialData, ...manipulatedDatas.map((item, index) => {
                    return {
                        id: transaction.financialData.length + index + 1, ...item
                    }
                })
            ]

            financialData[transaction.id -1] = transaction;

            await createOrUpdateData('financial.json', financialData);
        }
        /* #swagger.responses[201] = { 
               description: 'Gastos importados com sucesso!' 
        } */
        return res.status(201).send({message: 'Gastos importados com sucesso!'});
    },

    async deleteTransaction(req, res) {

        // #swagger.tags = ['Financial']
        // #swagger.description = 'Endpoint para deletar transações de um usuário específico.'

        // #swagger.parameters['userID'] = { description: 'ID do usuário.' }
        // #swagger.parameters['financialID'] = { description: 'ID referente às suas transações.' }

        const { userID, financialID } = req.params;
        const users = getData('users.json');
        const financialData = getData('financial.json');

        //Validação de Usuário
        const existUser = users.filter((user) => user.id === Number(userID));
        const [ user ] = existUser;
        if(!user) {
            /* #swagger.responses[404] = { 
               description: 'Usuário não encontrado!' 
                } */
            return res.status(404).send({ message: "Usuário não encontrado." })
        }

        //Validação de Transação
        const existTransaction = financialData.filter((transaction) => transaction.id === Number(financialID));
        const [ transaction ] = existTransaction;

        //Confere se a transação bate com o usuário e faz a deleção
        if(transaction === undefined || transaction.userId !== user.id) {
            /* #swagger.responses[400] = { 
               description: 'Essa transação não existe ou não pertence ao ID informado!' 
                } */
            return res.status(400).send({ message: "Essa transação não existe ou não pertence ao ID informado!" })
        } else if (transaction.userId === Number(userID)){
            const deletedTransaction = financialData.filter((item) => item.userId !== Number(userID));
            await createOrUpdateData('financial.json', deletedTransaction);
            /* #swagger.responses[200] = { 
               description: 'Transação deletada com sucesso!' 
                } */
            return res.status(200).send({ message: "Transação deletada com sucesso!" })
        }
    },

    async totalExpenses(req, res) {

        // #swagger.tags = ['Financial']
        // #swagger.description = 'Endpoint para devolver despesas de um usuário através de filtro com o tipo de despesa desejada.'

        // #swagger.parameters['userID'] = { description: 'ID do usuário.' }
        /* #swagger.parameters['type'] = {
               in: 'query',
               description: 'ex.:type=Food',
               type: 'string'
        } */

        const { userID } = req.params;
        const { type } = req.query;
         
        const users = getData('users.json');
        const financialData = getData('financial.json');
        
        const existUser = users.filter((item) => item.id === Number(userID));
        const [ user ] = existUser;
        if(!user) {
            /* #swagger.responses[404] = { 
               description: 'Usuário não encontrado!' 
                } */
            return res.status(404).send({ message: "Usuário não encontrado!" })
        };

        //Validação de Transação
        const existTransaction = financialData.filter((transaction) => transaction.userId === Number(userID));
        const [ transaction ] = existTransaction;
        if(!transaction) {
            /* #swagger.responses[404] = { 
               description: 'Este usuário não possui transação!' 
                } */
            return res.status(404).send({ message: "Este usuário não possui transação!" })
        };

        //Buscar despesas que correspondem à query inserida
        const expenses = transaction.financialData.filter((expense) => {
            return expense.typesOfExpenses === type
        });

        return res.status(200).send({ message: `Suas despesas de - ${type} - foram localizadas com sucesso`, expenses })
    }

}