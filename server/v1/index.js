const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const rescueType = require("../modules/rescue-type");
const speciesType = require("../modules/species-type");
const animalStatus = require("../modules/animal-status");
const breed = require("../modules/breed");
const role = require("../modules/role");
const user = require("../modules/user");
const test = require("../modules/test");
const auth = require("../modules/auth");

const router = express.Router();

router.use("/auth", auth);
router.use("/test", authMiddleware.verifyToken, test);

router.use("/rescue-type", authMiddleware.verifyToken, rescueType);
router.use("/species-type", authMiddleware.verifyToken, speciesType);

router.use("/animal-status", authMiddleware.verifyToken, animalStatus);
router.use("/breed", authMiddleware.verifyToken, breed);

router.use("/role", authMiddleware.verifyToken, role);
router.use("/user", user);

module.exports = router;
