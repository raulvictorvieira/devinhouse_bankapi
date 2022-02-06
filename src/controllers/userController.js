const { getData, createOrUpdateData, validateFields } = require('../utils/functions');

module.exports = {

    async createNewUser(req, res) {

        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para criar um novo usuário.'

        /* #swagger.parameters['createNewUser'] = {
               in: 'body',
               description: 'Informações do usuário a ser criado.',
               required: true,
               schema: { $ref: "#/definitions/AddUser" }
        } */

       const  { name, email } = req.body;
       const users = getData('users.json');

       //Validação dos campos a serem preenchidos
       const validate = validateFields(req.body)
       if (validate.length >= 1) {
           /* #swagger.responses[400] = { 
               description: 'O(s) campo(s) - "campos com erros" - é (são) obrigatório(s)!' 
        } */
           return res.status(400).send({ message: `O(s) campo(s) - ${validate.join(', ')} - é (são) obrigatório(s)!` })
        }

        //Criação do usuário com os dados informados
       const createNewUser = [
           ...users, {
               id: users.length + 1,
               name: name,
               email: email
           }
       ]
       await createOrUpdateData('users.json', createNewUser);
       /* #swagger.responses[201] = { 
               description: 'Usuário criado com sucesso!' 
        } */
       return res.status(201).send({message: 'Usuário criado com sucesso!'})

    },

    async updateOneUser(req, res) {

        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para atualizar um usuário.'
        // #swagger.parameters['id'] = { description: 'ID do usuário.' }

        const { id } = req.params;
        const { name, email } = req.body;
        const users = getData('users.json');
        
        //Verificação se existe o usuário no banco de dados
        const existUser = users.filter((item) => item.id === Number(id));
        const [ user ] = existUser;

        //Se não existir, é retornado um erro 400
        if(!user) {
            /* #swagger.responses[404] = { 
               description: 'Usuário não encontrado.' 
            } */
            return res.status(404).send({ message: "Usuário não encontrado." })
        }

        //Populando o banco com os novos dados
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
        /* #swagger.responses[201] = { 
            description: 'Usuário atualizado com sucesso!.' 
        } */
        await createOrUpdateData('users.json', updateUser);
        return res.status(201).send({ message: 'Usuário atualizado com sucesso!' })
    },

    async oneUser(req, res) {
        
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para obter dados cadastrais de um usuário.'
        // #swagger.parameters['id'] = { description: 'ID do usuário.' }

        const { id } = req.params
        const users = getData('users.json')
        try {
            const user = users.filter((item) => item.id === Number(id))

            if (user.length === 0) {
                throw new Error('Não existe usuário na lista com este ID.')
            }
            /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/User" },
               description: 'Usuário encontrado com sucesso!' 
        } */
            await res.status(200).json({ message: 'Usuário encontrados com sucesso!', user })

        } catch (error) {
            /* #swagger.responses[404] = { 
               description: 'Não existe usuário na lista com este ID.' 
        }   */
            await res.status(404).json(error.message)
        }
    },

    async allUsers(req, res) {
        
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para obter dados cadastrais de todos os usuários do banco de dados.'

        const users = getData('users.json')

        if(!users) {
            /* #swagger.responses[404] = {
               description: 'Usuários não encontrados.' 
        } */
            await res.status(404).json('Usuários não encontrados')
        }

        /* #swagger.responses[200] = {
               description: 'Usuários encontrados.' 
        } */
        await res.status(200).json({ message: 'Usuários encontrados com sucesso!', users })
    }

}