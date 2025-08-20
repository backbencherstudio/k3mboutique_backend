const express = require("express");


const { verifyUser } = require("../../middleware/verifyUser");
const { sitOnManger, markreadnotification, markallnotificationRead } = require("./notification.controller");

const router = express.Router();


router.get("/manger-notification", verifyUser, sitOnManger);


router.patch("/:id/read", verifyUser, markreadnotification);


router.patch("/read-all", verifyUser, markallnotificationRead);

module.exports = router;