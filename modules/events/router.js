"use strict";

const express = require("express");
const router = express.Router();
const eventsController = require("./events.controller");

router.post("/detail", (req, res) => {
	eventsController.detail(req, res);
});

module.exports = router;
