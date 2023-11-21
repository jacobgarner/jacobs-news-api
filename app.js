const express = require("express");
const {
  getTopics,
  getApis,
  getArticle,
} = require("./controllers/topicsController");
const { customError, handlePsqlErrors } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApis);
app.get("/api/articles/:article_id", getArticle);

app.use(handlePsqlErrors);
app.use(customError);

module.exports = app;
