const req = require('express/lib/request');
const fileSystem = require('fs')

function getData(data) {
    const result = JSON.parse(fileSystem.readFileSync(`src/database/${data}`, 'utf8'))
    return result
}

function createOrUpdateData(path, data) {
    fileSystem.writeFileSync(`src/database/${path}`, JSON.stringify(data));
}

function validateFields(data) {
    return Object.keys(data).filter((item) => !data[item])
}

module.exports = {
    getData,
    createOrUpdateData,
    validateFields
}