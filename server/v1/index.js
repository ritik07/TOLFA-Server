const express = require("express");
const rescueType = require("../modules/rescue-type");
const role = require("../modules/role");
const user = require("../modules/user");

const router = express.Router();

router.use("/rescue-type", rescueType);
router.use("/role", role);
router.use("/user", user);

module.exports = router;
