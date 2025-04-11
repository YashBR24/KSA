const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const multer = require('multer');
const router = express.Router();

const {
    getActivePlans,
    getAllBookings,
    getAllPlans,
    getUpcomingBookings,
    takeAttendance,
    getAttendance,
    updateTrainees,
    newTrainee,
    getStaffAttendance,
    getTransactionsByInstitute,
    getAllInstitutes
} = require('../controllers/ManagerGroundController');
const DetailsAcademy = require('../models/DetailsAcademy');
const Academy = require('../models/Academy');
const Transaction = require('../models/Transaction');
const Sport = require('../models/Sport');
const Institute = require('../models/Institute');
const User = require('../models/user');
const Batch = require('../models/Batch');
const { log } = require("../Logs/logs");

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer configuration with unique filenames
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error("Only images (jpeg, jpg, png) are allowed"));
        }
    },
});

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

// Helper function to generate PDF
const generateTraineePDF = (traineeData, photoPath, traineeSignaturePath, fatherSignaturePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 30,
            bufferPages: true,
            autoFirstPage: true
        });
        const pdfPath = path.join(__dirname, `../Uploads/trainee_${traineeData.phone}.pdf`);
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        const pageHeight = 841.89 - 60;
        const colors = {
            primary: '#1565C0',
            secondary: '#2196F3',
            text: '#212121',
            textSecondary: '#5D6D7E'
        };

        doc.rect(0, 0, doc.page.width, 60).fill(colors.primary);
        doc.fontSize(16)
            .fillColor('#FFFFFF')
            .font('Helvetica-Bold')
            .text('Trainee Registration Form', 40, 15)
            .fontSize(8)
            .text(`Generated on: ${moment().format('DD/MM/YYYY HH:mm')}`, 40, 35);

        doc.fontSize(9)
            .fillColor('#FFFFFF')
            .text(`Institute: ${traineeData.institute_name || 'N/A'}`, doc.page.width - 180, 15, { width: 150, align: 'right' })
            .text(`Roll No: ${traineeData.roll_no}`, doc.page.width - 180, 30, { width: 150, align: 'right' });

        let y = 70;

        const createSectionHeader = (title, yPos) => {
            doc.rect(30, yPos, doc.page.width - 60, 20).fill(colors.secondary);
            doc.fontSize(11)
                .fillColor('#FFFFFF')
                .font('Helvetica-Bold')
                .text(title, 40, yPos + 5);
            return yPos + 20;
        };

        y = createSectionHeader('Personal Information', y);
        doc.rect(30, y, doc.page.width - 60, 110).fill('#FFFFFF').stroke('#E0E0E0');
        y += 8;

        const leftColumn = 40;
        const rightColumn = doc.page.width / 2;
        const lineHeight = 18;

        const addField = (label, value, x, currentY) => {
            doc.fontSize(8)
                .font('Helvetica-Bold')
                .fillColor(colors.text)
                .text(label + ':', x, currentY);
            doc.font('Helvetica')
                .fillColor(colors.textSecondary)
                .text(value || 'N/A', x + 70, currentY, { width: 140 });
        };

        addField('Name', traineeData.name || 'N/A', leftColumn, y);
        addField("Father's Name", traineeData.father || 'N/A', leftColumn, y + lineHeight);
        addField('Date of Birth', moment(traineeData.dob).format('DD/MM/YYYY'), leftColumn, y + lineHeight * 2);
        addField('Phone', traineeData.phone || 'N/A', leftColumn, y + lineHeight * 3);
        addField('Occupation', traineeData.occupation || 'N/A', leftColumn, y + lineHeight * 4);

        addField('Sport', traineeData.sport_name || 'N/A', rightColumn, y);
        addField('Plan', traineeData.session || 'N/A', rightColumn, y + lineHeight);
        addField('Batch', traineeData.batch_name || 'N/A', rightColumn, y + lineHeight * 2); // Added batch_name
        addField('Start Date', moment(traineeData.from).format('DD/MM/YYYY'), rightColumn, y + lineHeight * 3);
        addField('End Date', moment(traineeData.to).format('DD/MM/YYYY'), rightColumn, y + lineHeight * 4);

        y += 100;

        y = createSectionHeader('Contact Details', y);
        doc.rect(30, y, doc.page.width - 60, 40).fill('#FFFFFF').stroke('#E0E0E0');
        y += 8;

        doc.fontSize(8)
            .font('Helvetica-Bold')
            .fillColor(colors.text)
            .text('Address:', 40, y);
        doc.font('Helvetica')
            .fillColor(colors.textSecondary)
            .text(traineeData.address || 'N/A', 40, y + 12, { width: doc.page.width - 80 });

        y += 45;

        y = createSectionHeader('Photos & Signatures', y);
        const photoSectionHeight = 80;
        doc.rect(30, y, doc.page.width - 60, photoSectionHeight).fill('#FFFFFF').stroke('#E0E0E0');

        y += 5;

        const imageWidth = 90;
        const imageHeight = 50;
        const availableSpace = doc.page.width - 60 - 40;
        const spacing = (availableSpace - (imageWidth * 3)) / 2;

        const photoX = 40;
        const traineeSignatureX = photoX + imageWidth + spacing;
        const fatherSignatureX = traineeSignatureX + imageWidth + spacing;

        const displayImage = (imagePath, x, label) => {
            if (imagePath && fs.existsSync(path.join(__dirname, '../', imagePath))) {
                doc.image(path.join(__dirname, '../', imagePath), x, y, {
                    fit: [imageWidth, imageHeight],
                    align: 'center'
                });
                doc.rect(x, y, imageWidth, imageHeight).lineWidth(0.25).stroke('#CCCCCC');
                doc.fontSize(7)
                    .fillColor(colors.text)
                    .font('Helvetica-Bold')
                    .text(label, x, y + imageHeight + 3, { width: imageWidth, align: 'center' });
            } else {
                doc.rect(x, y, imageWidth, imageHeight)
                    .lineWidth(0.25)
                    .stroke('#CCCCCC')
                    .fillColor('#F5F5F5')
                    .fill();
                doc.fontSize(7)
                    .fillColor(colors.textSecondary)
                    .text('No Image', x, y + (imageHeight/2) - 3, { width: imageWidth, align: 'center' });
                doc.fontSize(7)
                    .fillColor(colors.text)
                    .font('Helvetica-Bold')
                    .text(label, x, y + imageHeight + 3, { width: imageWidth, align: 'center' });
            }
        };

        displayImage(photoPath, photoX, 'Trainee Photo');
        displayImage(traineeSignaturePath, traineeSignatureX, 'Trainee Signature');
        displayImage(fatherSignaturePath, fatherSignatureX, "Father's Signature");

        const footerY = pageHeight;
        doc.rect(0, footerY, doc.page.width, 30).fill(colors.primary);
        doc.fontSize(8)
            .fillColor('#FFFFFF')
            .text('Powered by xAI Academy Management System', 0, footerY + 10, {
                align: 'center',
                width: doc.page.width
            });

        doc.end();
        stream.on('finish', () => resolve(pdfPath));
        stream.on('error', reject);
    });
};

