const pool = require("../../../database");

const TABLE_NAME = "tolfa_role";

exports.duplicateRoleType = async (req, res, next) => {
  try {
    let { body } = req;
    let { name } = body;

    const statement = `SELECT * FROM ${TABLE_NAME} WHERE name = '${name}'`;
    console.log(statement);
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        console.log("results", results);
        if (results && results.length) {
          res.status(422).json({
            message: "Rescue type already exist with this name",
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
