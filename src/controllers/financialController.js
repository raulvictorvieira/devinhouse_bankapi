const xlsxPopulate = require('xlsx-populate');
const { getData, createOrUpdateData } = require('../utils/functions');

module.exports = {

    async xlsxImportExpenses(req, res) {
        const { userID } = req.params;
        const financialData = getData('financial.json');

        //Validação do Usuário
        const users = getData('users.json');
        const existUser = users.filter((item) => item.id === Number(userID));
        const [ user ] = existUser;
        if(!user) {
            return res.status(400).send({ message: "Usuário não encontrado." })
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
            return res.status(400).send({ message: 'A planilha deve estar na seguinte ordem: price, typeOfExpenses, date, name' })
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
        const tradeUser = financialData.filter((trade) => trade.userId === Number(userID));
        const [trade] = tradeUser;
        
        //Se não encontrar alguma transação com o usuário especificado, é criada uma nova transação
        if (trade === undefined) {
            const createNewTrade = [ ...financialData, {
                "id": financialData.length + 1,
                "userId": Number(userID),
                "financialData": manipulatedDatas.map((item, index) => {
                    return {
                        id: index + 1, ...item
                    }
                })
            }]
            await createOrUpdateData('financial.json', createNewTrade);
        
        //Caso encontre transação com o usuário, é incrementada as novas à lista de objetos
        } else {
            trade.financialData = [
                ...trade.financialData, ...manipulatedDatas.map((item, index) => {
                    return {
                        id: trade.financialData.length + index + 1, ...item
                    }
                })
            ]

            financialData[trade.id -1] = trade;

            await createOrUpdateData('financial.json', financialData);
        }
 
        return res.status(201).send({message: 'Gastos importados com sucesso!'});
    },

    async deleteTrade(req, res) {
        const { userID, financialID } = req.params;

        //Validação de Usuário
        const users = getData('users.json');
        const existUser = users.filter((item) => item.id === Number(userID));
        const [ user ] = existUser;
        if(!user) {
            return res.status(400).send({ message: "Usuário não encontrado." })
        }
        //Validação de Transação
        const financialData = getData('financial.json');
        const existTrade = financialData.filter((trade) => trade.id === Number(financialID));
        const [ trade ] = existTrade;

        //Confere se a transação bate com o usuário e faz a deleção
        if(trade === undefined || trade.userId !== user.id) {
            console.log('caiu no else');
            return res.status(400).send({ message: "Essa transação não existe ou não pertence ao ID informado." })
        } else if (trade.userId === Number(userID)){
            console.log('caiu no if');
            const deletedTrade = financialData.filter((item) => item.userId !== Number(userID));
            await createOrUpdateData('financial.json', deletedTrade);
            return res.status(400).send({ message: "Transação deletada." })
        }
    }

}