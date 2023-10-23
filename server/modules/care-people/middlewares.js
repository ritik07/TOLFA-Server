const pool = require("../../../database");

const TABLE_NAME = "tolfa_care_people";

exports.duplicate = async (req, res, next) => {
  try {
    let { body } = req;
    let { mob_no } = body;

    const statement = `SELECT * FROM ${TABLE_NAME} WHERE mob_no = '${mob_no}'`;
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        console.log("results", results);
        if (results && results.length) {
          res.status(422).json({
            message: "Data already exist with this mob_no",
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
