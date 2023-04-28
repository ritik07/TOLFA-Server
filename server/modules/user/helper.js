const pool = require("../../../database");

exports.getRolesByUser = async (user_id, res, data) => {
  let statement = `SELECT * FROM tolfa_role as TR INNER JOIN tolfa_user_role AS TUR on TUR.role_id = TR.id where TUR.user_id = ${user_id}`;

  console.log("statement", statement);
  pool.query(statement, (err, result, fileds) => {
    try {
      if (err) {
        console.log("err", err);
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          message: "Tolfa staff data",
          status: 200,
          success: true,
          data: { ...data[0], user_role: result },
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
