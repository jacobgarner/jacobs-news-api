const {
  getAllTopics,
  getAllApis,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentToArticle,
  getUserByUsername,
  patchArticleById,
  getCommentById,
  deleteCommentById,
  getAllUsers,
  getTopic
} = require("../models/topicsModel");

exports.getTopics = (req, res, next) => {
  getAllTopics().then((data) => {
    res.status(200).send({ topics: data });
  });
};

exports.getApis = (req, res, next) => {
  getAllApis().then((data) => {
    res.status(200).send({ apis: data });
  });
};

exports.getArticle = (req, res, next) => {
  const id = req.params.article_id;
  getArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const topic = req.query.topic
  if(topic){
    Promise.all([getTopic(topic), getAllArticles(topic)])
    .then(([topics, articles])=>{
      res.status(200).send(articles)
    })
    .catch(next)}

    getAllArticles().then((articles)=>{
      res.status(200).send(articles)
    })
    .catch(next)

};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const commentsPromises = [getCommentsByArticleId(article_id)];
  if (article_id) {
    commentsPromises.push(getArticleById(article_id));
  }

  Promise.all(commentsPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  
  const commentPromises = [
      getArticleById(article_id),
      getUserByUsername(newComment.username),
      postCommentToArticle(newComment, article_id),
  ]
  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      res.status(201).send({ addedComment: resolvedPromises[2].rows[0] });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) =>{
  const {article_id} = req.params
  const {inc_votes} = req.body
  Promise.all([getArticleById(article_id), patchArticleById(article_id, inc_votes)])
  .then((resolvedPromises)=>{
    res.status(200).send(resolvedPromises[1][0])
  })
  .catch(next)
}
exports.deleteComment = (req, res, next) =>{
  const {comment_id} = req.params
  Promise.all([getCommentById(comment_id),deleteCommentById(comment_id)])
  .then((resolvedPromises)=>{
    res.status(204).send()
  })
  .catch(next)
}

exports.getUsers = (req, res, next) =>{

  getAllUsers().then((users)=>{
    res.status(200).send({users})
  })
}
