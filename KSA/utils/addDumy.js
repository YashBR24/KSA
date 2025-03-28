const mongoose = require('mongoose');
const XLSX = require('xlsx');
const fs = require('fs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gsa', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Academy = require('../models/Academy');

(async () => {
    try {
        // Load Excel file
        const workbook = XLSX.readFile("C:/Users/SHIVAM/Desktop/GSA_ID_DATA.xlsx");
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let rollNo = 20250146;
        const defaultPlanId = "6772e44430a1a49c3dca40b6";

        const records = data.map((row, index) => {
            return {
                roll_no: rollNo++,
                name: row.name || "NA",
                amount: row.amount || 0,
                session: row.session || "NA",
                plan_time: row.plan_time || "NA",
                father: row.father || "NA",
                occupation: row.occupation || "NA",
                address: row.address || "NA",
                phone: row.phone || "NA",
                dob: row.dob || null,
                name_of_school: row.name_of_school || "NA",
                current_class: row.current_class || "NA",
                photo: `${rollNo - 1}.jpg`,
                signature: row.signature || "NA",
                date_and_place: row.date_and_place || "NA",
                father_signature: row.father_signature || "NA",
                from: row.from || new Date(),
                to: "2025-01-10",
                payment_number: row.payment_number || 0,
                plan_id: defaultPlanId,
                active: row.active !== undefined ? row.active : true,
                user_id: row.user_id || null,
                id_card_generated: row.id_card_generated || false,
                id_card_given: row.id_card_given || false,
                createdOn: row.createdOn || new Date()
            };
        });

        // Insert records into the database
        const result = await Academy.insertMany(records);
        console.log(`${result.length} records inserted successfully!`);
    } catch (error) {
        console.error("Error uploading data:", error);
    } finally {
        mongoose.connection.close();
    }
})();
