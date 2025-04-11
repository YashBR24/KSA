// controllers/AccountController.js
const User = require('../models/user');
const Transaction = require('../models/Transaction');
const Institute = require('../models/Institute');
const mongoose = require('mongoose');
const { log } = require("../Logs/logs");

// Helper function to calculate balance from transactions (excluding deleted)
const calculateBalanceFromTransactions = async (instituteId) => {
    const transactions = await Transaction.find({
        institute: instituteId,
        isDeleted: false
    }).sort({ createdAt: 1 }); // Sort by date ascending

    let balance = 0;
    let totalIn = 0;
    let totalOut = 0;

    transactions.forEach(transaction => {
        if (transaction.amt_in_out === "IN") {
            balance += Number(transaction.amount);
            totalIn += Number(transaction.amount);
        } else if (transaction.amt_in_out === "OUT") {
            balance -= Number(transaction.amount);
            totalOut += Number(transaction.amount);
        }
    });

    return { balance, totalIn, totalOut };
};

// Get balance for a specific institute
const getInstituteBalance = async (req, res) => {
    try {
        const { userId, instituteId } = req.body;
        log(`FETCHING_INSTITUTE_BALANCE_${userId}_${instituteId}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json("User Not Found");
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INSTITUTE_NOT_FOUND_${instituteId}`);
            return res.status(404).json("Institute Not Found");
        }

        const balance = await calculateBalanceFromTransactions(instituteId);
        log(`INSTITUTE_BALANCE_FETCHED_${instituteId}_BALANCE_${balance}`);

        res.status(200).json({
            institute: institute.name,
            balance: balance
        });
    } catch (error) {
        log(`ERROR_FETCHING_INSTITUTE_BALANCE_${error.message}`);
        console.error("Error fetching institute balance:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

// Fetch transactions for a specific institute (excluding deleted)
const fetchInstituteTransactions = async (req, res) => {
    try {
        const { userId, instituteId } = req.body;
        log(`FETCHING_INSTITUTE_TRANSACTIONS_${userId}_${instituteId}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json("User Not Found");
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INSTITUTE_NOT_FOUND_${instituteId}`);
            return res.status(404).json("Institute Not Found");
        }

        const transactions = await Transaction.find({
            institute: instituteId,
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .populate('user', 'name')
            .populate('institute', 'name');

        log(`INSTITUTE_TRANSACTIONS_FETCHED_${instituteId}_COUNT_${transactions.length}`);
        res.status(200).json(transactions);
    } catch (error) {
        log(`ERROR_FETCHING_INSTITUTE_TRANSACTIONS_${error.message}`);
        console.error("Error fetching institute transactions:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

// Add new transaction
// const AddNewTransaction = async (req, res) => {
//     const { userId, amt_in_out, amount, method, description, instituteId } = req.body;
//
//     try {
//         log(`ADDING_NEW_TRANSACTION_${amt_in_out}_${amount}_${userId}_${instituteId}`);
//
//         const user = await User.findById(userId);
//         if (!user) {
//             log(`USER_NOT_FOUND_${userId}`);
//             return res.status(404).json({ message: "User Not Found", userId });
//         }
//
//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INSTITUTE_NOT_FOUND_${instituteId}`);
//             return res.status(404).json({ message: "Institute Not Found", instituteId });
//         }
//
//         const currentBalance = await calculateBalanceFromTransactions(instituteId);
//         let newBalance;
//
//         if (amt_in_out === "IN") {
//             newBalance = currentBalance + Number(amount);
//             log(`AMOUNT_IN_CALCULATED_${currentBalance}_TO_${newBalance}`);
//         } else if (amt_in_out === "OUT") {
//             if (Number(amount) > currentBalance) {
//                 log(`INSUFFICIENT_BALANCE_${currentBalance}_ATTEMPTED_${amount}`);
//                 return res.status(400).json({ message: "Insufficient Balance", currentBalance });
//             }
//             newBalance = currentBalance - Number(amount);
//             log(`AMOUNT_OUT_CALCULATED_${currentBalance}_TO_${newBalance}`);
//         } else {
//             log(`INVALID_TRANSACTION_TYPE_${amt_in_out}`);
//             return res.status(400).json({ message: "Invalid Transaction Type" });
//         }
//
//         const transaction = new Transaction({
//             amt_in_out,
//             amount,
//             description,
//             method,
//             balance_before_transaction: currentBalance,
//             balance_after_transaction: newBalance,
//             user: userId,
//             institute: instituteId,
//             institute_name: institute.name
//         });
//
//         await transaction.save();
//         log(`TRANSACTION_SAVED_${transaction._id}`);
//
//         res.status(200).json({
//             transaction,
//             balance: {
//                 institute: institute.name,
//                 before: currentBalance,
//                 after: newBalance
//             }
//         });
//     } catch (error) {
//         log(`ERROR_ADDING_TRANSACTION_${error.message}`);
//         console.error("Transaction Error:", error.message);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

const AddNewTransaction = async (req, res) => {
    const { userId, amt_in_out, amount, method, description, instituteId } = req.body;

    try {
        log(`ADDING_NEW_TRANSACTION_${amt_in_out}_${amount}_${userId}_${instituteId}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json({ message: "User Not Found", userId });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INSTITUTE_NOT_FOUND_${instituteId}`);
            return res.status(404).json({ message: "Institute Not Found", instituteId });
        }

        const { balance: currentBalance } = await calculateBalanceFromTransactions(instituteId);
        let newBalance;

        if (amt_in_out === "IN") {
            newBalance = currentBalance + Number(amount);
            log(`AMOUNT_IN_CALCULATED_${currentBalance}_TO_${newBalance}`);
        } else if (amt_in_out === "OUT") {
            if (Number(amount) > currentBalance) {
                log(`INSUFFICIENT_BALANCE_${currentBalance}_ATTEMPTED_${amount}`);
                return res.status(400).json({ message: "Insufficient Balance", currentBalance });
            }
            newBalance = currentBalance - Number(amount);
            log(`AMOUNT_OUT_CALCULATED_${currentBalance}_TO_${newBalance}`);
        } else {
            log(`INVALID_TRANSACTION_TYPE_${amt_in_out}`);
            return res.status(400).json({ message: "Invalid Transaction Type" });
        }

        const transaction = new Transaction({
            amt_in_out,
            amount: Number(amount),
            description,
            method,
            balance_before_transaction: currentBalance,
            balance_after_transaction: newBalance,
            user: userId,
            institute: instituteId,
            institute_name: institute.name
        });

        await transaction.save();
        log(`TRANSACTION_SAVED_${transaction._id}`);

        // Recalculate final balances after saving
        const { balance, totalIn, totalOut } = await calculateBalanceFromTransactions(instituteId);

        res.status(200).json({
            transaction,
            balance: {
                institute: institute.name,
                currentBalance: balance,
                totalIn,
                totalOut
            }
        });
    } catch (error) {
        log(`ERROR_ADDING_TRANSACTION_${error.message}`);
        console.error("Transaction Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// New soft delete transaction function
const deleteTransaction = async (req, res) => {
    try {
        const { userId, transactionId } = req.body;
        log(`DELETING_TRANSACTION_${transactionId}_BY_${userId}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json("User Not Found");
        }

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            log(`TRANSACTION_NOT_FOUND_${transactionId}`);
            return res.status(404).json("Transaction Not Found");
        }

        if (transaction.isDeleted) {
            log(`TRANSACTION_ALREADY_DELETED_${transactionId}`);
            return res.status(400).json("Transaction Already Deleted");
        }

        // Soft delete the transaction
        transaction.isDeleted = true;
        transaction.deletedAt = new Date();
        await transaction.save();

        const newBalance = await calculateBalanceFromTransactions(transaction.institute);

        log(`TRANSACTION_SOFT_DELETED_${transactionId}_NEW_BALANCE_${newBalance}`);
        res.status(200).json({
            message: "Transaction soft deleted successfully",
            transactionId: transaction._id,
            newBalance: newBalance
        });
    } catch (error) {
        log(`ERROR_DELETING_TRANSACTION_${error.message}`);
        console.error("Error deleting transaction:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

// Calculate institute transaction balance (excluding deleted)
// const calculateInstituteTransactionBalance = async (req, res) => {
//     try {
//         const { userId, instituteId } = req.body;
//         log(`CALCULATING_INSTITUTE_BALANCE_${userId}_${instituteId}`);
//
//         const user = await User.findById(userId);
//         if (!user) {
//             log(`USER_NOT_FOUND_${userId}`);
//             return res.status(404).json("User Not Found");
//         }
//
//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INSTITUTE_NOT_FOUND_${instituteId}`);
//             balance -= Number(transaction.amount);
//             return res.status(404).json("Institute Not Found");
//         }
//
//         const transactions = await Transaction.find({
//             institute: instituteId,
//             isDeleted: false
//         });
//
//         let totalIn = 0;
//         let totalOut = 0;
//
//         transactions.forEach(transaction => {
//             if (transaction.amt_in_out === "IN") {
//                 totalIn += Number(transaction.amount);
//             } else if (transaction.amt_in_out === "OUT") {
//                 totalOut += Number(transaction.amount);
//             }
//         });
//
//         const currentBalance = totalIn - totalOut;
//         log(`BALANCE_CALCULATED_${instituteId}_IN_${totalIn}_OUT_${totalOut}`);
//
//         res.status(200).json({
//             institute: institute.name,
//             totalIn,
//             totalOut,
//             currentBalance
//         });
//     } catch (error) {
//         log(`ERROR_CALCULATING_BALANCE_${error.message}`);
//         console.error("Error calculating transaction balance:", error.message);
//         res.status(500).json("Internal Server Error");
//     }
// };

// Calculate institute transaction balance
const calculateInstituteTransactionBalance = async (req, res) => {
    try {
        const { userId, instituteId } = req.body;
        log(`CALCULATING_INSTITUTE_BALANCE_${userId}_${instituteId}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json("User Not Found");
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INSTITUTE_NOT_FOUND_${instituteId}`);
            return res.status(404).json("Institute Not Found");
        }

        const { balance, totalIn, totalOut } = await calculateBalanceFromTransactions(instituteId);

        log(`BALANCE_CALCULATED_${instituteId}_IN_${totalIn}_OUT_${totalOut}`);

        res.status(200).json({
            institute: institute.name,
            totalIn,
            totalOut,
            currentBalance: balance
        });
    } catch (error) {
        log(`ERROR_CALCULATING_BALANCE_${error.message}`);
        console.error("Error calculating transaction balance:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

module.exports = {
    fetchInstituteTransactions,
    getInstituteBalance,
    AddNewTransaction,
    deleteTransaction,
    calculateInstituteTransactionBalance,
};