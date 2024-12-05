"use strict";

const express = require("express");
const router = express.Router();
const usersController = require("./user.controller");

router.post("/detail", usersController.detail);
router.post("/update/profile", usersController.updateProfile);
router.post("/update/password", usersController.updatePassword);

router.post("/roles/list", (req, res) => {
	if (req.role == "Administrator") {
		usersController.rolesList(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});

module.exports = router;
