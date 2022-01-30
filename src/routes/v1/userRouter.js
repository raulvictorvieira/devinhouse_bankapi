const express = require('express');
const userRouter = express.Router();
const userController = require('../../controllers/userController');

userRouter.post('/user/', userController.createNewUser);
userRouter.patch('/user/:id', userController.updateOneUser);
userRouter.get('/user/:id', userController.oneUser);

module.exports = userRouter;