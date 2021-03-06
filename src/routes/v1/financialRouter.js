const express = require("express");
const financialRouter = express.Router();
const multer = require('multer');
const upload = multer();

const financialController = require("../../controllers/financialController");

financialRouter.post('/financial/:userID', upload.single('xlsxFile'), financialController.xlsxImportExpenses);
financialRouter.delete('/financial/:userID/:financialID', financialController.deleteTransaction);
financialRouter.get('/financial/:userID', financialController.totalExpenses);

module.exports = financialRouter;