const express = require('express');
const router = express.Router();
const { fetchInstituteTransactions, getInstituteBalance, AddNewTransaction , calculateInstituteTransactionBalance , deleteTransaction } = require('../controllers/AccountController');

router.post('/balance', getInstituteBalance);
router.post('/transactions', fetchInstituteTransactions);
router.post('/transaction/add', AddNewTransaction);
router.post('/transaction/calculate-balance', calculateInstituteTransactionBalance);
router.post('/delete-transaction', deleteTransaction);

module.exports = router;
