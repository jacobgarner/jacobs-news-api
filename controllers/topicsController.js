const {
  getAllTopics,
  getAllApis,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentToArticle,
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

exports.getComments = (req, res, next) =>{
    const {article_id} = req.params
    const commentsPromises = [getCommentsByArticleId(article_id)]
    if(article_id) {
        commentsPromises.push(getArticleById(article_id))
    }

    Promise.all(commentsPromises).then((resolvedPromises)=>{
        const comments = resolvedPromises[0]
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const newComment = req.body
    const {article_id} = req.params
    postCommentToArticle(newComment, article_id).then((comment)=>{
        console.log(comment)
        res.status(200).send({commentAdded: comment})
    })
}