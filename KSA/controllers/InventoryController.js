// const User = require('../models/user');
// const Inventory = require('../models/inventory');
// const Transaction = require('../models/Transaction');
// const { log } = require("../Logs/logs")
// const Balance = require('../models/Balance');
// const mongoose = require("mongoose");
// const bal_id="677ba181a9f86714ba5b860b";
// const Alot = require("../models/alotinv");
// const fetchInventory = async (req, res) => {
//     try {
//         const { userid }= req.body;
//         log(`FETCHING_ALL_INVENTORY`)
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             return res.status(404).json({ message: "Manager not found" });
//         }
//         const data = await Inventory.find({delete: false})
//
//         return res.status(200).json(data)
//     } catch (err){
//         log(`ERROR_FETCHING_INVENTORY`)
//         //console.log(err);
//         return res.status(500).json({message:"SERVER ERROR"})
//     }
// }
//
// const AddInventory = async (req,res)=>{
//     try {
//         //console.log("ADDING_INV")
//         //console.log(1)
//         const { userid, name,amount,qty,description }= req.body;
//         log(`ADDING_INVENTORY_${name}_${amount}_${qty}`)
//         //console.log(2)
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             //console.log(3)
//             return res.status(404).json({ message: "Manager not found" });
//         }
//         //console.log(4)
//         const data = new Inventory({
//             name,amount,qty,description
//         });
//         //console.log(5)
//         data.save();
//         //console.log(6)
//
//         //console.log("ADDED_INV")
//         return res.status(200).json({message: "SUCCESSFULLY ADDED "+name+":{"+qty+"}"})
//     } catch (err){
//         log(`ERROR_ADDING_INVENTORY`)
//         //console.log(7)
//         //console.log(err)
//         return res.status(500).json({message:"SERVER ERROR"})
//     }
// }
//
// const UpdateInventory = async (req, res) => {
//     try {
//         const { userid, invid, name, amount, qty, description} = req.body;
//         log(`UPDATING_INVENTORY_${invid}_BY${userid}`)
//         // Check if the user is a Manager
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             return res.status(404).json({ message: "Manager not found" });
//         }
//
//         // Find and update the inventory item
//         const updatedInventory = await Inventory.findByIdAndUpdate(
//             invid,
//             {
//                 name,
//                 amount,
//                 qty,
//                 description,
//                 updatedAt: Date.now() // Update the `updatedAt` timestamp
//             },
//             { new: true } // Return the updated document
//         );
//
//         if (!updatedInventory) {
//             return res.status(404).json({ message: "Inventory item not found" });
//         }
//
//         return res.status(200).json({ message: "Inventory updated successfully", data: updatedInventory });
//     } catch (err) {
//         log(`ERROR_UPDATING_INVENTORY`)
//         //console.log(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// };
//
// const AddQty = async (req,res)=>{
//     try {
//         //console.log(1)
//         const {userid, invid, qty} = req.body;
//         log(`ADDING_INVENTORY_QTY_${invid}_${qty}`)
//         const manager = await User.findOne({role: "Manager", _id: new mongoose.Types.ObjectId(userid)});
//         if (!manager) {
//             //console.log(2)
//             return res.status(404).json({message: "Manager not found"});
//         }
//         //console.log(3)
//         const data = await Inventory.findById(invid);
//         if (!data) {
//             //console.log(4)
//             return res.status(404).json({ message: "Inventory item not found" });
//         }
//         //console.log(5)
//         data.qty = Number(data.qty)+Number(qty);
//         data.updatedAt = Date.now();
//         data.save();
//         //console.log(6)
//
//         return res.status(200).json({message:"SUCCESSFULLY ADDED QTY"})
//     } catch (err){
//         //console.log(7)
//         //console.log(err);
//         log(`ERROR_ADDING_INVENTORY_QTY`)
//         return res.status(500).json({message:"SERVER ERROR"})
//     }
// }
//
// const AlotInventory = async (req,res)=>{
//     try {
//         const {userid, invid, name, amount, qty, description,payment_method} = req.body;
//         log(`ALOTTING_INVENTORY_TO_${name}_${amount}_${qty}_${invid}_BY_${userid}`)
//         const manager = await User.findOne({role: "Manager", _id: new mongoose.Types.ObjectId(userid)});
//         if (!manager) {
//             return res.status(404).json({message: "Manager not found"});
//         }
//         const dt = await Inventory.findById(invid);
//         if (!dt) {
//             return res.status(404).json({ message: "Inventory item not found" });
//         }
//         if (dt.qty<1 || dt.qty<qty){
//             return res.status(404).json({ message: "Inventory item has no quantity" });
//         }
//         const data = new Alot({
//             name,amount,qty,description,inv_id:invid,payment_method
//         })
//         data.save()
//         dt.qty=Number(dt.qty) - Number(qty);
//         dt.save()
//         if (amount>0) {
//             const balance1 = await Balance.findById(bal_id); // Ensure `bal_id` is provided in your request
//             if (!balance1) {
//                 return res.status(404).json("Balance record not found");
//             }
//             const bal = balance1.balance;
//             let balance_after_transaction;
//             balance_after_transaction = Number(bal) + Number(amount);
//             const newTrans = new Transaction({
//                 amt_in_out: "IN",
//                 amount,
//                 description: `INVENTORY_${dt.name}_${name}`,
//                 balance_before_transaction: bal,
//                 method: payment_method,
//                 balance_after_transaction,
//                 identification: "INVENTORY_" + dt._id.toHexString()
//             })
//             newTrans.save();
//             balance1.balance = balance_after_transaction;
//             balance1.save();
//         }
//         return res.status(200).json({message:"SUCCESSFULLY GIVEN INVENTORY"})
//     }
//     catch (err){
//         log(`ERROR_ALLOTING_INVENTORY`)
//         //console.log(err)
//         return res.status(500).json({message:"SERVER ERROR"})
//     }
// }
//
// const FetchGivenInv = async (req,res)=>{
//     try{
//         const {userid,invid} = req.body;
//         log(`FETCHING_GIVEN_INVENTORIES_${invid}`)
//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             return res.status(404).json({ message: "Manager not found" });
//         }
//         const inventory = await Inventory.findById(invid);
//         if (!inventory){
//             return res.status(404).json({ message: "Inventory item not found" });
//         }
//         const data = await Alot.find({inv_id: new mongoose.Types.ObjectId(invid)})
//         return res.status(200).json(data)
//
//     } catch (err){
//         log(`ERROR_FETCHING_INVENTORIES_GIVEN`)
//         //console.log(err);
//         return res.status(500).json({message:"SERVER ERROR"})
//     }
// }
//
// module.exports = { AlotInventory,fetchInventory, AddInventory, UpdateInventory,FetchGivenInv, AddQty };

