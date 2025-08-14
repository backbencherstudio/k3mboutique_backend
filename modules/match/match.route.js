const express = require("express");
const { getOnematch, updatedMatch } = require("./match.controller");


const router = express.Router();



router.get("/one-match-details/:matchId", getOnematch);
router.put("/updateMatch/:id", updatedMatch)
module.exports = router;
