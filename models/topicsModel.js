const db = require("../db/connection");

exports.getAllTopics = () =>{
    return db.query("SELECT * FROM topics").then((topics)=>{
        return topics.rows
    })
}