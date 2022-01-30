const { getData, createOrUpdateData } = require('../utils/functions');

module.exports = {

    async createNewUser(req, res) {

       const  { name, email } = req.body;
       const users = getData();
       const createNewUser = [
           ...users, {
               id: users.length + 1,
               name: name,
               email: email
           }
       ]
       createOrUpdateData(createNewUser);
       return res.status(201).send({message: 'Usuário criado com sucesso'})
    }

}