const db = require("../db/connection");
const fs = require("fs/promises");
const articles = require("../db/data/test-data/articles");
const comments = require("../db/data/test-data/comments");

exports.getAllTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.getAllApis = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((apis) => {
    return JSON.parse(apis);
  });
};

exports.getArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return article.rows;
    });
};

exports.getAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, 
      articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC`
    )
    .then((articles) => {
      return articles.rows;
    });
};
