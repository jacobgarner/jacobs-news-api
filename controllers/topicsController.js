const {
  getAllTopics,
  getAllApis,
  getArticleById,
  getAllArticles,
} = require("../models/topicsModel");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((data) => {
      res.status(200).send({ topics: data });
    })
};

exports.getApis = (req, res, next) => {
  getAllApis().then((data) => {
    res.status(200).send({ apis: data });
  });
};

exports.getArticle = (req, res, next) => {
  const id = req.params.article_id;
  getArticleById(id).then((article) => {
    res.status(200).send({ article });
  })
  .catch(next)
}

exports.getArticles= (req, res, next) => {
    getAllArticles()
      .then((data) => {
        res.status(200).send({ articles: data });
      })
  };