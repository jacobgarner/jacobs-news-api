const { getAllTopics } = require("../models/topicsModel")


exports.getTopics = (req, res, next) =>{
    getAllTopics().then((data)=>{
        res.status(200).send(data)
    })
    .catch(next)
}
