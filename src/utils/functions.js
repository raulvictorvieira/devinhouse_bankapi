const fileSystem = require('fs')

function getData() {
    const result = JSON.parse(fileSystem.readFileSync('src/database/users.json', 'utf8'))
    return result
}

function createOrUpdateData(data) {
    fileSystem.writeFileSync('src/database/users.json', JSON.stringify(data));
}

module.exports = {
    getData,
    createOrUpdateData
}