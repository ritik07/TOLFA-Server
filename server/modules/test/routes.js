const express = require("express"); //
const controller = require("./controller");

const router = express.Router();

/* GET */
router.get("/", controller.getTestData);

// router -> 1. path
//    -> 2. function
module.exports = router;
