const express = require("express");
const { verifyAdmin } = require("../../middleware/verifyAdmin");
const { createNewPlayer } = require("./admin.controller");
const { uploadProfileImage } = require("../../middleware/multer.config.single");


const route = require("express").Router();



route.post("/new-palyer-create",verifyAdmin,  createNewPlayer);
module.exports = route;
