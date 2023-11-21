const express = require("express");
const {
  getTopics,
  getApis,
  getArticle,
  getArticles,
  getComments,
  postComment,
} = require("./controllers/topicsController");
const { customError, handlePsqlErrors } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApis);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getComments)
app.post("/api/articles/:article_id/comments", postComment)


app.use(handlePsqlErrors);
app.use(customError);

module.exports = app;
