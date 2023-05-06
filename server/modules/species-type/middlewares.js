const pool = require("../../../database");

exports.duplicateRescueType = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, rescue_type_id } = body;

    const statement = `SELECT * FROM tolfa_species WHERE name = '${name}' and rescue_type_id = ${rescue_type_id}`;
    console.log(statement);
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        console.log("results", results);
        if (results && results.length) {
          res.status(422).json({
            message: "Data already exist with this name",
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
