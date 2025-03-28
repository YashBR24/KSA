// const User=require('../models/user');
// const mongoose = require('mongoose');
// const Transaction = require('../models/Transaction');
// const Balance = require('../models/Balance');
// const { log } = require("../Logs/logs")
// const bal_id="677ba181a9f86714ba5b860b"
// const fetchTransactions = async (req, res) => {
//     try{
//         const { userid } = req.body;
//         log(`FETCHING_TRANSACTIONS_${userid}`);
//         // //console.log(userid);
//         const result1 = await User.findById(userid);
//         if (!result1) {
//             return res.status(404).json("User Not Found");
//         }
//         // //console.log(1)
//         const trans = await Transaction.find();
//         // //console.log(trans)
//         res.status(200).json(trans);
//     }
//     catch(err){
//         log(`ERROR_FETCHING_TRANSACTIONS`);
//         //console.log(err)
//         return res.status(500).json({message:'SERVER ERROR'})
//     }
// };
//
// const fetchAccountsData = async (req,res) =>{
//     const { userid } = req.body;
//     log(`FETCHING_ACCOUNT_BALANCE_${userid}`);
//     // //console.log(1)
//     const result1 = await User.findById(userid);
//     if (!result1) {
//         return res.status(404).json("User Not Found");
//     }
//     // //console.log(2)
//     const bal=await Balance.findById(bal_id);
//     //console.log(bal)
//     res.status(200).json(bal);
// }
//
// const AddNewTransaction = async (req, res) => {
//     //console.log("NEW TRANSACTION");
//     const { userid, amt_in_out, amount,method, description } = req.body;
//
//     try {
//         log(`ADDING_NEW_TRANSACTION_${amt_in_out}_${amount}_${userid}`);
//         // Fetch balance record
//         const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
//         if (!balance1) {
//             return res.status(404).json("Balance record not found");
//         }
//
//         const bal = balance1.balance;
//         //console.log("BALANCE_FETCHED");
//
//         let balance_after_transaction, balance_before_transaction;
//
//         if (amt_in_out === "IN") {
//             //console.log("AMOUNT_IN");
//             balance_after_transaction = Number(bal) + Number(amount);
//             balance_before_transaction = bal;
//             //console.log("2_FIELDS_UPDATED");
//         } else if (amt_in_out === "OUT") {
//             //console.log("AMOUNT_OUT");
//             if (amount > bal) {
//                 return res.status(400).json("Amount should not be greater than Balance");
//             }
//             balance_after_transaction =Number(bal) - Number(amount);
//             balance_before_transaction = bal;
//             //console.log("2_FIELDS_UPDATED");
//         } else {
//             //console.log("INVALID_OPTION");
//             return res.status(400).json("Invalid Option");
//         }
//
//         // Create and save the transaction
//         const transaction = new Transaction({
//             amt_in_out,
//             amount,
//             description,
//             balance_before_transaction,
//             method,
//             balance_after_transaction,
//         });
//
//         //console.log("DATA_LOADED");
//         balance1.balance=balance_after_transaction;
//         await balance1.save();
//         await transaction.save();
//         //console.log("DATA_SAVED");
//         log(`TRANSACTION_SUCCESSFULL`);
//         res.status(200).json(transaction);
//     } catch (error) {
//         log(`ERROR_ADDING_TRANSACTION`);
//         console.error(error.message);
//         res.status(500).json("Internal Server Error");
//     }
// };
//
// module.exports = { fetchTransactions,fetchAccountsData,AddNewTransaction };


const User = require('../models/user');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Institute = require('../models/Institute');
const { log } = require("../Logs/logs");

// Helper function to calculate balance from transactions
const calculateBalanceFromTransactions = async (instituteId) => {
    const transactions = await Transaction.find({ institute: instituteId });
    let balance = 0;
    transactions.forEach(transaction => {
        if (transaction.amt_in_out === "IN") {
            balance += Number(transaction.amount);
        } else if (transaction.amt_in_out === "OUT") {
            balance -= Number(transaction.amount);
        }
    });
    return balance;
};

const fetchTransactions = async (req, res) => {
    try {
        const { userid } = req.body;
        log(`FETCHING_TRANSACTIONS_${userid}`);

        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(404).json("User Not Found");
        }

        const trans = await Transaction.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name')
            .populate('institute', 'name');

        res.status(200).json(trans);
    } catch (err) {
        log(`ERROR_FETCHING_TRANSACTIONS_${userid}`);
        console.error('Error fetching transactions:', err);
        return res.status(500).json({ message: 'SERVER ERROR' });
    }
};

