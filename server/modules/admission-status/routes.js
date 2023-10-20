const express = require("express");
const controller = require("./controller");
const rescueInfo = require("./helper/rescue-info");

const router = express.Router();

/* GET */
router.get("/", controller.get);
/* CREATE */
router.post("/create", controller.create );
/* UPDATE */
router.put("/update", controller.update);
/* DELETE */
router.put("/delete", controller.delete);

/* GET latest rescue number */
router.get("/get-lastest-rescue-number", rescueInfo.getRescueNumber);

module.exports = router;
