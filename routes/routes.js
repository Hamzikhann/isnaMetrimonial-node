"use strict";
const jwt = require("../utils/jwt");

const authenticationRouteHandler = require("../modules/authentication/router");
const usersRouteHandler = require("../modules/users/router");
const registrationRouteHandler = require("../modules/registration/router");
const dashboardRouteHandler = require("../modules/dashboard/router");
const eventRouteHandler = require("../modules/events/router");
const categoryRouteHandler = require("../modules/category/router");
const bookingRouteHandler = require("../modules/booking/router");
const seatingGroupRouteHandler = require("../modules/seatingGroup/router");

class Routes {
	constructor(app) {
		this.app = app;
	}
	appRoutes() {
		this.app.use("/api/auth", authenticationRouteHandler);
		this.app.use("/api/user", usersRouteHandler);
		this.app.use("/api/event", eventRouteHandler);
		this.app.use("/api/registration", registrationRouteHandler);
		this.app.use("/api/dashboard", dashboardRouteHandler);
		this.app.use("/api/category", categoryRouteHandler);
		this.app.use("/api/booking", bookingRouteHandler);
		this.app.use("/api/seatingGroup", seatingGroupRouteHandler);
	}
	routesConfig() {
		this.appRoutes();
	}
}
module.exports = Routes;
