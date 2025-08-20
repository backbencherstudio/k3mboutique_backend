const express = require("express");
const { getOnematch, updatedMatch, getAllMatch, getParentAllMatches } = require("./match.controller");
const { verifyAdmin } = require("../../middleware/verifyAdmin");
const { verifyUser } = require("../../middleware/verifyUser");


const router = express.Router();



router.get("/one-match-details/:matchId", getOnematch);
router.put("/updateMatch/:id",verifyUser, updatedMatch)
router.get("/all-match", getAllMatch)

router.get("/parentallmatch/:parentId", getParentAllMatches)
module.exports = router;
