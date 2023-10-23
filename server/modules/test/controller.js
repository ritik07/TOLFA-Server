const pool = require("../../../database");

const TABLE_NAME = "test";

exports.getTestData = async (req, res) => {
  let statement = `SELECT * FROM ${TABLE_NAME}`;

  pool.query(statement, (err, result) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          data: result,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};