// const User = require('../models/user');
// const Inventory = require('../models/inventory');
// const Transaction = require('../models/Transaction');
// const Institute = require('../models/Institute');
// const mongoose = require("mongoose");
// const Alot = require("../models/alotinv");
// const { log } = require("../Logs/logs");

// // Helper function to calculate balance from transactions for an institute
// const calculateBalanceFromTransactions = async (instituteId) => {
//     const transactions = await Transaction.find({ institute: instituteId });
//     let balance = 0;
//     transactions.forEach(transaction => {
//         if (transaction.amt_in_out === "IN") {
//             balance += Number(transaction.amount);
//         } else if (transaction.amt_in_out === "OUT") {
//             balance -= Number(transaction.amount);
//         }
//     });
//     return balance;
// };

// const fetchInventory = async (req, res) => {
//     try {
//         const { userid, instituteId } = req.body;
//         log(`FETCHING_ALL_INVENTORY_${instituteId || 'ALL'}`);

//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             log(`INVALID_MANAGER_${userid}`);
//             return res.status(404).json({ message: "Manager not found" });
//         }

//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INVALID_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Institute not found" });
//         }

//         const data = await Inventory.find({ delete: false, institute: instituteId });
//         return res.status(200).json(data);
//     } catch (err) {
//         log(`ERROR_FETCHING_INVENTORY_${instituteId || 'UNKNOWN'}`);
//         console.error(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// };

// const AddInventory = async (req, res) => {
//     try {
//         const { userid, instituteId, name, amount, qty, description } = req.body;
//         log(`ADDING_INVENTORY_${name}_${amount}_${qty}_INSTITUTE_${instituteId}`);

//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             log(`INVALID_MANAGER_${userid}`);
//             return res.status(404).json({ message: "Manager not found" });
//         }

