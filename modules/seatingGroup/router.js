"use strict";

const express = require("express");
const router = express.Router();
const seatingGroupController = require("./seatingGroup.controller");

router.post("/status/update", (req, res) => {
	seatingGroupController.update(req, res);
});
router.post("/detail", (req, res) => {
	seatingGroupController.detail(req, res);
});

module.exports = router;
