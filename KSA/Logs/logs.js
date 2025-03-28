const Logs = require("../models/Logs")

const log = (description)=>{
    try{
        const data = new Logs({
                        description
        })
        console.log(`Log : ${description}`)
        data.save();
        return ""
    } catch(err){
        console.log(err)
        return ""
    }
}

module.exports = {log};        