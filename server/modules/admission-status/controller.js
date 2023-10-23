const pool = require("../../../database");
const moment = require("moment");
const TABLE_NAME = "tolfa_animal_status";

exports.get = async (req, res) => {
  const statement = `SELECT 
  @row_number:=@row_number+1 AS serial_no,
  tas.id as id, 
  tas.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  tas.created_at as created_at,
  tas.updated_at as updated_at
  FROM tolfa_animal_status as tas 
  INNER JOIN tolfa_user as tu on tu.id = tas.updated_by
  INNER JOIN tolfa_user as itu on itu.id = tas.created_by, (SELECT @row_number:=0) as rn
  WHERE tas.active = true
  ORDER BY tas.id`;
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
          message: "animal status data",
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
  pool.getConnection(async function (err, connection) {
    if (err) throw err; // not connected!

    try {
      /**
       * @startTransaction
       */
      connection.beginTransaction();

      const { body } = req;

      const {
        type_of_rescue_id,
        species_id,
        status_id,
        state_id,
        city_id,
        area_id,
        rescue_address,
        rescue_by_tolfa,
        animal_name,
        sex,
        age,
        main_color_id,
        second_color_id,
        thirdcolor_id,
        id_features,
        breed_id,
        animal_image,
        created_at,
        active,
        created_by,
      } = body;

      /**
       * @step1
       * @logic - 1st step shold give rescue_id in return
       * @MainTable
       */

      const rescue_id = await insertAdmissionDetail(connection, {
        type_of_rescue_id,
        species_id,
        status_id,
        state_id,
        city_id,
        area_id,
        rescue_address,
        rescue_by_tolfa,
        animal_name,
        sex,
        age,
        main_color_id,
        second_color_id,
        thirdcolor_id,
        id_features,
        breed_id,
        animal_image,
        created_at,
        active,
        created_by,
      });

      /**
       * @mapping_tolfa_x_care_people
       */

      /**
       * @if_rescue_by_tolfa
       * @else_care_people
       */

      if (rescue_by_tolfa) {
        const nameIds = body.tolfa_team;

        const values = nameIds
          .map((nameId) => `(${rescue_id}, ${nameId})`)
          .join(", ");

        await mapTolfaTeam(connection, { values });
      } else {
        const care_people_id = body.care_people_id;
        await mapCarePeople(connection, { rescue_id, care_people_id });
      }

      /**
       * @tolfa_location_table
       */
      const { tolfa_area_id, tolfa_block_id } = body.tolfa_location;
      await tolfaLocationTable(connection, {
        tolfa_area_id,
        tolfa_block_id,
        rescue_id,
        created_by,
      });

      const {
        abc_status,
        tattoo_number,
        condition_value,
        body_score,
        caregiver_name,
        caregiver_number,
        problem,
        problem_type,
        symptoms,
        injury_location,
        alt_problem,
        alt_problem_type,
        alt_symptoms,
        alt_injury_location,
        cause_of_problem,
        rassi_no,
      } = body.rescue_animal_status;

      await tolfaRescueAnimalStatus(connection, {
        rescue_id,
        abc_status,
        tattoo_number,
        condition_value,
        body_score,
        caregiver_name,
        caregiver_number,
        problem,
        problem_type,
        symptoms,
        injury_location,
        alt_problem,
        alt_problem_type,
        alt_symptoms,
        alt_injury_location,
        cause_of_problem,
        rassi_no,
        created_by,
      });

      /**
       * @last call below
       */

      connection.commit();

      res.status(201).json({
        message: "Admission status created successfully",
        success: true,
      });
    } catch (error) {
      console.error(error);
      connection.rollback();
      res.status(500).json({
        message: "Oops! Something went wrong",
        success: false,
      });
    }
  });
};

/**
 * @trans_0
 */