//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INVALID_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Institute not found" });
//         }

//         const data = new Inventory({
//             name,
//             amount,
//             qty,
//             description,
//             institute: instituteId
//         });
//         await data.save();

//         log(`SUCCESSFULLY_ADDED_INVENTORY_${data._id.toHexString()}`);
//         return res.status(200).json({ message: `SUCCESSFULLY ADDED ${name}:{${qty}} to ${institute.name}` });
//     } catch (err) {
//         log(`ERROR_ADDING_INVENTORY_${name || 'UNKNOWN'}`);
//         console.error(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// };

// const UpdateInventory = async (req, res) => {
//     try {
//         const { userid, instituteId, invid, name, amount, qty, description } = req.body;
//         log(`UPDATING_INVENTORY_${invid}_BY_${userid}`);

//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             log(`INVALID_MANAGER_${userid}`);
//             return res.status(404).json({ message: "Manager not found" });
//         }

//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INVALID_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Institute not found" });
//         }

//         const existingInventory = await Inventory.findOne({ _id: invid, institute: instituteId });
//         if (!existingInventory) {
//             log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Inventory item not found for this institute" });
//         }

//         const updateFields = {};
//         if (name !== undefined) updateFields.name = name;
//         if (amount !== undefined) updateFields.amount = amount;
//         if (qty !== undefined) updateFields.qty = qty;
//         if (description !== undefined) updateFields.description = description;
//         updateFields.updatedAt = Date.now();

//         const updatedInventory = await Inventory.findByIdAndUpdate(invid, updateFields, { new: true });

//         log(`SUCCESSFULLY_UPDATED_INVENTORY_${invid}`);
//         return res.status(200).json({ message: "Inventory updated successfully", data: updatedInventory });
//     } catch (err) {
//         log(`ERROR_UPDATING_INVENTORY_${invid || 'UNKNOWN'}`);
//         console.error(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// };

// const AddQty = async (req, res) => {
//     try {
//         const { userid, instituteId, invid, qty } = req.body;
//         log(`ADDING_INVENTORY_QTY_${invid}_${qty}`);

//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             log(`INVALID_MANAGER_${userid}`);
//             return res.status(404).json({ message: "Manager not found" });
//         }

//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INVALID_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Institute not found" });
//         }

//         const data = await Inventory.findOne({ _id: invid, institute: instituteId });
//         if (!data) {
//             log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Inventory item not found for this institute" });
//         }

//         data.qty = Number(data.qty) + Number(qty);
//         data.updatedAt = Date.now();
//         await data.save();

//         log(`SUCCESSFULLY_ADDED_QTY_${invid}`);
//         return res.status(200).json({ message: "SUCCESSFULLY ADDED QTY" });
//     } catch (err) {
//         log(`ERROR_ADDING_INVENTORY_QTY_${invid || 'UNKNOWN'}`);
//         console.error(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// };

// const AlotInventory = async (req, res) => {
//     try {
//         const { userid, instituteId, invid, name, amount, qty, description, payment_method } = req.body;
//         log(`ALOTTING_INVENTORY_TO_${name}_${amount}_${qty}_${invid}_BY_${userid}`);

//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             log(`INVALID_MANAGER_${userid}`);
//             return res.status(404).json({ message: "Manager not found" });
//         }

//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INVALID_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Institute not found" });
//         }

//         const dt = await Inventory.findOne({ _id: invid, institute: instituteId });
//         if (!dt) {
//             log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Inventory item not found for this institute" });
//         }

//         if (dt.qty < 1 || dt.qty < qty) {
//             log(`INSUFFICIENT_QTY_${invid}_${dt.qty}_REQUESTED_${qty}`);
//             return res.status(404).json({ message: "Insufficient quantity in inventory" });
//         }

//         const data = new Alot({
//             name,
//             amount,
//             qty,
//             description,
//             inv_id: invid,
//             payment_method,
//             institute: instituteId
//         });
//         await data.save();

//         dt.qty = Number(dt.qty) - Number(qty);
//         await dt.save();

//         if (amount > 0) {
//             const balanceBefore = await calculateBalanceFromTransactions(instituteId);
//             const balanceAfter = balanceBefore + Number(amount);

