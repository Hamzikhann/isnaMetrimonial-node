"use strict";

const express = require("express");
const router = express.Router();
const jwt = require("../../utils/jwt");

const authcontroller = require("./authentication.controller");

router.post("/login", authcontroller.login);
router.post("/stripe/create-payment-intent", authcontroller.stripeCreatePaymentIntent);

module.exports = router;
