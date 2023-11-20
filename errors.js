exports.customError = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(400).send({ err: err.msg });
  } else {
    next(err);
  }
};
