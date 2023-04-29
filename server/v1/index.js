const express = require("express");
const rescueType = require("../modules/rescue-type");
const role = require("../modules/role");
const user = require("../modules/user");
const test = require("../modules/test");

const router = express.Router();

router.use("/test", test);

router.use("/rescue-type", rescueType);
router.use("/role", role);
router.use("/user", user);

module.exports = router;
