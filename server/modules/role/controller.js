const pool = require("../../../database");
const moment = require("moment");

const TABLE_NAME = "tolfa_role";

exports.getRoles = async (req, res) => {
  const statement = `SELECT * FROM ${TABLE_NAME}`;
  console.log("statement", statement);
  pool.query(statement, (err, result, fileds) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        console.log("result of role type data", result);
        res.status(200).json({
          message: "role type data",
          status: 200,
          success: true,
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

exports.createRole = async (req, res) => {
  try {
    let { body } = req;
    let { name, created_by, updated_by, created_at, updated_at } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      created_by, 
      updated_by, 
      created_at, 
      updated_at)
    values(
      '${name}', 
      '${created_by}', 
      '${""}', 
      '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
      '${moment().format("YYYY-MM-DD HH:mm:ss")}')`;

    pool.query(statement, (err, result, fileds) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          status: 200,
          message: "Role added successfuly",
          success: true,
          data: result[0],
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.updateRoleType = async (req, res) => {
  try {
    let { body } = req;
    let { name, updated_by, id } = body;

    const statement = `UPDATE ${TABLE_NAME} set name = '${name}', updated_by = '${updated_by}', updated_at = '${moment().format(
      "YYYY-MM-DD HH:mm:ss"
    )}' where id = ${id}`;

    pool.query(statement, (err, result, fileds) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          status: 200,
          message: "Role type updated successfuly",
          success: true,
          data: result[0],
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.deleteRoleType = async (req, res) => {
  try {
    let { body } = req;
    let { id } = body;

    const statement = `DELETE from ${TABLE_NAME} where id = ${id}`;

    pool.query(statement, (err, result, fileds) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          status: 200,
          message: "Role deleted successfuly",
          success: true,
          data: result[0],
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};