//             const newTrans = new Transaction({
//                 amt_in_out: "IN",
//                 amount,
//                 description: `INVENTORY_${dt.name}_${name}`,
//                 balance_before_transaction: balanceBefore,
//                 method: payment_method || 'CASH',
//                 balance_after_transaction: balanceAfter,
//                 identification: `INVENTORY_${dt._id.toHexString()}`,
//                 user: userid,
//                 institute: instituteId,
//                 institute_name: institute.name
//             });

//             await newTrans.save();
//             log(`TRANSACTION_RECORDED_INVENTORY_${data._id.toHexString()}_${amount}`);
//         }

//         log(`SUCCESSFULLY_ALLOTTED_INVENTORY_${data._id.toHexString()}`);
//         return res.status(200).json({ message: "SUCCESSFULLY ALLOTTED INVENTORY" });
//     } catch (err) {
//         log(`ERROR_ALLOTING_INVENTORY_${invid || 'UNKNOWN'}`);
//         console.error(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// };

// const FetchGivenInv = async (req, res) => {
//     try {
//         const { userid, instituteId, invid } = req.body;
//         log(`FETCHING_GIVEN_INVENTORIES_${invid}`);

//         const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//         if (!manager) {
//             log(`INVALID_MANAGER_${userid}`);
//             return res.status(404).json({ message: "Manager not found" });
//         }

//         const institute = await Institute.findById(instituteId);
//         if (!institute) {
//             log(`INVALID_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Institute not found" });
//         }

//         const inventory = await Inventory.findOne({ _id: invid, institute: instituteId });
//         if (!inventory) {
//             log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//             return res.status(404).json({ message: "Inventory item not found for this institute" });
//         }

//         const data = await Alot.find({
//             inv_id: new mongoose.Types.ObjectId(invid),
//             institute: instituteId
//         });

//         log(`SUCCESSFULLY_FETCHED_GIVEN_INVENTORIES_${invid}`);
//         return res.status(200).json(data);
//     } catch (err) {
//         log(`ERROR_FETCHING_INVENTORIES_GIVEN_${invid || 'UNKNOWN'}`);
//         console.error(err);
//         return res.status(500).json({ message: "SERVER ERROR" });
//     }
// };

// module.exports = {
//     AlotInventory,
//     fetchInventory,
//     AddInventory,
//     UpdateInventory,
//     FetchGivenInv,
//     AddQty
// };






// const User = require('../models/user');
//    const Inventory = require('../models/inventory');
//    const Transaction = require('../models/Transaction');
//    const Institute = require('../models/Institute');
//    const InventoryTransaction = require('../models/InventoryTransaction');
//    const mongoose = require("mongoose");
//    const Alot = require("../models/alotinv");
//    const { log } = require("../Logs/logs");

//    // Helper function to calculate balance from transactions for an institute
//    const calculateBalanceFromTransactions = async (instituteId) => {
//        const transactions = await Transaction.find({ institute: instituteId });
//        let balance = 0;
//        transactions.forEach(transaction => {
//            if (transaction.amt_in_out === "IN") {
//                balance += Number(transaction.amount);
//            } else if (transaction.amt_in_out === "OUT") {
//                balance -= Number(transaction.amount);
//            }
//        });
//        return balance;
//    };

//    const fetchInventory = async (req, res) => {
//        try {
//            const { userid, instituteId } = req.body;
//            log(`FETCHING_ALL_INVENTORY_${instituteId || 'ALL'}`);

//            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//            if (!manager) {
//                log(`INVALID_MANAGER_${userid}`);
//                return res.status(404).json({ message: "Manager not found" });
//            }

//            const institute = await Institute.findById(instituteId);
//            if (!institute) {
//                log(`INVALID_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Institute not found" });
//            }

//            const data = await Inventory.find({ delete: false, institute: instituteId });
//            return res.status(200).json(data);
//        } catch (err) {
//            log(`ERROR_FETCHING_INVENTORY_${instituteId || 'UNKNOWN'}`);
//            console.error(err);
//            return res.status(500).json({ message: "SERVER ERROR" });
//        }
//    };

//    const AddInventory = async (req, res) => {
//        try {
//            const { userid, instituteId, name, amount, qty, description } = req.body;
//            log(`ADDING_INVENTORY_${name}_${amount}_${qty}_INSTITUTE_${instituteId}`);

