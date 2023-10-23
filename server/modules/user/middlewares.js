const pool = require("../../../database");

const TABLE_NAME = "tolfa_user";

exports.duplicateUser = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, phone_no, email } = body;

    const statement = `SELECT * FROM ${TABLE_NAME} WHERE name = '${name}' AND phone_no = '${phone_no}' AND email = '${email}'`;
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        if (results && results.length) {
          res.status(422).json({
            message: "User already exist with this name, phone number or email",
          });
        } else {
          next();
        }
      });
    };
    query(statement);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
