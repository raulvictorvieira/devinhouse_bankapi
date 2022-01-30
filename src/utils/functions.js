const req = require('express/lib/request');
const fileSystem = require('fs')

function getData() {
    const result = JSON.parse(fileSystem.readFileSync('src/database/users.json', 'utf8'))
    return result
}

function createOrUpdateData(data) {
    fileSystem.writeFileSync('src/database/users.json', JSON.stringify(data));
}

function validateFields(data) {
    return Object.keys(data).filter((item) => !data[item])
}

module.exports = {
    getData,
    createOrUpdateData,
    validateFields
}