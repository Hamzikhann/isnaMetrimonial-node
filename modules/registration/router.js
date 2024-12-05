"use strict";

const express = require("express");
const router = express.Router();
const registrationController = require("./registration.controller");

router.post("/list", (req, res) => {
	registrationController.list(req, res);
});

router.post("/create", (req, res) => {
	registrationController.create(req, res);
});

router.post("/update", (req, res) => {
	registrationController.update(req, res);
});

module.exports = router;
