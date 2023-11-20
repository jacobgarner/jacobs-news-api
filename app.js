const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const { handle404 } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics)

module.exports = app