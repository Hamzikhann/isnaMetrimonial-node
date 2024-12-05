"use strict";

const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const jwt = require("../../utils/jwt");

router.post("/create", (req, res) => {
	bookingController.create(req, res);
});

router.post("/create/admin", (req, res) => {
	bookingController.createAdmin(req, res);
});

router.post("/detail", (req, res) => {
	bookingController.detail(req, res);
});

router.post("/update", jwt.protect, (req, res) => {
	bookingController.update(req, res);
});

router.post("/list", jwt.protect, (req, res) => {
	bookingController.list(req, res);
});

router.post("/refund", jwt.protect, (req, res) => {
	bookingController.refund(req, res);
});

module.exports = router;