// Routes from controllers
router.post('/all-plans', (req, res, next) => {
    log(`ROUTING_ALL_PLANS`);
    getAllPlans(req, res, next);
});
router.post('/all-bookings', (req, res, next) => {
    log(`ROUTING_ALL_BOOKINGS`);
    getAllBookings(req, res, next);
});
router.post('/take-attendance', (req, res, next) => {
    log(`ROUTING_TAKE_ATTENDANCE`);
    takeAttendance(req, res, next);
});
router.post('/trainee-attendance', (req, res, next) => {
    log(`ROUTING_TRAINEE_ATTENDANCE`);
    getAttendance(req, res, next);
});
router.post('/staff-attendance', (req, res, next) => {
    log(`ROUTING_STAFF_ATTENDANCE`);
    getStaffAttendance(req, res, next);
});
router.post('/update-trainee-student', (req, res, next) => {
    log(`ROUTING_UPDATE_TRAINEES`);
    updateTrainees(req, res, next);
});
router.post('/transactions-by-institute', (req, res, next) => {
    log(`ROUTING_TRANSACTIONS_BY_INSTITUTE`);
    getTransactionsByInstitute(req, res, next);
});
router.get("/institutes", (req, res, next) => {
    log(`ROUTING_GET_ALL_INSTITUTES`);
    getAllInstitutes(req, res, next);
});

