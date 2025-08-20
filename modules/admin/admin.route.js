const express = require("express");
const { verifyAdmin } = require("../../middleware/verifyAdmin");
const {
  createNewPlayer,
  updatePlayer,
  getPlayer,
  createMatch,
  updateMatchPlayers,
  getAllPlayer,
  addPlayersToTeam,
} = require("./admin.controller");
const { uploadProfileImage } = require("../../middleware/multer.config.single");
const upload = require("../../middleware/multer.config.single");
const { verifyUser } = require("../../middleware/verifyUser");

const route = require("express").Router();

route.post("/new-palyer-create", verifyAdmin, createNewPlayer);
route.put(
  "/palyer-data-upadte/:playerId",
  verifyAdmin,
  upload.uploadProfileImage,
  updatePlayer
);
route.get("/single-player/:playrId", getPlayer);
route.get("/all-Player", getAllPlayer);

route.post("/create-match", verifyAdmin, createMatch);
route.put("/:matchId/update-players", verifyUser, addPlayersToTeam);
module.exports = route;
