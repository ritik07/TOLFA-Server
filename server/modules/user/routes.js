const express = require("express");
const controller = require("./controller");
const middlewares = require("./middlewares");

const router = express.Router();

/* GET */
router.get("/", controller.getUsers);
/* GET bvy :ID */
router.get("/:id", controller.getUsers);
/* CREATE */
router.post(
  "/create",
  middlewares.duplicateUser,
  controller.createUser,
  controller.addRolesToUser
);
/* UPDATE */
router.put("/update", controller.updateUser);
/* DELETE */
router.delete("/delete", controller.deleteUser);

module.exports = router;