//            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//            if (!manager) {
//                log(`INVALID_MANAGER_${userid}`);
//                return res.status(404).json({ message: "Manager not found" });
//            }

//            const institute = await Institute.findById(instituteId);
//            if (!institute) {
//                log(`INVALID_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Institute not found" });
//            }

//            const data = new Inventory({
//                name,
//                amount,
//                qty,
//                description,
//                institute: instituteId
//            });
//            await data.save();

//            log(`SUCCESSFULLY_ADDED_INVENTORY_${data._id.toHexString()}`);
//            return res.status(200).json({ message: `SUCCESSFULLY ADDED ${name}:{${qty}} to ${institute.name}` });
//        } catch (err) {
//            log(`ERROR_ADDING_INVENTORY_${name || 'UNKNOWN'}`);
//            console.error(err);
//            return res.status(500).json({ message: "SERVER ERROR" });
//        }
//    };

//    const UpdateInventory = async (req, res) => {
//        try {
//            const { userid, instituteId, invid, name, amount, qty, description } = req.body;
//            log(`UPDATING_INVENTORY_${invid}_BY_${userid}`);

//            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//            if (!manager) {
//                log(`INVALID_MANAGER_${userid}`);
//                return res.status(404).json({ message: "Manager not found" });
//            }

//            const institute = await Institute.findById(instituteId);
//            if (!institute) {
//                log(`INVALID_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Institute not found" });
//            }

//            const existingInventory = await Inventory.findOne({ _id: invid, institute: instituteId });
//            if (!existingInventory) {
//                log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Inventory item not found for this institute" });
//            }

//            const updateFields = {};
//            if (name !== undefined) updateFields.name = name;
//            if (amount !== undefined) updateFields.amount = amount;
//            if (qty !== undefined) updateFields.qty = qty;
//            if (description !== undefined) updateFields.description = description;
//            updateFields.updatedAt = Date.now();

//            const updatedInventory = await Inventory.findByIdAndUpdate(invid, updateFields, { new: true });

//            log(`SUCCESSFULLY_UPDATED_INVENTORY_${invid}`);
//            return res.status(200).json({ message: "Inventory updated successfully", data: updatedInventory });
//        } catch (err) {
//            log(`ERROR_UPDATING_INVENTORY_${invid || 'UNKNOWN'}`);
//            console.error(err);
//            return res.status(500).json({ message: "SERVER ERROR" });
//        }
//    };

//    const AddQty = async (req, res) => {
//        try {
//            const { userid, instituteId, invid, qty } = req.body;
//            log(`ADDING_INVENTORY_QTY_${invid}_${qty}`);

//            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//            if (!manager) {
//                log(`INVALID_MANAGER_${userid}`);
//                return res.status(404).json({ message: "Manager not found" });
//            }

//            const institute = await Institute.findById(instituteId);
//            if (!institute) {
//                log(`INVALID_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Institute not found" });
//            }

//            const data = await Inventory.findOne({ _id: invid, institute: instituteId });
//            if (!data) {
//                log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Inventory item not found for this institute" });
//            }

//            data.qty = Number(data.qty) + Number(qty);
//            data.updatedAt = Date.now();
//            await data.save();

//            // Record inventory transaction
//            const invTransaction = new InventoryTransaction({
//                inv_id: invid,
//                type: 'ADD',
//                qty: Number(qty),
//                amount: 0,
//                description: `Added ${qty} units to inventory`,
//                institute: instituteId,
//                user: userid
//            });
//            await invTransaction.save();

//            log(`SUCCESSFULLY_ADDED_QTY_${invid}`);
//            return res.status(200).json({ message: "SUCCESSFULLY ADDED QTY" });
//        } catch (err) {
//            log(`ERROR_ADDING_INVENTORY_QTY_${invid || 'UNKNOWN'}`);
//            console.error(err);
//            return res.status(500).json({ message: "SERVER ERROR" });
//        }
//    };

//    const AlotInventory = async (req, res) => {
//        try {
//            const { userid, instituteId, invid, name, amount, qty, description, payment_method } = req.body;
//            log(`ALOTTING_INVENTORY_TO_${name}_${amount}_${qty}_${invid}_BY_${userid}`);

//            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//            if (!manager) {
//                log(`INVALID_MANAGER_${userid}`);
//                return res.status(404).json({ message: "Manager not found" });
//            }

