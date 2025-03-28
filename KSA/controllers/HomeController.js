const User = require("../models/user");
const Turf = require("../models/Turf");
const Academy = require("../models/Academy");
const Attendance = require("../models/Attendance");
const Event = require("../models/Events");
const Ground  = require("../models/Ground");
const Queries = require("../models/Queries");
const Staff = require("../models/Staff");
const Transaction = require("../models/Transaction");
const { log } = require("../Logs/logs")
const getDetails = async (req, res) => {
    try {
        const {userid} = req.body;
        log(`FETCHING_HOME_DETAILS_${userid}`)
        //console.log(req.body)
        const manager = await User.findById(userid);
        // if (!manager || manager.role!=="Manager") {
        //     console.log("N1ot Found")
        //     return res.status(404).json({ message: "Manager not found" });
        // }


        // TOTAL_IN CURRENT MONTH AND LAST MONTH WITH PERCENTAGE

        const currentDate = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const currentMonthTotal = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "IN",
                    createdAt: { $gte: firstDayOfCurrentMonth, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const lastMonthTotal = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "IN",
                    createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        const currentMonthIN = currentMonthTotal.length > 0 ? currentMonthTotal[0].totalAmount : 0;
        const lastMonthIN = lastMonthTotal.length > 0 ? lastMonthTotal[0].totalAmount : 0;

        let InPercentageChange = 0;
        let InTrend = "neutral";
        if (lastMonthIN > 0) {
            InPercentageChange = ((currentMonthIN - lastMonthIN) / lastMonthIN) * 100;
            InTrend = InPercentageChange > 0 ? "up" : InPercentageChange < 0 ? "down" : "neutral";
        } else if (currentMonthIN > 0) {
            InPercentageChange = 100;
            InTrend = "up";
        }

        // TOTAL ATTENDANCE YESTERDAY AND TODAY

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const dayBeforeYesterday = new Date(yesterday);
        dayBeforeYesterday.setDate(yesterday.getDate() - 1);

        // Fetch today's attendance
        const todayAttendance = await Attendance.find({
            createdOn: { $gte: today, $lt: tomorrow },
        });

        // Fetch yesterday's attendance
        const yesterdayAttendance = await Attendance.find({
            createdOn: { $gte: yesterday, $lt: today },
        });

        // Count present students
        const todayPresentCount = new Set(todayAttendance.map((record) => record.rollno)).size;
        const yesterdayPresentCount = new Set(yesterdayAttendance.map((record) => record.rollno)).size;

        // Calculate percentage change
        let attendancePercentageChange = 0;
        let attendanceTrend = "neutral";

        if (yesterdayPresentCount > 0) {
            attendancePercentageChange = ((todayPresentCount - yesterdayPresentCount) / yesterdayPresentCount) * 100;
            attendanceTrend = attendancePercentageChange > 0 ? "up" : attendancePercentageChange < 0 ? "down" : "neutral";
        } else if (todayPresentCount > 0) {
            attendancePercentageChange = 100;
            attendanceTrend = "up";
        }

        // TOTAL CURRENT ACTIVE STUDENTS
        const currentActiveStudents = await Academy.countDocuments({active:true,delete: false})

        // TOTAL ACTIVE EVENTS
        const activeEvents = await Event.countDocuments({status:true,event_date: {$gte:today}});

        // UPCOMING EVENTS
        const upcomingEvents = await Event.find({status:true,event_date: {$gte:today}});

        // LAST 6 MONTHS IN & OUT

        const currentMonthTotalOut = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "OUT",
                    createdAt: { $gte: firstDayOfCurrentMonth, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const lastMonthTotalOut = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "OUT",
                    createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const firstDayOf2LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
        const lastDayOf2LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 0);

        const twoMonthTotalIn = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "IN",
                    createdAt: { $gte: firstDayOf2LastMonth, $lte: lastDayOf2LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const twoMonthTotalOut = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "OUT",
                    createdAt: { $gte: firstDayOf2LastMonth, $lte: lastDayOf2LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const firstDayOf3LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
        const lastDayOf3LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()-2, 0);

        const threeMonthTotalIn = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "IN",
                    createdAt: { $gte: firstDayOf3LastMonth, $lte: lastDayOf3LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const threeMonthTotalOut = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "OUT",
                    createdAt: { $gte: firstDayOf3LastMonth, $lte: lastDayOf3LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const firstDayOf4LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 4, 1);
        const lastDayOf4LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()-3, 0);

        const fourMonthTotalIn = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "IN",
                    createdAt: { $gte: firstDayOf4LastMonth, $lte: lastDayOf4LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const fourMonthTotalOut = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "OUT",
                    createdAt: { $gte: firstDayOf4LastMonth, $lte: lastDayOf4LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const firstDayOf5LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
        const lastDayOf5LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()-4, 0);

        const fiveMonthTotalIn = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "IN",
                    createdAt: { $gte: firstDayOf5LastMonth, $lte: lastDayOf5LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const fiveMonthTotalOut = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "OUT",
                    createdAt: { $gte: firstDayOf5LastMonth, $lte: lastDayOf5LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const firstDayOf6LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
        const lastDayOf6LastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()-5, 0);

        const sixMonthTotalIn = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "IN",
                    createdAt: { $gte: firstDayOf6LastMonth, $lte: lastDayOf6LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const sixMonthTotalOut = await Transaction.aggregate([
            {
                $match: {
                    amt_in_out: "OUT",
                    createdAt: { $gte: firstDayOf6LastMonth, $lte: lastDayOf6LastMonth }
                }
            },
            {
                $group: {
                    _id:null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const dt = new Date();
        dt.setHours(0,0,0,0)

        const edt = new Date();
        edt.setHours(23,59,59,999)
        // TODAY'S BOX CRICKET BOOKINGS
        const todaysTurfBookings = await Turf.find({status:true,played:false,start_date : {$gte:dt,$lte:edt}})

        // TODAY'S GROUND BOOKINGS
        const todaysGroundBookings = await Ground.find({status:true,ended:false,start_date : {$gte:dt,$lte:edt}})

        // TODAY'S ADMISSIONS
        const todaysAcademyAdmissions = await Academy.find({active:true,delete:false,createdAt : {$gte:dt,$lte:edt}})

        // TODAY'S QUERIES
        const todaysQueries = await Queries.find({active:true,delete:false,createdAt : {$gte:dt,$lte:edt}})

        // EXPIRING ADMISSIONS
        edt.setDate(tomorrow.getDate() + 3);
        edt.setHours(23,59,59,999)
        const ExpiringAdmissions = await Academy.find({active:true,delete:false,to : {$gte:dt,$lte:edt}})

        // TOTAL CURRENT STAFF
        const totalStaff = await Staff.countDocuments({active:true,delete:false,role:"Staff"})
        const totalCoaches = await Staff.countDocuments({active:true,delete:false,role:"Coach"})


        //RESULT
        return res.status(200).json({
            currentMonthIN,
            lastMonthIN,
            percentageChange: InPercentageChange.toFixed(2) ,// Formatting to 2 decimal places,
            InTrend,
            todayPresentCount,
            yesterdayPresentCount,
            attendancePercentageChange,
            attendanceTrend,
            currentActiveStudents,
            activeEvents,
            upcomingEvents,
            currentMonthTotalOut:currentMonthTotalOut.length > 0 ? currentMonthTotalOut[0].totalAmount : 0,
            lastMonthTotalOut:lastMonthTotalOut.length > 0 ? lastMonthTotalOut[0].totalAmount : 0,
            twoMonthTotalIn:twoMonthTotalIn.length > 0 ? twoMonthTotalIn[0].totalAmount : 0,
            twoMonthTotalOut:twoMonthTotalOut.length > 0 ? twoMonthTotalOut[0].totalAmount : 0,
            threeMonthTotalIn:threeMonthTotalIn.length > 0 ? threeMonthTotalIn[0].totalAmount : 0,
            threeMonthTotalOut:threeMonthTotalOut.length > 0 ? threeMonthTotalOut[0].totalAmount : 0,
            fourMonthTotalIn:fourMonthTotalIn.length > 0 ? fourMonthTotalIn[0].totalAmount : 0,
            fourMonthTotalOut:fourMonthTotalOut.length > 0 ? fourMonthTotalOut[0].totalAmount : 0,
            fiveMonthTotalIn:fiveMonthTotalIn.length > 0 ? fiveMonthTotalIn[0].totalAmount : 0,
            fiveMonthTotalOut:fiveMonthTotalOut.length > 0 ? fiveMonthTotalOut[0].totalAmount : 0,
            sixMonthTotalIn:sixMonthTotalIn.length > 0 ? sixMonthTotalIn[0].totalAmount : 0,
            sixMonthTotalOut:sixMonthTotalOut.length > 0 ? sixMonthTotalOut[0].totalAmount : 0,
            todaysTurfBookings,
            todaysGroundBookings,
            todaysAcademyAdmissions,
            ExpiringAdmissions,
            todaysQueries,
            totalStaff,
            totalCoaches
        });
    } catch (err){

        log(`ERROR_FETCHING_HOME_DETAILS`)
        //console.log(err)
        return res.status(500).json({message:"SERVER ERROR"})
    }
}

module.exports = {getDetails};