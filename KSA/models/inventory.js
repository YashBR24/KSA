// const mongoose = require('mongoose');
// const { log } = require('../Logs/logs'); // Ensure correct path to log function
//
// const invschema = new mongoose.Schema({
//     name: { type: String, required: true },
//     amount: { type: Number, required: true },
//     qty: { type: Number, required: true, default: 0 },
//     description: { type: String, required: false },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//     active: { type: Boolean, default: true },
//     delete: { type: Boolean, default: false }
// });
//
// // Logging hooks
//
// // Log before saving
// invschema.pre('save', function (next) {
//     log(`Creating new Inventory item: Name: ${this.name}, Amount: ${this.amount}, Qty: ${this.qty}`);
//     next();
// });
//
// // Log after saving
// invschema.post('save', function (doc) {
//     log(`Inventory item created with ID: ${doc._id}, Name: ${doc.name}, Amount: ${doc.amount}, Qty: ${doc.qty}`);
// });
//
// // Log before updating: Capture old values
// invschema.pre('findOneAndUpdate', async function (next) {
//     const docToUpdate = await this.model.findOne(this.getQuery()); // Fetch existing document
//     if (docToUpdate) {
//         log(`Updating Inventory ID: ${docToUpdate._id}, Previous: Name: ${docToUpdate.name}, Amount: ${docToUpdate.amount}, Qty: ${docToUpdate.qty}`);
//         this.set('_oldData', docToUpdate); // Store old data for post-hook reference
//     }
//     this.set({ updatedAt: Date.now() }); // Update 'updatedAt' field
//     next();
// });
//
// // Log after updating: Show previous and new values
// invschema.post('findOneAndUpdate', function (doc) {
//     if (doc) {
//         log(`Inventory Updated for ID: ${doc._id}, Previous: ${JSON.stringify(doc._oldData)}, New: Name: ${doc.name}, Amount: ${doc.amount}, Qty: ${doc.qty}`);
//     }
// });
//
// // Log after deleting
// invschema.post('findOneAndDelete', function (doc) {
//     if (doc) {
//         log(`Inventory item deleted with ID: ${doc._id}, Name: ${doc.name}, Amount: ${doc.amount}, Qty: ${doc.qty}`);
//     }
// });
//
// const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', invschema);
//
// module.exports = Inventory;


const mongoose = require('mongoose');
const { log } = require('../Logs/logs'); // Ensure correct path to log function

const invschema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    qty: { type: Number, required: true, default: 0 },
    description: { type: String, required: false },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    delete: { type: Boolean, default: false }
});

// Logging hooks

// Log before saving
invschema.pre('save', function (next) {
    log(`Creating new Inventory item: Name: ${this.name}, Amount: ${this.amount}, Qty: ${this.qty}, Institute: ${this.institute}`);
    next();
});

// Log after saving
invschema.post('save', function (doc) {
    log(`Inventory item created with ID: ${doc._id}, Name: ${doc.name}, Amount: ${doc.amount}, Qty: ${doc.qty}, Institute: ${doc.institute}`);
});

// Log before updating: Capture old values
invschema.pre('findOneAndUpdate', async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery()); // Fetch existing document
    if (docToUpdate) {
        log(`Updating Inventory ID: ${docToUpdate._id}, Previous: Name: ${docToUpdate.name}, Amount: ${docToUpdate.amount}, Qty: ${docToUpdate.qty}, Institute: ${docToUpdate.institute}`);
        this.set('_oldData', docToUpdate); // Store old data for post-hook reference
    }
    this.set({ updatedAt: Date.now() }); // Update 'updatedAt' field
    next();
});

// Log after updating: Show previous and new values
invschema.post('findOneAndUpdate', function (doc) {
    if (doc) {
        log(`Inventory Updated for ID: ${doc._id}, Previous: ${JSON.stringify(doc._oldData)}, New: Name: ${doc.name}, Amount: ${doc.amount}, Qty: ${doc.qty}, Institute: ${doc.institute}`);
    }
});

// Log after deleting
invschema.post('findOneAndDelete', function (doc) {
    if (doc) {
        log(`Inventory item deleted with ID: ${doc._id}, Name: ${doc.name}, Amount: ${doc.amount}, Qty: ${doc.qty}, Institute: ${doc.institute}`);
    }
});

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', invschema);

module.exports = Inventory;