const Query= require('../models/Queries');
const { log } = require("../Logs/logs")
const User = require('../models/user');

const fetchQueries = async (req, res) => {
    try {
        log(`FETCHING_QUERIES`);
        const {userid} = req.body;
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(404).json("User Not Found");
        }
        const res1=await Query.find({delete:false});

        return res.status(200).json(res1);
    }
    catch (err){
        log(`ERROR_FETCHING_QUERIES`);
    console.log(err);
    return res.status(400).json("Server Error");}
}

const ResolveQuery = async(req, res) => {
    try {
        const {userid,queryid} = req.body;
        log(`MARK_QUERY_AS_RESOLVED_${queryid}_BY_${userid}`);
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(404).json("User Not Found");
        }

        const res1=await Query.findById(queryid);
        res1.active=false;
        res1.save();
        log(`QUERY_RESOLVED_${queryid}`);
        return res.status(200).json({message:"SUCCESSFULLY UPDATED"})
    }catch (err){
        log(`ERROR_RESOLVING_QUERY`);
        console.log(err);
        return res.status(400).json("Server Error");
    }
}

const DeleteQuery = async(req, res) => {
    try {
        const {userid,queryid} = req.body;
        
        log(`MARK_QUERY_AS_DELETED_${queryid}_BY_${userid}`);
        const result1 = await User.findById(userid);
        if (!result1) {
            return res.status(404).json("User Not Found");
        }

        const res1=await Query.findById(queryid);
        res1.delete=true;
        res1.save();

        log(`QUERY_DELETED_${queryid}`);
        return res.status(200).json({message:"SUCCESSFULLY UPDATED"})

    }catch (err){

        log(`ERROR_DELETING_QUERY`);
        console.log(err);
        return res.status(400).json("Server Error");
    }
}

module.exports={
    fetchQueries,
    DeleteQuery,
    ResolveQuery
}