//            const institute = await Institute.findById(instituteId);
//            if (!institute) {
//                log(`INVALID_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Institute not found" });
//            }

//            const dt = await Inventory.findOne({ _id: invid, institute: instituteId });
//            if (!dt) {
//                log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Inventory item not found for this institute" });
//            }

//            if (dt.qty < 1 || dt.qty < qty) {
//                log(`INSUFFICIENT_QTY_${invid}_${dt.qty}_REQUESTED_${qty}`);
//                return res.status(404).json({ message: "Insufficient quantity in inventory" });
//            }

//            const data = new Alot({
//                name,
//                amount,
//                qty,
//                description,
//                inv_id: invid,
//                payment_method,
//                institute: instituteId
//            });
//            await data.save();

//            dt.qty = Number(dt.qty) - Number(qty);
//            await dt.save();

//            // Record inventory transaction
//            const invTransaction = new InventoryTransaction({
//                inv_id: invid,
//                type: 'ALLOT',
//                qty: Number(qty),
//                amount: Number(amount),
//                description: description || `Allotted ${qty} units to ${name}`,
//                payment_method: payment_method || 'CASH',
//                institute: instituteId,
//                user: userid
//            });
//            await invTransaction.save();

//            if (amount > 0) {
//                const balanceBefore = await calculateBalanceFromTransactions(instituteId);
//                const balanceAfter = balanceBefore + Number(amount);

//                const newTrans = new Transaction({
//                    amt_in_out: "IN",
//                    amount,
//                    description: `INVENTORY_${dt.name}_${name}`,
//                    balance_before_transaction: balanceBefore,
//                    method: payment_method || 'CASH',
//                    balance_after_transaction: balanceAfter,
//                    identification: `INVENTORY_${dt._id.toHexString()}`,
//                    user: userid,
//                    institute: instituteId,
//                    institute_name: institute.name
//                });

//                await newTrans.save();
//                log(`TRANSACTION_RECORDED_INVENTORY_${data._id.toHexString()}_${amount}`);
//            }

//            log(`SUCCESSFULLY_ALLOTTED_INVENTORY_${data._id.toHexString()}`);
//            return res.status(200).json({ message: "SUCCESSFULLY ALLOTTED INVENTORY" });
//        } catch (err) {
//            log(`ERROR_ALLOTING_INVENTORY_${invid || 'UNKNOWN'}`);
//            console.error(err);
//            return res.status(500).json({ message: "SERVER ERROR" });
//        }
//    };

//    const FetchGivenInv = async (req, res) => {
//        try {
//            const { userid, instituteId, invid } = req.body;
//            log(`FETCHING_GIVEN_INVENTORIES_${invid}`);

//            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//            if (!manager) {
//                log(`INVALID_MANAGER_${userid}`);
//                return res.status(404).json({ message: "Manager not found" });
//            }

//            const institute = await Institute.findById(instituteId);
//            if (!institute) {
//                log(`INVALID_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Institute not found" });
//            }

//            const inventory = await Inventory.findOne({ _id: invid, institute: instituteId });
//            if (!inventory) {
//                log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Inventory item not found for this institute" });
//            }

//            const data = await Alot.find({
//                inv_id: new mongoose.Types.ObjectId(invid),
//                institute: instituteId
//            });

//            log(`SUCCESSFULLY_FETCHED_GIVEN_INVENTORIES_${invid}`);
//            return res.status(200).json(data);
//        } catch (err) {
//            log(`ERROR_FETCHING_INVENTORIES_GIVEN_${invid || 'UNKNOWN'}`);
//            console.error(err);
//            return res.status(500).json({ message: "SERVER ERROR" });
//        }
//    };

//    const FetchInventoryTransactions = async (req, res) => {
//        try {
//            const { userid, instituteId, invid } = req.body;
//            log(`FETCHING_INVENTORY_TRANSACTIONS_${invid || 'ALL'}`);

//            const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
//            if (!manager) {
//                log(`INVALID_MANAGER_${userid}`);
//                return res.status(404).json({ message: "Manager not found" });
//            }

//            const institute = await Institute.findById(instituteId);
//            if (!institute) {
//                log(`INVALID_INSTITUTE_${instituteId}`);
//                return res.status(404).json({ message: "Institute not found" });
//            }

