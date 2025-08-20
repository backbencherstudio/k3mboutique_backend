const express = require("express");
const {
  startVoting,
  submitVote,
  endVoting,
  getVotingResults,
} = require("./vote.controller");
const { verifyUser } = require("../../middleware/verifyUser");
const router = express.Router();

router.put("/:matchId/start-voting", verifyUser, startVoting);

router.post("/vote", submitVote);

router.put("/:matchId/end-voting", endVoting);

router.get("/:matchId/results", getVotingResults);

module.exports = router;