router.post("/add-new-trainee", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "traineeSignature", maxCount: 1 },
    { name: "fatherSignature", maxCount: 1 },
]), async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            log(`NO_AUTH_HEADER`);
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const userId = authHeader.split(' ')[1];
        if (!userId) {
            log(`NO_USER_ID_IN_AUTH`);
            return res.status(401).json({ message: "User ID not provided in authorization" });
        }

        const {
            name, payment_method, father, dob, address, phone,
            plan_id, sport_id, institute_id, batch_id, amount, occupation, // Added batch_id
            current_class, name_of_school, dateAndPlace, start_date, expiry_date
        } = req.body;
        log(`ADD_NEW_TRAINEE_${name}_${phone}`);

        const user = await User.findById(userId);
        if (!user) {
            log(`USER_NOT_FOUND_${userId}`);
            return res.status(404).json({ message: "User Not Found" });
        }

        const rollno = await Academy.countDocuments();
        const roll_no = rollno + 20250001;

        const planDetails = await DetailsAcademy.findById(plan_id);
        if (!planDetails) {
            log(`PLAN_NOT_FOUND_${plan_id}`);
            return res.status(404).send("Plan not found");
        }

        const sportDetails = await Sport.findById(sport_id);
        if (!sportDetails) {
            log(`SPORT_NOT_FOUND_${sport_id}`);
            return res.status(404).send("Sport not found");
        }

        const instituteDetails = await Institute.findById(institute_id);
        if (!instituteDetails) {
            log(`INSTITUTE_NOT_FOUND_${institute_id}`);
            return res.status(404).send("Institute not found");
        }

        const batchDetails = await Batch.findById(batch_id);
        if (!batchDetails) {
            log(`BATCH_NOT_FOUND_${batch_id}`);
            return res.status(404).send("Batch not found");
        }

        const session = planDetails.name;
        const today = moment();
        const firstDate = start_date ? moment(start_date) : today.add(1, "days");
        const secondDate = expiry_date ? moment(expiry_date) : moment(today).add(planDetails.plan_limit, "days");

        let photoFilename = null;
        let traineeSignatureFilename = null;
        let fatherSignatureFilename = null;

        if (req.files?.photo?.[0]) {
            const originalPath = req.files.photo[0].path;
            photoFilename = `${roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, photoFilename));
        }
        if (req.files?.traineeSignature?.[0]) {
            const originalPath = req.files.traineeSignature[0].path;
            traineeSignatureFilename = `${roll_no}_traineeSignature${path.extname(req.files.traineeSignature[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, traineeSignatureFilename));
        }
        if (req.files?.fatherSignature?.[0]) {
            const originalPath = req.files.fatherSignature[0].path;
            fatherSignatureFilename = `${roll_no}_fatherSignature${path.extname(req.files.fatherSignature[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, fatherSignatureFilename));
        }

        const newTrainee = new Academy({
            roll_no,
            name,
            father,
            dob,
            address,
            session,
            from: firstDate,
            to: secondDate,
            phone,
            plan_id,
            sport_id,
            institute_id,
            batch_id, // Added batch_id
            amount,
            occupation,
            current_class,
            name_of_school,
            date_and_place: dateAndPlace,
            photo: photoFilename,
            signature: traineeSignatureFilename || "",
            father_signature: fatherSignatureFilename || "",
            delete: false
        });
        await newTrainee.save();

        if (amount && Number(amount) > 0) {
            const currentBalance = await calculateBalanceFromTransactions(institute_id);
            const newBalance = currentBalance + Number(amount);

            const newTrans = new Transaction({
                amt_in_out: "IN",
                amount: Number(amount),
                description: "ACADEMY_NEW_" + roll_no,
                balance_before_transaction: currentBalance,
                balance_after_transaction: newBalance,
                method: payment_method,
                identification: "ACADEMY_NEW_" + roll_no,
                institute: institute_id,
                institute_name: instituteDetails.name,
                user: userId
            });
            await newTrans.save();
            log(`TRANSACTION_RECORDED_${roll_no}_${amount}`);
        }

        const traineeData = {
            roll_no,
            name,
            father,
            dob,
            address,
            phone,
            sport_name: sportDetails.name,
            session,
            from: firstDate,
            to: secondDate,
            amount,
            occupation,
            current_class,
            name_of_school,
            date_and_place: dateAndPlace,
            institute_name: instituteDetails.name,
            batch_name: batchDetails.name, // Added batch_name for PDF
        };

        const pdfPath = await generateTraineePDF(
            traineeData,
            photoFilename ? path.join(uploadDir, photoFilename) : null,
            traineeSignatureFilename ? path.join(uploadDir, traineeSignatureFilename) : null,
            fatherSignatureFilename ? path.join(uploadDir, fatherSignatureFilename) : null
        );

        res.download(pdfPath, `trainee_${roll_no}_details.pdf`, (err) => {
            if (err) {
                log(`ERROR_SENDING_PDF_${roll_no}`);
                console.error('Error sending PDF:', err);
            }
            fs.unlink(pdfPath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting PDF:', unlinkErr);
            });
        });

        log(`SUCCESSFULLY_ADDED_TRAINEE_${roll_no}`);
    } catch (error) {
        log(`ERROR_ADDING_TRAINEE_${name || 'UNKNOWN'}`);
        console.error('Error in /add-new-trainee:', error);
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Update trainee
router.put("/update-trainee/:id", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "traineeSignature", maxCount: 1 },
    { name: "fatherSignature", maxCount: 1 },
]), async (req, res) => {
    try {
        const traineeId = req.params.id;
        log(`UPDATING_TRAINEE_${traineeId}`);
        const {
            name, father, dob, address, phone, occupation,
            current_class, name_of_school, start_date, expiry_date, dateAndPlace,
            sport_id, institute_id, plan_id, batch_id // Added batch_id
        } = req.body;

        const existingTrainee = await Academy.findById(traineeId);
        if (!existingTrainee) {
            log(`TRAINEE_NOT_FOUND_${traineeId}`);
            return res.status(404).send("Trainee not found");
        }

        if (sport_id) {
            const sportDetails = await Sport.findById(sport_id);
            if (!sportDetails) {
                log(`SPORT_NOT_FOUND_${sport_id}`);
                return res.status(404).send("Sport not found");
            }
        }

        if (institute_id) {
            const instituteDetails = await Institute.findById(institute_id);
            if (!instituteDetails) {
                log(`INSTITUTE_NOT_FOUND_${institute_id}`);
                return res.status(404).send("Institute not found");
            }
        }

        if (batch_id) {
            const batchDetails = await Batch.findById(batch_id);
            if (!batchDetails) {
                log(`BATCH_NOT_FOUND_${batch_id}`);
                return res.status(404).send("Batch not found");
            }
        }

        let session = existingTrainee.session;
        if (plan_id) {
            const planDetails = await DetailsAcademy.findById(plan_id);
            if (!planDetails) {
                log(`PLAN_NOT_FOUND_${plan_id}`);
                return res.status(404).send("Plan not found");
            }
            session = planDetails.name;
        }

        let photoFilename = existingTrainee.photo;
        let traineeSignatureFilename = existingTrainee.signature;
        let fatherSignatureFilename = existingTrainee.father_signature;

        if (req.files?.photo?.[0]) {
            const originalPath = req.files.photo[0].path;
            photoFilename = `${existingTrainee.roll_no}_photo${path.extname(req.files.photo[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, photoFilename));
        }
        if (req.files?.traineeSignature?.[0]) {
            const originalPath = req.files.traineeSignature[0].path;
            traineeSignatureFilename = `${existingTrainee.roll_no}_traineeSignature${path.extname(req.files.traineeSignature[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, traineeSignatureFilename));
        }
        if (req.files?.fatherSignature?.[0]) {
            const originalPath = req.files.fatherSignature[0].path;
            fatherSignatureFilename = `${existingTrainee.roll_no}_fatherSignature${path.extname(req.files.fatherSignature[0].originalname)}`;
            fs.renameSync(originalPath, path.join(uploadDir, fatherSignatureFilename));
        }

        existingTrainee.name = name || existingTrainee.name;
        existingTrainee.father = father || existingTrainee.father;
        existingTrainee.dob = dob || existingTrainee.dob;
        existingTrainee.address = address || existingTrainee.address;
        existingTrainee.phone = phone || existingTrainee.phone;
        existingTrainee.occupation = occupation || existingTrainee.occupation;
        existingTrainee.current_class = current_class || existingTrainee.current_class;
        existingTrainee.name_of_school = name_of_school || existingTrainee.name_of_school;
        existingTrainee.date_and_place = dateAndPlace || existingTrainee.date_and_place;
        existingTrainee.from = start_date || existingTrainee.from;
        existingTrainee.to = expiry_date || existingTrainee.to;
        existingTrainee.photo = photoFilename || "";
        existingTrainee.signature = traineeSignatureFilename || "";
        existingTrainee.father_signature = fatherSignatureFilename || "";
        existingTrainee.sport_id = sport_id || existingTrainee.sport_id;
        existingTrainee.institute_id = institute_id || existingTrainee.institute_id;
        existingTrainee.plan_id = plan_id || existingTrainee.plan_id;
        existingTrainee.batch_id = batch_id || existingTrainee.batch_id; // Added batch_id
        existingTrainee.session = session;

        await existingTrainee.save();
        log(`SUCCESSFULLY_UPDATED_TRAINEE_${traineeId}`);
        res.send("Trainee updated successfully");
    } catch (error) {
        log(`ERROR_UPDATING_TRAINEE_${traineeId || 'UNKNOWN'}`);
        console.error('Error in /update-trainee:', error);
        res.status(500).send(`Server error: ${error.message}`);
    }
});


// Delete trainee
router.post("/delete-trainee", async (req, res) => {
    try {
        const { userid, id } = req.body;
        log(`DELETING_TRAINEE_${id}`);

        const result1 = await User.findById(userid);
        if (!result1) {
            log(`UNAUTHENTICATED_USER_${userid}`);
            return res.status(400).json("Unauthenticated User");
        }

        const trainee = await Academy.findById(id);
        if (!trainee) {
            log(`TRAINEE_NOT_FOUND_${id}`);
            return res.status(404).json("Trainee Not Found");
        }

        trainee.active = false;
        trainee.delete = true;
        await trainee.save();

        log(`SUCCESSFULLY_DELETED_TRAINEE_${id}`);
        return res.status(200).json("Trainee Deleted");
    } catch (error) {
        log(`ERROR_DELETING_TRAINEE_${id || 'UNKNOWN'}`);
        console.error('Error in /delete-trainee:', error);
        res.status(500).json({ message: "SERVER ERROR" });
    }
});

module.exports = router;