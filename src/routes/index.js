const express = require('express');
const router = express.Router();
const userRouter = require('./v1/userRouter');
const financialRouter = require('./v1/financialRouter');

router.use('/api/v1', [userRouter, financialRouter]);

module.exports = router;