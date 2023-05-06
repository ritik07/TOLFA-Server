const { secret } = require("../constant/secret.constant");
const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  var token = req.query.token;
  console.log("token", token);
  jwt.verify(token, secret, function (err, decoded) {
    if (!err) {
      next();
    } else {
      res.status(401).json({
        message: err.message,
        code: 401,
      });
    }
  });
};
