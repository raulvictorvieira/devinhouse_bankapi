const xlsxPopulate = require('xlsx-populate');
const { getData } = require('../utils/functions');

module.exports = {

    async xlsxImportExpenses(req, res) {
        const { id } = req.params;
        const financialData = getData('financial.json');

        const xlsxBuffer = req.file.buffer;
        const xlsxData = await xlsxPopulate.fromDataAsync(xlsxBuffer);
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
        const objectExpenses = filterRows.map((row) => {
            const result = row.map((cell, index) => {
                return {
                    [firstRow[index]]: !cell ? '' : cell
                }
            })
            return Object.assign({}, ...result);
        })

        const data = financialData.map((trade) => {
            if(trade.userId === Number(id)) {
                return trade.financialData;
            } else {
                financialData.push(
                    {
                        "id": financialData.length + 1,
                        "userId": id,
                        "financialData": objectExpenses
                    }
                )
            }
        })

        console.log(data);

        // createOrUpdateData('financial.json', data)

        return res.status(201).send({message: 'Gastos importados com sucesso!'});
    }

}