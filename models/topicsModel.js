const db = require("../db/connection");
const fs = require("fs/promises");

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

exports.getUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      return user.rows;
    });
};

exports.getAllArticles = (topic="%") => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, 
      articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE  articles.topic LIKE '${topic}'
    GROUP BY articles.article_id
    ORDER BY created_at DESC`
    )
    .then((articles) => {
      return articles.rows;
    });
};

exports.getCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`,
      [article_id]
    )
    .then((comments) => {
      return comments.rows;
    });
};

exports.postCommentToArticle = (newComment, article_id) => {

  const { username, body } = newComment;
  if (!newComment || !newComment.username || !newComment.body) {
    return Promise.reject({
      status: 400,
      msg: 'request body must include username and body properties'
    });
  }

  return db.query(
    `INSERT INTO comments(article_id, body, author)
    VALUES ($1, $2, $3) RETURNING *`,
    [article_id, body, username]
  ).then((comment)=>{
    return comment
  })
};

exports.patchArticleById = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Missing vote count",
    });
  }

  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *`,
      [inc_votes, article_id]
    )
    .then((updatedArticle) => {
      return updatedArticle.rows;
    });
};

exports.getCommentById = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return comment.rows;
    });
};

exports.deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((deletedComment) => {
      return deletedComment;
    });
};

exports.getAllUsers = () =>{
  return db.query(`SELECT * FROM users`)
  .then(({rows})=>{
    return rows
  })
}