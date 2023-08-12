const express = require("express");
const controller = require("./controller");
const middlewares = require("./middlewares");

const router = express.Router();

/* GET */
router.get("/get", controller.getRoles);
/* CREATE */
router.post("/create", middlewares.duplicateRoleType, controller.createRole);
/* UPDATE */
router.put("/update", controller.updateRoleType);
/* DELETE */
router.put("/delete/:id", controller.deleteRoleType);

module.exports = router;
