const pool = require("../../../database");
const moment = require("moment");

const TABLE_NAME = "tolfa_role";

exports.getRoles = async (req, res) => {
  const { user_id } = req.query;
  // const statement = `SELECT *,
  // tolfa_role.name as name,
  // tolfa_user.name as created_by_name
  // FROM ${TABLE_NAME} INNER JOIN tolfa_user on tolfa_user.id = ${TABLE_NAME}.created_by where ${TABLE_NAME}.created_by = ${user_id}`;

  const statement = `SELECT 
  @row_number:=@row_number+1 AS serial_no,
  tr.id as id, 
  tr.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  tr.created_at as created_at,
  tr.updated_at as updated_at
  FROM tolfa_role as tr 
  INNER JOIN tolfa_user as tu on tu.id = tr.updated_by
  INNER JOIN tolfa_user as itu on itu.id = tr.created_by, (SELECT @row_number:=0) as rn
  WHERE tr.active = true
  ORDER BY tr.id`;

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
      '${created_by}', 
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
    let { id } = req.params;
    // let { id } = query.params;

    const statement = `UPDATE ${TABLE_NAME} set active = ${false} where id = ${id}`;

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
