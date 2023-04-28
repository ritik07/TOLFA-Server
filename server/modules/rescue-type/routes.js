const express = require("express");
const controller = require("./controller");
const middlewares = require("./middlewares");

const router = express.Router();

/* GET */
router.get("/get", controller.getRescueType);
/* CREATE */
router.post(
  "/create",
  middlewares.duplicateRescueType,
  controller.createRescueType
);
/* UPDATE */
router.put("/update", controller.updateRescueType);
/* DELETE */
router.delete("/delete", controller.deleteRescueType);

module.exports = router;
