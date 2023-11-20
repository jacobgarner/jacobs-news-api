const express = require("express");
const { getTopics, getApis } = require("./controllers/topicsController");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics)
app.get("/api", getApis)

module.exports = app