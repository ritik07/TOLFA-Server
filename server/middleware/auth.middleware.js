const { secret } = require("../constant/secret.constant");
const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  // var token = req.headers.Authorization;
  let token = req.headers.auth_token;
  jwt.verify(token, secret, function (err, decoded) {
    if (!err) {
      req.user_detail = decoded;
      next();
    } else {
      res.status(401).json({
        message: err.message,
        code: 401,
      });
    }
  });
};

exports.decodeToken = async (token) => {
  let decodedValue = null;
  jwt.verify(token, secret, function (err, decoded) {
    if (!err) {
      decodedValue = decoded;
    } else {
      throw err;
    }
  });
  return decodedValue;
};
