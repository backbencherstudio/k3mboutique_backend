const express = require("express");
const { verifyAdmin } = require("../../middleware/verifyAdmin");
const { createNewPlayer, updatePlayer, getPlayer, createMatch,  } = require("./admin.controller");
const { uploadProfileImage } = require("../../middleware/multer.config.single");
const upload = require("../../middleware/multer.config.single");


const route = require("express").Router();



route.post("/new-palyer-create",verifyAdmin,  createNewPlayer);
route.put("/palyer-data-upadte/:playerId",verifyAdmin,upload.uploadProfileImage,  updatePlayer);
route.get("/single-player/:playrId", getPlayer);




route.post("/create-match",verifyAdmin, createMatch )
module.exports = route;