//            const query = { institute: instituteId };
//            if (invid) {
//                query.inv_id = new mongoose.Types.ObjectId(invid);
//                const inventory = await Inventory.findOne({ _id: invid, institute: instituteId });
//                if (!inventory) {
//                    log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
//                    return res.status(404).json({ message: "Inventory item not found for this institute" });
//                }
//            }

//            const data = await InventoryTransaction.find(query)
//                .populate('inv_id', 'name')
//                .sort({ createdAt: -1 });

//            log(`SUCCESSFULLY_FETCHED_INVENTORY_TRANSACTIONS_${invid || 'ALL'}`);
//            return res.status(200).json(data);
//        } catch (err) {
//            log(`ERROR_FETCHING_INVENTORY_TRANSACTIONS_${invid || 'UNKNOWN'}`);
//            console.error(err);
//            return res.status(500).json({ message: "SERVER ERROR" });
//        }
//    };

//    module.exports = {
//        AlotInventory,
//        fetchInventory,
//        AddInventory,
//        UpdateInventory,
//        FetchGivenInv,
//        AddQty,
//        FetchInventoryTransactions
//    };



const User = require('../models/user');
const Inventory = require('../models/inventory');
const Transaction = require('../models/Transaction');
const Institute = require('../models/Institute');
const InventoryTransaction = require('../models/InventoryTransaction');
const mongoose = require("mongoose");
const Alot = require("../models/alotinv");
const { log } = require("../Logs/logs");

// Helper function to calculate balance from transactions for an institute
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

