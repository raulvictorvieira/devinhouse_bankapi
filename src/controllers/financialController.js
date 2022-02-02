const xlsxPopulate = require('xlsx-populate');
const { getData, createOrUpdateData } = require('../utils/functions');

module.exports = {

    async xlsxImportExpenses(req, res) {
        const { userID } = req.params;
        const financialData = getData('financial.json');

        //Validação de do parâmetro de ID do Usuário
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
            return Object.assign({}, {id: trade.financialData.length +1}, ...result);
        });

        //Conferir se há alguma transação já feita pelo cliente
        const tradeUser = financialData.filter((trade) => trade.userId === Number(userID));
        const [trade] = tradeUser;
        if (trade.userId === Number(userID)) {
            
        } else {
            const createNewTrade = [ ...financialData, {
                "id": financialData.length + 1,
                "userId": userID,
                "financialData": manipulatedDatas
            }]
            return createOrUpdateData('financial.json', createNewTrade);
        }
 
        return res.status(201).send({message: 'Gastos importados com sucesso!'});
    }

}