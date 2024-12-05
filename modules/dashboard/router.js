"use strict";

const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboard.controller");

router.post("/list", (req, res) => {
	dashboardController.list(req, res);
});

module.exports = router;
