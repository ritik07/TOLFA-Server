const pool = require("../../../database");
const helper = require("./helper");
const moment = require("moment");

const TABLE_NAME = "tolfa_user";
const TABLE_TOLFA_USER_ROLE = "tolfa_user_role";

exports.getUsers = async (req, res) => {
  const { params } = req;
  const { id } = params;
  let statement = `SELECT * FROM ${TABLE_NAME}`;
  if (id) {
    statement = `SELECT * FROM ${TABLE_NAME} where id = ${id}`;
  }
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
        const getUserRoles = async () => {
          await helper.getRolesByUser(result[0].id, res, result);
        };
        getUserRoles();
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

exports.createUser = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, email, phone_no, created_by, updated_by } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      email, 
      phone_no,
      active,
      created_by,
      updated_by,
      created_at, 
      updated_at
      )
    values(
      '${name}', 
      '${email}', 
      '${phone_no}',
       ${true},
       ${created_by},
       ${created_by},
       '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
       '${moment().format("YYYY-MM-DD HH:mm:ss")}'
       )`;

    pool.query(statement, (err, result, fileds) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
      } else if (result) {
        req.body.user_id = result.insertId;
        next();
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

exports.addRolesToUser = async (req, res) => {
  try {
    let { body } = req;
    let { role_id, user_id } = body;
    // [[user_id, role_id]]
    let userIdVsRoleId = [
      [1, 1],
      [2, 2],
    ];

    const statement = `INSERT INTO ${TABLE_TOLFA_USER_ROLE} (
      user_id, 
      role_id
      ) 
      VALUES ?`;

    let values = userIdVsRoleId;

    pool.query(statement, [values], (err, result, fileds) => {
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
            status: 200,
            message: "User created and mapped with roles successfuly",
            success: true,
            data: result[0],
          });
          return;
        }
      } catch (error) {
        console.log("error", error);
        res.status(500).json({
          message: "Ops something went wrong",
          status: 500,
          success: false,
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

// need to work on this
exports.updateUser = async (req, res) => {
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

// need to work on this
exports.deleteUser = async (req, res) => {
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
