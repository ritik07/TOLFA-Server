const pool = require("../../../database");
const moment = require("moment");
const TABLE_NAME = "tolfa_area";

exports.totalRescueByCity = async (req, res) => {
  const statement = `
      SELECT tcity.name AS city, COUNT(tas.id) AS total_rescues
      FROM tolfa_admission_status tas
      LEFT JOIN tolfa_city tcity ON tas.city_id = tcity.id
      GROUP BY tcity.id
    `;

  try {
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
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.totalRescuesByType = async (req, res) => {
  const statement = `
  SELECT ttype.name AS rescue_type, COUNT(tas.id) AS total_rescues
  FROM tolfa_admission_status tas
  LEFT JOIN tolfa_rescue_type ttype ON tas.type_of_rescue_id = ttype.id
  GROUP BY ttype.id
`;

  try {
    const result = await pool.query(statement);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.mostFrequestProblem = async (req, res) => {
  const statement = `
  SELECT rs.problem AS problem, COUNT(rs.id) AS total_occurrences
  FROM tolfa_rescue_animal_status rs
  GROUP BY rs.problem
  ORDER BY total_occurrences DESC
`;

  try {
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
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.totalRescuesByMonths = async (req, res) => {
  const { year } = req.query;

  const statement = `
    SELECT MONTH(tas.created_at) AS month, COUNT(tas.id) AS total_rescues
    FROM tolfa_admission_status tas
    WHERE YEAR(tas.created_at) = ${year || "YEAR(CURDATE())"}
    GROUP BY MONTH(tas.created_at)
  `;

  try {
    const result = await pool.query(statement);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.rescueByAgeGroup = async (req, res) => {
  const statement = `
  SELECT
    CASE
      WHEN tas.age < 1 THEN '0-1 years'
      WHEN tas.age BETWEEN 1 AND 5 THEN '1-5 years'
      WHEN tas.age BETWEEN 6 AND 10 THEN '6-10 years'
      ELSE '10+ years'
    END AS age_group,
    COUNT(tas.id) AS total_rescues
  FROM tolfa_admission_status tas
  GROUP BY age_group
`;

  try {
    const result = await pool.query(statement);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.rescueBySpecies = async (req, res) => {
  const statement = `
    SELECT tspec.name AS species, COUNT(tas.id) AS total_rescues
    FROM tolfa_admission_status tas
    LEFT JOIN tolfa_species tspec ON tas.species_id = tspec.id
    GROUP BY tspec.id
  `;

  try {
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
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.rescueByGender = async (req, res) => {
  const statement = `
  SELECT tas.sex AS gender, COUNT(tas.id) AS total_rescues
  FROM tolfa_admission_status tas
  GROUP BY tas.sex
`;

  try {
    const result = await pool.query(statement);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.mostFrequentProblemTypes = (req, res) => {
  const statement = `
    SELECT rs.problem_type, COUNT(tas.id) AS total_cases
    FROM tolfa_admission_status tas
    LEFT JOIN tolfa_rescue_animal_status rs ON tas.id = rs.rescue_id
    GROUP BY rs.problem_type
  `;

  pool.query(statement, (err, result, fields) => {
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
