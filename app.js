const express = require("express");
const {
  getTopics,
  getApis,
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  deleteComment
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
app.patch("/api/articles/:article_id", patchArticle)
app.delete("/api/comments/:comment_id", deleteComment)


app.use(handlePsqlErrors);
app.use(customError);

module.exports = app;
