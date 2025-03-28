const express = require('express');
const router = express.Router();
const { fetchInstituteTransactions, getInstituteBalance, AddNewTransaction , calculateInstituteTransactionBalance } = require('../controllers/AccountController');

router.post('/balance', getInstituteBalance);
router.post('/transactions', fetchInstituteTransactions);
router.post('/transaction/add', AddNewTransaction);
router.post('/transaction/calculate-balance', calculateInstituteTransactionBalance);

module.exports = router;