const insertAdmissionDetail = async (connection, data) => {
  try {
    const {
      type_of_rescue_id,
      species_id,
      status_id,
      state_id,
      city_id,
      area_id,
      rescue_address,
      rescue_by_tolfa,
      animal_name,
      sex,
      age,
      main_color_id,
      second_color_id,
      thirdcolor_id,
      id_features,
      breed_id,
      animal_image,
      active,
      created_by,
    } = data;

    const tolfaAdmissionStatusStatement = `INSERT INTO tolfa_admission_status (
    type_of_rescue_id,
    species_id,
    status_id,
    state_id,
    city_id,
    area_id,
    rescue_address,
    rescue_by_tolfa,
    animal_name,
    sex,
    age,
    main_color_id,
    second_color_id,
    thirdcolor_id,
    id_features,
    breed_id,
    animal_image,
    created_at,
    active,
    created_by
) VALUES (
    ${type_of_rescue_id},
    ${species_id},
    ${status_id},
    ${state_id},
    ${city_id},
    ${area_id},
    '${rescue_address}',
    ${rescue_by_tolfa},
    '${animal_name}',
    ${sex},
    ${age},
    ${main_color_id},
    ${second_color_id},
    ${thirdcolor_id},
    '${id_features}',
    ${breed_id},
    '${animal_image}',
    '${moment().format("YYYY-MM-DD HH:mm:ss")}',
    ${active},
    ${created_by}
)`;
    return new Promise((resolve, reject) => {
      connection.query(tolfaAdmissionStatusStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data.insertId);
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * @trans_1_of_2
 */
const mapTolfaTeam = async (connection, data) => {
  try {
    const { values } = data;
    const mapTolfaTeamStatement = `INSERT INTO rescued_by_tolfa_x_team (rescue_id, name_id)
    VALUES ${values}`;
    return new Promise((resolve, reject) => {
      connection.query(mapTolfaTeamStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * @trans_2_of_2
 */
const mapCarePeople = async (connection, data) => {
  try {
    const { rescue_id, care_people_id } = data;
    const mapCarePeopleStatement = `INSERT INTO tolfa_rescue_x_care_people (rescue_id, care_people_id)
    VALUES (
      ${rescue_id},
      ${care_people_id}
      )`;

    return new Promise((resolve, reject) => {
      connection.query(mapCarePeopleStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * @trans_3
 */
const tolfaLocationTable = async (connection, data) => {
  try {
    const { tolfa_area_id, tolfa_block_id, rescue_id, created_by } = data;
    const tolfaLocationDetailStatement = `INSERT INTO tolfa_rescue_location (rescue_id, tolfa_area_id, tolfa_block_id, created_at, updated_at, created_by, updated_by, is_latest)
    VALUES (
      ${rescue_id}, 
      ${tolfa_area_id}, 
      ${tolfa_block_id},  
      '${moment().format("YYYY-MM-DD HH:mm:ss")}',  
      '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
      ${created_by}, 
      ${created_by}, 
      1
      );`;

    return new Promise((resolve, reject) => {
      connection.query(tolfaLocationDetailStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data.insertId);
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * @trans_4
 */
const tolfaRescueAnimalStatus = async (connection, data) => {
  try {
    const {
      rescue_id,
      abc_status,
      tattoo_number,
      condition_value,
      body_score,
      caregiver_name,
      caregiver_number,
      problem,
      problem_type,
      symptoms,
      injury_location,
      alt_problem,
      alt_problem_type,
      alt_symptoms,
      alt_injury_location,
      cause_of_problem,
      rassi_no,
      created_by,
    } = data;

    const tolfaAnimalStatusStatement = `INSERT INTO tolfa_rescue_animal_status (
      rescue_id,
      abc_status,
      tattoo_number,
      condition_value,
      body_score,
      caregiver_name,
      caregiver_number,
      problem,
      problem_type,
      symptoms,
      injury_location,
      alt_problem,
      alt_problem_type,
      alt_symptoms,
      alt_injury_location,
      cause_of_problem,
      rassi_no,
      created_at,
      updated_at,
      created_by,
      updated_by,
      is_latest
    ) VALUES (
      ${rescue_id},
      '${abc_status}',
      '${tattoo_number}',
      '${condition_value}',
      '${body_score}',
      '${caregiver_name}',
      ${caregiver_number},
      '${problem}',
      '${JSON.stringify(problem_type)}',
      ${symptoms ? `'${JSON.stringify(symptoms)}'` : NULL},
      ${injury_location ? `'${JSON.stringify(injury_location)}'` : NULL},
      '${alt_problem}',
      '${JSON.stringify(alt_problem_type)}',
      ${alt_symptoms ? `'${JSON.stringify(alt_symptoms)}'` : NULL},
      ${
        alt_injury_location ? `'${JSON.stringify(alt_injury_location)}'` : NULL
      },
      '${cause_of_problem}',
      '${rassi_no}',
      '${moment().format("YYYY-MM-DD HH:mm:ss")}',  
      '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
      ${created_by},
      ${created_by},
      1
    );`;

    return new Promise((resolve, reject) => {
      connection.query(tolfaAnimalStatusStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data.insertId);
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
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
          message: "Status updated successfuly",
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
          message: "Rescue type deleted successfuly",
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

// {
//   "type_of_rescue_id": 1,
//   "species_id": 2,
//   "status_id": 3,
//   "state_id": 4,
//   "city_id": 5,
//   "area_id": 6,
//   "rescue_address": "123 Main Street",
//   "rescue_by_tolfa": 1,
//   "animal_name": "Fido",
//   "sex": 1,
//   "age": 2,
//   "main_color_id": 7,
//   "second_color_id": 8,
//   "thirdcolor_id": 9,
//   "id_features": "Black nose, floppy ears",
//   "breed_id": 10,
//   "animal_image": "https://example.com/image.jpg",
//   "created_at": "2023-10-14 15:30:00",
//   "active": 1,
//   "created_by": 11,
//   "tolfa_team": [
//       1,
//       12,
//       4
//   ]
// }
