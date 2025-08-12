const express = require("express");
const { create, getAllSupportRequests } = require("./support.controller");
const { verifyUser } = require("../../middleware/verifyUser");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const router = express.Router();

router.post("/create", create);

router.get("/getAllSupportRequests",verifyAdmin, getAllSupportRequests);
module.exports = router;
