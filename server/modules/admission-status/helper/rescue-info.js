const pool = require("../../../../database");
const moment = require("moment");

const TABLE_NAME = "tolfa_rescue_info";

exports.getRescueNumber = async (req, res) => {
  try {
    const statement = `SELECT MAX(rescue_number) as count FROM ${TABLE_NAME};`;
    console.log("statement->>>>", statement);
    let result = new Promise((resolve, reject) => {
      pool.query(statement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data);
          resolve(data);
        }
      });
    });
    let response = await result;
    res.status(200).json({
      message: "Data fetched",
      status: 200,
      success: true,
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Oops! Something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.create = async (req, res) => {
  pool.getConnection(async function (err, connection) {
    if (err) throw err; // not connected!

    try {
      // start ->>>>>
      connection.beginTransaction();

      const { body } = req;

      const {
        rescue_type_id,
        species_id,
        rescue_number,
        status_id,
        created_by,
      } = body.rescue_info;

      /**
       * @step1
       * @logic - 1st step shold give rescue_info_id in return
       */
      const rescue_info_id = await insertRescueInfo(connection, {
        rescue_type_id,
        species_id,
        rescue_number,
        status_id,
        created_by,
      });

      /**
       * @step2
       * @logic - 2nd step shold give rescue_location_id
       * @params - state_id	city_id	city_area_id	tolfa_area_id	tolfa_block_id	rescued_by_tolfa	rescuer_id	rescuer_tolfa_id
       */
      const {
        state_id,
        city_id,
        city_area_id,
        tolfa_area_id,
        tolfa_block_id,
        rescued_by_tolfa,
        rescuer_id,
        rescuer_tolfa_id,
      } = body.rescue_location;

      const { name, mob_no, alt_mob_no, address } = body.care_people;

      const rescue_location_id = await insertLocation(connection, {
        state_id,
        city_id,
        city_area_id,
        tolfa_area_id,
        tolfa_block_id,
        rescued_by_tolfa,
        rescuer_id,
        rescuer_tolfa_id,
        created_by,
        /**
         * @logic unique identifier
         */
        rescue_info_id,
        /**
         * Extra info for care people
         * @params name, mob_no, alt_mob_no, address
         */
        name,
        mob_no,
        alt_mob_no,
        address,
      });

      try {
        // main
        await insertAdmissionStatus(connection, {
          rescue_info_id: rescue_info_id,
          /////////////////////
          rescue_location_id: 1,
          rescue_animal_info_id: 2,
          rescue_animal_status_id: "3",
          created_by,
        });
      } catch (error) {
        console.log("hereeee", "error");
        throw error;
      }
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
    // finally {
    //   connection.release();
    // }

    // Use the connection
    // connection.query(
    //   "SELECT something FROM sometable",
    //   function (error, results, fields) {
    //     // When done with the connection, release it.
    //     connection.release();

    //     // Handle error after the release.
    //     if (error) throw error;

    //     // Don't use the connection here, it has been returned to the pool.
    //   }
    // );
  });
};

/**
 *
 * @Functions
 *
 */

/**
 * @FnStep1
 */
async function insertRescueInfo(connection, data) {
  try {
    const { rescue_type_id, species_id, rescue_number, status_id } = data;
    const rescueInfoStatement = `INSERT INTO tolfa_rescue_info (
    rescue_type_id,
    species_id,
    rescue_number,
    status_id,
    is_archive
  ) VALUES (${rescue_type_id}, ${species_id}, ${rescue_number}, ${status_id}, ${0})`;

    return new Promise((resolve, reject) => {
      connection.query(rescueInfoStatement, (err, data) => {
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
}

/**
 * @FnStep2
 * @logic it has @rescued_by_tolfa which can be either @true or @false based on that
 *
 * IF @rescued_by_tolfa IS = @true
 * then => we will just map it with another table that is @rescued_by_tolfa_x_team
 * with a unique identifier rescue_info_id
 * @function ->
 *
 * @Table rescued_by_tolfa_x_team
 * | id | name_id |   rescue_info_id   |
 * | 1  |    2    |         1          |
 * | 2  |    1    |         1          |
 *
 * and then main query of tolfa_rescue_location
 *
 * ================= @@@ =================
 *
 * @note if @tolfa_care_people id is there then no extra flow else
 * add a @funtion to add data in @tolfa_care_people
 *
 * IF @rescued_by_tolfa IS = @false
 * then => We will just map it with different table that is @tolfa_care_people
 * take user mobile no. from query params and serach it in @tolfa_care_people
 * if user exist fill the details and map the id to @tolfa_rescue_location
 * else hit create query add user to the table @tolfa_care_people
 * and return the id to save it
 *
 * @Table tolfa_care_people
 *
 * and then main query of tolfa_rescue_location
 *
 */
async function insertLocation(connection, data) {
  try {
    const {
      state_id,
      city_id,
      city_area_id,
      tolfa_area_id,
      tolfa_block_id,
      rescued_by_tolfa,
      rescuer_id,
      rescuer_tolfa_id, // care_people_id
      /**
       * @logic unique identifier
       */
      rescue_info_id,
      /**
       * @extra for care people
       */
      name,
      mob_no,
      alt_mob_no,
      address,
      created_by,
    } = data;

    let care_people_id = rescuer_id;

    /**
     * @logic if new care people then create the user first then return the id of care people
     */
    if (!rescued_by_tolfa && !care_people_id) {
      try {
        care_people_id = await insertCarePeople(connection, {
          name,
          mob_no,
          alt_mob_no,
          address,
          created_by,
        });
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    }

    let tolfa_rescue_team_id = false;

    if (rescued_by_tolfa) {
      tolfa_rescue_team_id = await mapRescuedByTolfaXTeam(connection, {});
    }

    const rescueInfoStatement = `INSERT INTO tolfa_rescue_location (
      state_id,
      city_id,
      city_area_id,
      tolfa_area_id,
      tolfa_block_id,
      rescued_by_tolfa,
      rescuer_id,
      rescuer_tolfa_id
  ) VALUES (${state_id}, ${city_id}, ${city_area_id}, 
    ${tolfa_area_id}, ${tolfa_area_id}, ${tolfa_block_id}, 
    ${rescued_by_tolfa},
    ${care_people_id}, ${rescuer_tolfa_id}
    )`;

    return new Promise((resolve, reject) => {
      connection.query(rescueInfoStatement, (err, data) => {
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
}

/**
 * @step2
 * @part2
 * @carePeople
 */
async function insertCarePeople(connection, data) {
  try {
    const { name, mob_no, alt_mob_no, address, created_by } = data;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name,
      mob_no,
      alt_mob_no,
      address,
      created_by,
      updated_by,
      created_at,
      updated_at
      ) values(
        '${name}',
        ${mob_no},
        ${alt_mob_no},
        '${address}',
        ${created_by},
        ${created_by},
        '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
        '${moment().format("YYYY-MM-DD HH:mm:ss")}'
        )`;

    return new Promise((resolve, reject) => {
      connection.query(statement, (err, data) => {
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
}

// main function
async function insertAdmissionStatus(connection, data) {
  try {
    const {
      rescue_info_id,
      rescue_location_id,
      rescue_animal_info_id,
      rescue_animal_status_id,
      created_by,
    } = data;
    const admissionStatusStatement = `
    INSERT INTO tolfa_admission_status (
      rescue_info_id,
      rescue_location_id,
      rescue_animal_info_id,
      rescue_animal_status_id,
      
      created_at,
      updated_at,
      
      active,
      created_by,
      updated_by
    ) VALUES (
      1, 
      3, 
      4, 
      5,

      '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
      '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
      
      1, 
      1, 
      1)`;
    await connection.query(
      admissionStatusStatement,
      (error, result, fileds) => {
        try {
          if (error) {
            throw error;
          }
        } catch (error) {
          console.log("error", error);
          throw error;
        }
      }
    );
  } catch (error) {
    console.log("error", error);
    if (error) throw error;
  }
}
