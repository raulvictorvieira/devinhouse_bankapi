const { get } = require('express/lib/response');
const { getData, createOrUpdateData, validateFields } = require('../utils/functions');

module.exports = {

    async createNewUser(req, res) {

       const  { name, email } = req.body;
       const users = getData();
       const validate = validateFields(req.body)
       if (validate.length >= 1) {
           return res.status(400).send({ message: `O(s) campo(s) - ${validate.join(', ')} - é (são) obrigatório(s)!` })
        }
       const createNewUser = [
           ...users, {
               id: users.length + 1,
               name: name,
               email: email
           }
       ]
       createOrUpdateData(createNewUser);
       return res.status(201).send({message: 'Usuário criado com sucesso!'})

    },

    async updateOneUser(req, res) {
        const { id } = req.params;
        const { name, email } = req.body;
        const users = getData();
        const existUser = users.filter((item) => item.id === Number(id));

        const [ user ] = existUser;
        if(!user) {
            return res.status(400).send({ message: "Usuário não encontrado." })
        }

        const updateUser = users.map((user) => {
            if(user.id === Number(id)) {
                return {
                    id: Number(id),
                    name: !name ? user.name : name,
                    email: !email ? user.email : email 
                }
            } else {
                return { ...user }
            }
        })

        createOrUpdateData(updateUser);
        return res.status(201).send({ message: 'Usuário atualizado com sucesso!' })
    },

    async oneUser(req, res) {
        const { id } = req.params
        const users = getData()
        try {
            const user = users.filter((item) => item.id === Number(id))

            if (user.length === 0) {
                throw new Error('Não existe usuário na lista com este ID')
            }
            return res.status(200).json({ user })

        } catch (error) {
            return res.status(400).json(error.message)
        }
    }

}