const express = require("express");
const {
  getTopics,
  getApis,
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  deleteComment,
  getUsers
} = require("./controllers/controller");
const { customError, handlePsqlErrors } = require("./errors");
const cors = require('cors');

const app = express();
app.use(cors())

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApis);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getComments)
app.post("/api/articles/:article_id/comments", postComment)
app.patch("/api/articles/:article_id", patchArticle)
app.delete("/api/comments/:comment_id", deleteComment)
app.get("/api/users", getUsers)


app.use(handlePsqlErrors);
app.use(customError);

module.exports = app;
