const mongoose = require('mongoose');
   const { log } = require('../Logs/logs');

   const inventoryTransactionSchema = new mongoose.Schema({
       inv_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Inventory',
           required: true
       },
       type: {
           type: String,
           enum: ['ADD', 'ALLOT'],
           required: true
       },
       qty: {
           type: Number,
           required: true
       },
       amount: {
           type: Number,
           required: true,
           default: 0
       },
       description: {
           type: String,
           required: false
       },
       payment_method: {
           type: String,
           enum: ['CASH', 'UPI', 'CARD', null],
           required: false
       },
       institute: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Institute',
           required: true
       },
       user: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User',
           required: true
       },
       createdAt: {
           type: Date,
           default: Date.now
       }
   });

   // Logging hooks
   inventoryTransactionSchema.pre('save', function (next) {
       log(`Creating Inventory Transaction: Type: ${this.type}, Qty: ${this.qty}, Inventory ID: ${this.inv_id}, Institute: ${this.institute}`);
       next();
   });

   inventoryTransactionSchema.post('save', function (doc) {
       log(`Inventory Transaction created with ID: ${doc._id}, Type: ${doc.type}, Qty: ${doc.qty}, Inventory ID: ${doc.inv_id}, Institute: ${doc.institute}`);
   });

   const InventoryTransaction = mongoose.models.InventoryTransaction || mongoose.model('InventoryTransaction', inventoryTransactionSchema);

   module.exports = InventoryTransaction;