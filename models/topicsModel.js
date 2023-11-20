const db = require("../db/connection");
const fs = require("fs/promises");

exports.getAllTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.getAllApis = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((apis) => {
    return JSON.parse(apis)
  });
};

exports.getArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Article does not exist" });
      }
      return article.rows;
    });
};
