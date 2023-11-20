const db = require("../db/connection");
const fs = require("fs/promises")


exports.getAllTopics = () =>{
    return db.query("SELECT * FROM topics").then((topics)=>{
        return topics.rows
    })
}

exports.getAllApis = () =>{
    return fs.readFile("./endpoints.json", "utf-8").then((apis)=>{
        return JSON.parse(apis)
    })
    
}