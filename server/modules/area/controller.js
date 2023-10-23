const pool = require("../../../database");
const moment = require("moment");
const TABLE_NAME = "tolfa_area";

exports.get = async (req, res) => {
  const statement = `SELECT 
  @row_number:=@row_number+1 AS serial_no,
  ta.id as id, 
  ta.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  ta.created_at as created_at,
  ta.updated_at as updated_at
  FROM tolfa_area as ta 
  INNER JOIN tolfa_user as tu on tu.id = ta.updated_by
  INNER JOIN tolfa_user as itu on itu.id = ta.created_by, (SELECT @row_number:=0) as rn
  WHERE ta.active = true
  ORDER BY ta.id`;

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
        res.status(200).json({
          message: "Record found",
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

exports.create = async (req, res) => {
  try {
    let { body } = req;
    let { name, created_by } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      created_by,
      updated_by,
      created_at, 
      updated_at
      ) values(
        '${name}',
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
        return;
      } else if (result) {
        res.status(200).json({
          status: 200,
          message: "record added successfuly",
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

exports.update = async (req, res) => {
  try {
    let { body } = req;
    let { name, id, updated_by } = body;

    const statement = `UPDATE ${TABLE_NAME} set 
    name = '${name}', 
    updated_by = ${updated_by},
    updated_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}' where id = ${id}`;

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
          message: "record updated successfuly",
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

exports.delete = async (req, res) => {
  try {
    let { body } = req;
    let { id } = body;

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
          message: "record deleted successfuly",
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
