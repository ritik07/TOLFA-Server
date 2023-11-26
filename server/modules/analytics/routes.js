const express = require("express");
const controller = require("./controller");
const middlewares = require("./middlewares");

const router = express.Router();

/* GET */
router.get("/total-rescues-by-city", controller.totalRescueByCity);

router.get("/total-rescues-by-type", controller.totalRescuesByType);

router.get("/total-rescues-by-month", controller.totalRescuesByMonths);

router.get("/most-frequent-problems", controller.mostFrequestProblem);

router.get("/rescues-by-age-group", controller.rescueByAgeGroup);

router.get("/rescues-by-gender", controller.rescueByGender);

router.get("/total-rescues-by-species", controller.rescueBySpecies);

module.exports = router;
