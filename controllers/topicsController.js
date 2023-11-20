const { getAllTopics, getAllApis } = require("../models/topicsModel")


exports.getTopics = (req, res, next) =>{
    getAllTopics().then((data)=>{
        res.status(200).send({topics:data})
    })
    .catch(next)
}

exports.getApis = (req, res, next) =>{
    getAllApis().then((data)=>{
        res.status(200).send({apis:data})
    })
}