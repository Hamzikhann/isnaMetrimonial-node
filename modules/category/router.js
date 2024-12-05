"use strict";

const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");

router.post("/detail", (req, res) => {
	categoryController.detail(req, res);
});

module.exports = router;