const fetchAccountsData = async (req, res) => {
    try {
        const { userid, instituteId } = req.body;
        log(`FETCHING_ACCOUNT_BALANCE_${userid}`);

        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(404).json("User Not Found");
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            return res.status(404).json("Institute Not Found");
        }

        const balance = await calculateBalanceFromTransactions(instituteId);

        res.status(200).json({
            institute: institute.name,
            balance: balance
        });
    } catch (err) {
        log(`ERROR_FETCHING_ACCOUNT_BALANCE_${userid}`);
        console.error('Error fetching account balance:', err);
        res.status(500).json({ message: 'SERVER ERROR' });
    }
};

const AddNewTransaction = async (req, res) => {
    const { userId, amt_in_out, amount, method, description, instituteId } = req.body;

    try {
        log(`ADDING_NEW_TRANSACTION_${amt_in_out}_${amount}_${userId}`);

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found", userId });
        }

        // Verify institute exists
        const institute = await Institute.findById(instituteId);
        if (!institute) {
            return res.status(404).json({ message: "Institute Not Found", instituteId });
        }

        // Calculate current balance from existing transactions
        const currentBalance = await calculateBalanceFromTransactions(instituteId);
        let newBalance;

        // Calculate new balance based on transaction type
        if (amt_in_out === "IN") {
            newBalance = currentBalance + Number(amount);
        } else if (amt_in_out === "OUT") {
            if (Number(amount) > currentBalance) {
                return res.status(400).json({ message: "Insufficient Balance", currentBalance });
            }
            newBalance = currentBalance - Number(amount);
        } else {
            return res.status(400).json({ message: "Invalid Transaction Type" });
        }

        // Create new transaction
        const transaction = new Transaction({
            amt_in_out,
            amount,
            description,
            method,
            balance_before_transaction: currentBalance,
            balance_after_transaction: newBalance,
            user: userId,
            institute: instituteId,
            institute_name: institute.name
        });

        // Save the transaction
        await transaction.save();

        log(`TRANSACTION_SUCCESSFULL_${userId}`);
        res.status(200).json({
            transaction,
            balance: {
                institute: institute.name,
                before: currentBalance,
                after: newBalance
            }
        });
    } catch (error) {
        log(`ERROR_ADDING_TRANSACTION_${userId}`);
        console.error("Transaction Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get balance for a specific institute
const getInstituteBalance = async (req, res) => {
    try {
        const { userId, instituteId } = req.body;
        log(`FETCHING_INSTITUTE_BALANCE_${instituteId}`);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User Not Found");
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            return res.status(404).json("Institute Not Found");
        }

        const balance = await calculateBalanceFromTransactions(instituteId);

        res.status(200).json({
            institute: institute.name,
            balance: balance
        });
    } catch (error) {
        log(`ERROR_FETCHING_INSTITUTE_BALANCE_${instituteId}`);
        console.error("Error fetching institute balance:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

// Fetch transactions for a specific institute
const fetchInstituteTransactions = async (req, res) => {
    try {
        const { userId, instituteId } = req.body;
        log(`FETCHING_INSTITUTE_TRANSACTIONS_${instituteId}`);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User Not Found");
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            return res.status(404).json("Institute Not Found");
        }

        const transactions = await Transaction.find({ institute: instituteId })
            .sort({ createdAt: -1 })
            .populate('user', 'name')
            .populate('institute', 'name');

        res.status(200).json(transactions);
    } catch (error) {
        log(`ERROR_FETCHING_INSTITUTE_TRANSACTIONS_${instituteId}`);
        console.error("Error fetching institute transactions:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

// Calculate institute transaction balance
const calculateInstituteTransactionBalance = async (req, res) => {
    try {
        const { userId, instituteId } = req.body;
        log(`CALCULATING_INSTITUTE_BALANCE_${instituteId}`);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User Not Found");
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            return res.status(404).json("Institute Not Found");
        }

        const transactions = await Transaction.find({ institute: instituteId });

        let totalIn = 0;
        let totalOut = 0;

        transactions.forEach(transaction => {
            if (transaction.amt_in_out === "IN") {
                totalIn += Number(transaction.amount);
            } else if (transaction.amt_in_out === "OUT") {
                totalOut += Number(transaction.amount);
            }
        });

        const currentBalance = totalIn - totalOut;

        res.status(200).json({
            institute: institute.name,
            totalIn,
            totalOut,
            currentBalance
        });
    } catch (error) {
        log(`ERROR_CALCULATING_INSTITUTE_BALANCE_${instituteId}`);
        console.error("Error calculating transaction balance:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

module.exports = {
    fetchTransactions,
    fetchAccountsData,
    AddNewTransaction,
    getInstituteBalance,
    fetchInstituteTransactions,
    calculateInstituteTransactionBalance,
};