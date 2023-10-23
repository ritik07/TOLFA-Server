const pool = require("../../../database");
const moment = require("moment");
const TABLE_NAME = "tolfa_city_area";

exports.get = async (req, res) => {
  const statement = `SELECT 
  tca.id as id, 
  tca.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  tca.created_at as created_at,
  tca.updated_at as updated_at,
  ts.name as city_name,
  ts.id as city_id
  FROM tolfa_city_area as tca 
  INNER JOIN tolfa_user as tu on tu.id = tca.updated_by
  INNER JOIN tolfa_user as itu on itu.id = tca.created_by 
  INNER JOIN tolfa_city as ts on ts.id = tca.city_id`;

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
          message: "record found",
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
    let { name, created_by, city_id } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      city_id,
      created_by,
      updated_by,
      created_at, 
      updated_at
      ) values(
        '${name}',
        ${city_id},
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
          message: "Record added successfuly",
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
    let { name, id, updated_by, city_id } = body;

    const statement = `UPDATE ${TABLE_NAME} set 
    name = '${name}', 
    city_id = ${city_id}, 
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
          message: "Record updated successfuly",
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
          message: "Record deleted successfuly",
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
