exports.customError = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ err: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) =>{
  if(err.code === "22P02" || err.code === "23502"){
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};