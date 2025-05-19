const express = require('express');
const {     AlotInventory,
    fetchInventory,
    AddInventory,
    UpdateInventory,
    FetchGivenInv,
    AddQty,
    FetchInventoryTransactions  } = require("../controllers/InventoryController");
const router = express.Router();

router.post('/get-all-inventory',fetchInventory);
router.post('/add-inventory',AddInventory);
router.post('/update-inventory',UpdateInventory);
router.post('/add-item',AddQty);
router.post('/alot-item',AlotInventory);
router.post('/fetch-given',FetchGivenInv);
router.post('/fetch-inventory-transactions', FetchInventoryTransactions);

module.exports = router;