const fetchInventory = async (req, res) => {
    try {
        const { userid, instituteId } = req.body;
        log(`FETCHING_ALL_INVENTORY_${instituteId || 'ALL'}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const data = await Inventory.find({ delete: false, institute: instituteId });
        return res.status(200).json(data);
    } catch (err) {
        log(`ERROR_FETCHING_INVENTORY_${instituteId || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

const AddInventory = async (req, res) => {
    try {
        const { userid, instituteId, name, amount, qty, description } = req.body;
        log(`ADDING_INVENTORY_${name}_${amount}_${qty}_INSTITUTE_${instituteId}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const data = new Inventory({
            name,
            amount,
            qty,
            description,
            institute: instituteId
        });
        await data.save();

        log(`SUCCESSFULLY_ADDED_INVENTORY_${data._id.toHexString()}`);
        return res.status(200).json({ message: `SUCCESSFULLY ADDED ${name}:{${qty}} to ${institute.name}` });
    } catch (err) {
        log(`ERROR_ADDING_INVENTORY_${name || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

const UpdateInventory = async (req, res) => {
    try {
        const { userid, instituteId, invid, name, amount, qty, description } = req.body;
        log(`UPDATING_INVENTORY_${invid}_BY_${userid}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const existingInventory = await Inventory.findOne({ _id: invid, institute: instituteId });
        if (!existingInventory) {
            log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Inventory item not found for this institute" });
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (amount !== undefined) updateFields.amount = amount;
        if (qty !== undefined) updateFields.qty = qty;
        if (description !== undefined) updateFields.description = description;
        updateFields.updatedAt = Date.now();

        const updatedInventory = await Inventory.findByIdAndUpdate(invid, updateFields, { new: true });

        log(`SUCCESSFULLY_UPDATED_INVENTORY_${invid}`);
        return res.status(200).json({ message: "Inventory updated successfully", data: updatedInventory });
    } catch (err) {
        log(`ERROR_UPDATING_INVENTORY_${invid || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

const AddQty = async (req, res) => {
    try {
        const { userid, instituteId, invid, qty } = req.body;
        log(`ADDING_INVENTORY_QTY_${invid}_${qty}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const data = await Inventory.findOne({ _id: invid, institute: instituteId });
        if (!data) {
            log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Inventory item not found for this institute" });
        }

        data.qty = Number(data.qty) + Number(qty);
        data.updatedAt = Date.now();
        await data.save();

        // Record inventory transaction
        const invTransaction = new InventoryTransaction({
            inv_id: invid,
            type: 'ADD',
            qty: Number(qty),
            amount: 0,
            description: `Added ${qty} units to inventory`,
            institute: instituteId,
            user: userid
        });
        await invTransaction.save();

        log(`SUCCESSFULLY_ADDED_QTY_${invid}`);
        return res.status(200).json({ message: "SUCCESSFULLY ADDED QTY" });
    } catch (err) {
        log(`ERROR_ADDING_INVENTORY_QTY_${invid || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

const AlotInventory = async (req, res) => {
    try {
        const { userid, instituteId, invid, name, amount, qty, description, payment_method } = req.body;
        log(`ALOTTING_INVENTORY_TO_${name}_${amount}_${qty}_${invid}_BY_${userid}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const dt = await Inventory.findOne({ _id: invid, institute: instituteId });
        if (!dt) {
            log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Inventory item not found for this institute" });
        }

        if (dt.qty < 1 || dt.qty < qty) {
            log(`INSUFFICIENT_QTY_${invid}_${dt.qty}_REQUESTED_${qty}`);
            return res.status(404).json({ message: "Insufficient quantity in inventory" });
        }

        const data = new Alot({
            name,
            amount,
            qty,
            description,
            inv_id: invid,
            payment_method,
            institute: instituteId
        });
        await data.save();

        dt.qty = Number(dt.qty) - Number(qty);
        await dt.save();

        // Record inventory transaction
        const invTransaction = new InventoryTransaction({
            inv_id: invid,
            type: 'ALLOT',
            qty: Number(qty),
            amount: Number(amount),
            description: description || `Allotted ${qty} units to ${name}`,
            payment_method: payment_method || 'CASH',
            institute: instituteId,
            user: userid
        });
        await invTransaction.save();

        log(`SUCCESSFULLY_ALLOTTED_INVENTORY_${data._id.toHexString()}`);
        return res.status(200).json({ message: "SUCCESSFULLY ALLOTTED INVENTORY" });
    } catch (err) {
        log(`ERROR_ALLOTING_INVENTORY_${invid || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

const FetchGivenInv = async (req, res) => {
    try {
        const { userid, instituteId, invid } = req.body;
        log(`FETCHING_GIVEN_INVENTORIES_${invid}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const inventory = await Inventory.findOne({ _id: invid, institute: instituteId });
        if (!inventory) {
            log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Inventory item not found for this institute" });
        }

        const data = await Alot.find({
            inv_id: new mongoose.Types.ObjectId(invid),
            institute: instituteId
        });

        log(`SUCCESSFULLY_FETCHED_GIVEN_INVENTORIES_${invid}`);
        return res.status(200).json(data);
    } catch (err) {
        log(`ERROR_FETCHING_INVENTORIES_GIVEN_${invid || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

const FetchInventoryTransactions = async (req, res) => {
    try {
        const { userid, instituteId, invid } = req.body;
        log(`FETCHING_INVENTORY_TRANSACTIONS_${invid || 'ALL'}`);

        const manager = await User.findOne({ role: "Manager", _id: new mongoose.Types.ObjectId(userid) });
        if (!manager) {
            log(`INVALID_MANAGER_${userid}`);
            return res.status(404).json({ message: "Manager not found" });
        }

        const institute = await Institute.findById(instituteId);
        if (!institute) {
            log(`INVALID_INSTITUTE_${instituteId}`);
            return res.status(404).json({ message: "Institute not found" });
        }

        const query = { institute: instituteId };
        if (invid) {
            query.inv_id = new mongoose.Types.ObjectId(invid);
            const inventory = await Inventory.findOne({ _id: invid, institute: instituteId });
            if (!inventory) {
                log(`INVALID_INVENTORY_${invid}_FOR_INSTITUTE_${instituteId}`);
                return res.status(404).json({ message: "Inventory item not found for this institute" });
            }
        }

        const data = await InventoryTransaction.find(query)
            .populate('inv_id', 'name')
            .sort({ createdAt: -1 });

        log(`SUCCESSFULLY_FETCHED_INVENTORY_TRANSACTIONS_${invid || 'ALL'}`);
        return res.status(200).json(data);
    } catch (err) {
        log(`ERROR_FETCHING_INVENTORY_TRANSACTIONS_${invid || 'UNKNOWN'}`);
        console.error(err);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

module.exports = {
    AlotInventory,
    fetchInventory,
    AddInventory,
    UpdateInventory,
    FetchGivenInv,
    AddQty,
    FetchInventoryTransactions
};