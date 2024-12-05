const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const crypto = require("../../utils/crypto");
const { sequelize } = require("../../models");
const Op = db.Sequelize.Op;

const Events = db.events;
const BookingPayment = db.bookingPayment;
const Registration = db.registration;
const Bookings = db.bookings;
const Categories = db.categories;

const EducationLevel = db.educationLevel;
const Profession = db.profession;
const SeatingGroup = db.seatingGroup;

exports.create = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			eventId: Joi.string().required().messages({ "string.empty": `"Event ID" is the required field` }),
			userId: Joi.string().optional(),
			totalPayment: Joi.number()
				.required()
				.messages({ "number.empty": `"Total Amount" is not allowed to be empty or '0'` }),
			registrationMethod: Joi.string()
				.required()
				.messages({ "string.empty": `"Payment Registration" is not allowed to be empty` }),
			paymentMethod: Joi.string()
				.required()
				.messages({ "string.empty": `"Payment Method" is not allowed to be empty` }),
			referenceNo: Joi.string()
				.required()
				.messages({ "string.empty": `"Payment Reference" is not allowed to be empty` }),
			status: Joi.string().required().messages({ "string.empty": `"Payment Status" is not allowed to be empty` }),
			firstName: Joi.string().required().messages({ "string.empty": `"First Name" is the required field` }),
			lastName: Joi.string().required().messages({ "string.empty": `"Lasy Name" is the required field` }),
			email: Joi.string().required().messages({ "string.empty": `"Email" is the required field` }),
			martialStatus: Joi.string().required().messages({ "string.empty": `"Martial Status" is the required field` }),
			gender: Joi.string().required().messages({ "string.empty": `"Gender" is the required field` }),
			otherProfession: Joi.string().optional().allow("").allow(null),
			residentialStatus: Joi.string()
				.required()
				.messages({ "string.empty": `"Residential Status" is the required field` }),
			residentialStatusOther: Joi.string().optional().allow("").allow(null),

			ethnicBackground: Joi.string()
				.required()
				.messages({ "string.empty": `"Ethnic Background" is the required field` }),
			address: Joi.string().required().messages({ "string.empty": `"Address" is the required field` }),
			city: Joi.string().required().messages({ "string.empty": `"City" is the required field` }),
			country: Joi.string().optional().messages({ "string.empty": `"Country" is the required field` }),
			otherCountry: Joi.string().optional().allow("").allow(null),
			state: Joi.string().required().messages({ "string.empty": `"State" is the required field` }),
			otherState: Joi.string().optional().allow("").allow(null),
			zipCode: Joi.any().required().messages({ "string.empty": `"Zipcode / Postal code" is the required field` }),
			phone: Joi.any().required().messages({ "number.empty": `"Phone" is the required field` }),
			cellPhone: Joi.any().optional().allow("").allow(null),
			dateOfBirth: Joi.string().required().messages({ "string.empty": `"Date of Birth" is the required field` }),
			parentFirstName: Joi.string().optional().allow(null).allow(""),
			parentLastName: Joi.string().optional().allow(null).allow(""),
			relationship: Joi.string().optional().allow(null).allow(""),
			categoryId: Joi.string().required().messages({ "string.empty": `"CategoryId" is the required field` }),
			educationLevelId: Joi.string()
				.required()
				.messages({ "string.empty": `"EducationlevelId" is the required field` }),
			educationLevelOther: Joi.string().optional().allow("").allow(null),
			professionId: Joi.string().required().messages({ "string.empty": `"ProfessionalId" is the required field` }),
			seatingGroupId: Joi.string().optional().allow(null).allow("")
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const eventId = crypto.decrypt(req.body.eventId);
			const status = req.body.status;
			const userId = req.userId ? crypto.decrypt(req.userId) : null;

			const totalPayment = req.body.totalPayment;
			const registrationMethod = req.body.registrationMethod;
			const paymentMethod = req.body.paymentMethod;
			const referenceNo = req.body.referenceNo;

			//contact info
			const firstName = req.body.firstName;
			const lastName = req.body.lastName;
			const email = req.body.email;
			const martialStatus = req.body.martialStatus;
			const gender = req.body.gender;
			const otherProfession = req.body.otherProfession ? req.body.otherProfession : null;
			const residentialStatus =
				req.body.residentialStatus == "Other" ? req.body.residentialStatusOther : req.body.residentialStatus;
			const ethnicBackground = req.body.ethnicBackground;
			const address = req.body.address;
			const city = req.body.city;
			const country = req.body.country;
			const otherCountry = req.body.otherCountry ? req.body.otherCountry : null;
			const state = req.body.state;
			const otherState = req.body.otherState ? req.body.otherState : null;
			const zipCode = req.body.zipCode;
			const phone = req.body.phone;
			const cellPhone = req.body.cellPhone;
			const dateOfBirth = req.body.dateOfBirth;
			const parentFirstName = req.body.parentFirstName;
			const parentLastName = req.body.parentLastName;
			const relationship = req.body.relationship;
			const categoryId = req.body.categoryId;
			const educationLevelId = req.body.educationLevelId;
			const educationLevelOther = req.body.educationLevelOther;
			const professionId = req.body.professionId;
			const seatingGroupId = req.body.seatingGroupId;

			const currentDate = new Date();
			const date = currentDate.toISOString().split("T")[0];

			const registrationObj = {
				firstName,
				lastName,
				email,
				martialStatus,
				gender,
				otherProfession,
				residentialStatus,
				ethnicBackground,
				address,
				city,
				country,
				otherCountry,
				state,
				otherState,
				zipCode,
				phone,
				cellPhone,
				dateOfBirth,
				parentFirstName,
				parentLastName,
				relationship,
				categoryId,
				educationLevelId,
				educationLevelOther,
				professionId,
				seatingGroupId
			};
			const bookingObj = {
				date: date,
				status: status,
				eventId: eventId,
				userId: userId
			};

			let transaction = await sequelize.transaction();

			Bookings.create(bookingObj, { transaction })
				.then(async (response) => {
					if (response) {
						registrationObj.bookingId = response.id;
						const createRegistration = await Registration.create(registrationObj, { transaction });

						const createBookingPayments = await BookingPayment.create(
							{
								bookingId: response.id,
								registrationMethod: registrationMethod,
								paymentMethod: paymentMethod,
								totalPayment: totalPayment,
								referenceNo: referenceNo
							},
							{ transaction }
						);

						await transaction.commit();

						emails.bookingConfirmation(response.id);

						let totalBookings = await Bookings.count({
							where: {
								isActive: "Y",
								status: "Success"
							},
							include: [
								{
									model: Registration,
									where: {
										gender,
										seatingGroupId
									}
								}
							]
						});

						console.log("Total Bookings for ", gender, "Age Group:", seatingGroupId, totalBookings);

						if (totalBookings >= 50) {
							if (gender == "Male") {
								await SeatingGroup.update({ maleStatus: "N" }, { where: { id: seatingGroupId } });
								console.log(gender, "Age Group:", seatingGroupId, "Booking Closed");
							}
							if (gender == "Female") {
								await SeatingGroup.update({ femaleStatus: "N" }, { where: { id: seatingGroupId } });
								console.log(gender, "Age Group:", seatingGroupId, "Booking Closed");
							}
						}

						encryptHelper(response);
						res.send({ message: "Booking is confirmend", data: response });
					} else {
						res.send({ message: "Booking is already made" });
					}
				})
				.catch(async (err) => {
					console.log(err);
					if (transaction) await transaction.rollback();

					emails.errorEmail(req, err);
					res.status(500).send({
						message: err.message || "Some error occurred."
					});
				});
		}
	} catch (err) {
		console.log(err);
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

exports.createAdmin = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			eventId: Joi.string().required().messages({ "string.empty": `"Event ID" is the required field` }),
			userId: Joi.string().optional(),
			totalPayment: Joi.number()
				.required()
				.messages({ "number.empty": `"Total Amount" is not allowed to be empty or '0'` }),
			registrationMethod: Joi.string()
				.required()
				.messages({ "string.empty": `"Payment Registration" is not allowed to be empty` }),
			paymentMethod: Joi.string()
				.required()
				.messages({ "string.empty": `"Payment Method" is not allowed to be empty` }),
			referenceNo: Joi.string()
				.required()
				.messages({ "string.empty": `"Payment Reference" is not allowed to be empty` }),
			status: Joi.string().required().messages({ "string.empty": `"Payment Status" is not allowed to be empty` }),
			firstName: Joi.string().required().messages({ "string.empty": `"First Name" is the required field` }),
			lastName: Joi.string().required().messages({ "string.empty": `"Lasy Name" is the required field` }),
			email: Joi.string().required().messages({ "string.empty": `"Email" is the required field` }),
			martialStatus: Joi.string().required().messages({ "string.empty": `"Martial Status" is the required field` }),
			gender: Joi.string().required().messages({ "string.empty": `"Gender" is the required field` }),
			otherProfession: Joi.string().optional().allow("").allow(null),
			residentialStatus: Joi.string()
				.required()
				.messages({ "string.empty": `"Residential Status" is the required field` }),
			residentialStatusOther: Joi.string().optional().allow("").allow(null),

			ethnicBackground: Joi.string()
				.required()
				.messages({ "string.empty": `"Ethnic Background" is the required field` }),
			address: Joi.string().required().messages({ "string.empty": `"Address" is the required field` }),
			city: Joi.string().required().messages({ "string.empty": `"City" is the required field` }),
			country: Joi.string().optional().messages({ "string.empty": `"Country" is the required field` }),
			otherCountry: Joi.string().optional().allow("").allow(null),
			state: Joi.string().required().messages({ "string.empty": `"State" is the required field` }),
			otherState: Joi.string().optional().allow("").allow(null),
			zipCode: Joi.any().required().messages({ "string.empty": `"Zipcode / Postal code" is the required field` }),
			phone: Joi.any().required().messages({ "number.empty": `"Phone" is the required field` }),
			cellPhone: Joi.any().optional().allow("").allow(null),
			dateOfBirth: Joi.string().required().messages({ "string.empty": `"Date of Birth" is the required field` }),
			parentFirstName: Joi.string().optional().allow(null).allow(""),
			parentLastName: Joi.string().optional().allow(null).allow(""),
			relationship: Joi.string().optional().allow(null).allow(""),
			categoryId: Joi.string().required().messages({ "string.empty": `"CategoryId" is the required field` }),
			educationLevelId: Joi.string()
				.required()
				.messages({ "string.empty": `"EducationlevelId" is the required field` }),
			educationLevelOther: Joi.string().optional().allow("").allow(null),
			professionId: Joi.string().required().messages({ "string.empty": `"ProfessionalId" is the required field` }),
			seatingGroupId: Joi.string().optional().allow(null).allow("")
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const eventId = req.body.eventId;
			const status = req.body.status;
			const userId = req.userId ? crypto.decrypt(req.userId) : null;

			const totalPayment = req.body.totalPayment;
			const registrationMethod = req.body.registrationMethod;
			const paymentMethod = req.body.paymentMethod;
			const referenceNo = req.body.referenceNo;

			//contact info
			const firstName = req.body.firstName;
			const lastName = req.body.lastName;
			const email = req.body.email;
			const martialStatus = req.body.martialStatus;
			const gender = req.body.gender;
			const otherProfession = req.body.otherProfession ? req.body.otherProfession : null;
			const residentialStatus =
				req.body.residentialStatus == "Other" ? req.body.residentialStatusOther : req.body.residentialStatus;
			const ethnicBackground = req.body.ethnicBackground;
			const address = req.body.address;
			const city = req.body.city;
			const country = req.body.country;
			const otherCountry = req.body.otherCountry ? req.body.otherCountry : null;
			const state = req.body.state;
			const otherState = req.body.otherState ? req.body.otherState : null;
			const zipCode = req.body.zipCode;
			const phone = req.body.phone;
			const cellPhone = req.body.cellPhone;
			const dateOfBirth = req.body.dateOfBirth;
			const parentFirstName = req.body.parentFirstName;
			const parentLastName = req.body.parentLastName;
			const relationship = req.body.relationship;
			const categoryId = req.body.categoryId;
			const educationLevelId = req.body.educationLevelId;
			const educationLevelOther = req.body.educationLevelOther;
			const professionId = req.body.professionId;
			const seatingGroupId = req.body.seatingGroupId;

			const currentDate = new Date();
			const date = currentDate.toISOString().split("T")[0];

			const registrationObj = {
				firstName,
				lastName,
				email,
				martialStatus,
				gender,
				otherProfession,
				residentialStatus,
				ethnicBackground,
				address,
				city,
				country,
				otherCountry,
				state,
				otherState,
				zipCode,
				phone,
				cellPhone,
				dateOfBirth,
				parentFirstName,
				parentLastName,
				relationship,
				categoryId,
				educationLevelId,
				educationLevelOther,
				professionId,
				seatingGroupId
			};
			const bookingObj = {
				date: date,
				status: status,
				eventId: eventId,
				userId: userId
			};

			let transaction = await sequelize.transaction();

			Bookings.create(bookingObj, { transaction })
				.then(async (response) => {
					if (response) {
						registrationObj.bookingId = response.id;
						const createRegistration = await Registration.create(registrationObj, { transaction });

						const createBookingPayments = await BookingPayment.create(
							{
								bookingId: response.id,
								registrationMethod: registrationMethod,
								paymentMethod: paymentMethod,
								totalPayment: totalPayment,
								referenceNo: referenceNo
							},
							{ transaction }
						);

						await transaction.commit();

						emails.bookingConfirmation(response.id);

						let totalBookings = await Bookings.count({
							where: {
								isActive: "Y",
								status: "Success"
							},
							include: [
								{
									model: Registration,
									where: {
										gender,
										seatingGroupId
									}
								}
							]
						});

						console.log("Total Bookings for ", gender, "Age Group:", seatingGroupId, totalBookings);

						if (totalBookings >= 50) {
							if (gender == "Male") {
								await SeatingGroup.update({ maleStatus: "N" }, { where: { id: seatingGroupId } });
								console.log(gender, "Age Group:", seatingGroupId, "Booking Closed");
							}
							if (gender == "Female") {
								await SeatingGroup.update({ femaleStatus: "N" }, { where: { id: seatingGroupId } });
								console.log(gender, "Age Group:", seatingGroupId, "Booking Closed");
							}
						}

						encryptHelper(response);
						res.send({ message: "Booking is confirmend", data: response });
					} else {
						res.send({ message: "Booking is already made" });
					}
				})
				.catch(async (err) => {
					console.log(err);
					if (transaction) await transaction.rollback();

					emails.errorEmail(req, err);
					res.status(500).send({
						message: err.message || "Some error occurred."
					});
				});
		}
	} catch (err) {
		console.log(err);
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

exports.detail = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			bookingId: Joi.string().required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const bookingId = crypto.decrypt(req.body.bookingId);

			Bookings.findOne({
				where: { id: bookingId, isActive: "Y" },
				include: [
					{
						model: Events,
						attributes: { exclude: ["id", "createdAt", "updatedAt", "bookingId"] }
					},
					{
						model: Registration,
						include: [
							{
								model: Categories,
								attributes: { exclude: ["id", "createdAt", "updatedAt", "isActive"] }
							},
							{
								model: EducationLevel,
								attributes: { exclude: ["id", "createdAt", "updatedAt", "isActive"] }
							},
							{
								model: Profession,
								attributes: { exclude: ["id", "createdAt", "updatedAt", "isActive"] }
							},
							{
								model: SeatingGroup,
								attributes: { exclude: ["id", "createdAt", "updatedAt", "isActive"] }
							}
						],
						attributes: { exclude: ["id", "createdAt", "updatedAt", "bookingId"] }
					},
					{
						model: BookingPayment,
						attributes: { exclude: ["id", "createdAt", "updatedAt", "bookingId"] }
					}
				],
				attributes: { exclude: ["createdAt", "updatedAt", "userId", "eventId"] }
			})
				.then((response) => {
					encryptHelper(response);
					res.send({ message: "Details of the booking are retrieved", data: response });
				})
				.catch((err) => {
					emails.errorEmail(req, err);
					res.status(500).send({
						message: err.message || "Some error occurred."
					});
				});
		}
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

exports.list = async (req, res) => {
	try {
		Bookings.findAll({
			where: { isActive: "Y" },
			attributes: ["id", "status", "createdAt"],
			include: [
				{
					model: Registration,
					include: [
						{
							model: Categories,
							where: { isActive: "Y" },
							attributes: ["title", "price"]
						},
						{
							model: EducationLevel,
							where: { isActive: "Y" },
							attributes: ["title"]
						},
						{
							model: SeatingGroup,
							where: { isActive: "Y" },
							attributes: ["title"]
						},
						{
							model: Profession,
							where: { isActive: "Y" },
							attributes: ["title"]
						}
					],
					attributes: {
						exclude: [
							"id",
							"createdAt",
							"updatedAt",
							"bookingId",
							"categoryId",
							"professionId",
							"educationLevelId",
							"seatingGroupId"
						]
					}
				},
				{
					model: BookingPayment,
					attributes: { exclude: ["id", "createdAt", "updatedAt", "bookingId"] }
				}
			]
		})
			.then(async (response) => {
				await response.forEach((element) => {
					element.dataValues.idEncrypted = crypto.encrypt(element.id);
				});

				res.send({ message: "All Bookings List", data: response });
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

exports.refund = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			referenceNo: Joi.string().required()
		});
		const { error, value } = joiSchema.validate(req.body);
		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const stripe = require("stripe")(process.env.STRIPE_KEY);
			const referenceNo = req.body.referenceNo;
			let transaction = await sequelize.transaction();
			BookingPayment.findOne({ where: { referenceNo: referenceNo, isActive: "Y" } }).then(async (response) => {
				if (response) {
					const refund = await stripe.refunds.create({
						payment_intent: referenceNo
					});
					if (refund) {
						let bookingId = response.bookingId;
						const updateBookings = await Bookings.update(
							{ status: "Cancel" },
							{ where: { id: bookingId } },
							{ transaction }
						);
						res.send({ message: "Refund is Successful", data: refund });
					} else {
						res.send({ message: "Some Error while Refunding the payment. Please retry again later" });
					}
				} else {
					res.send({ message: "There is no payment with this referenceNo" });
				}
			});
		}
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

exports.update = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			bookingId: Joi.string().required().messages({ "string.empty": `"Booking ID" is the required field` }),
			firstName: Joi.string().required().messages({ "string.empty": `"First Name" is the required field` }),
			lastName: Joi.string().required().messages({ "string.empty": `"Last Name" is the required field` }),
			email: Joi.string().required().messages({ "string.empty": `"Email" is the required field` }),
			phoneOffice: Joi.string().required().messages({ "string.empty": `"Phone Office" is the required field` }),
			phoneHome: Joi.string().optional().allow("").allow(null),
			fax: Joi.string().optional().allow("").allow(null),
			address: Joi.string().required().messages({ "string.empty": `"Address" is the required field` }),
			city: Joi.string().required().messages({ "string.empty": `"City" is the required field` }),
			state: Joi.string().required().messages({ "string.empty": `"State" is the required field` }),
			zipcode: Joi.string().optional().allow("").allow(null)
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const bookingId = req.body.bookingId;
			const contactObj = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				phoneOffice: req.body.phoneOffice,
				phoneHome: req.body.phoneHome,
				fax: req.body.fax,
				address: req.body.address,
				city: req.body.city,
				state: req.body.state,
				zipcode: req.body.zipcode
			};
			BookingContact.update(contactObj, { where: { bookingId: bookingId } })
				.then((response) => {
					if (response) {
						res.send({ message: "Booking details updated successfully" });
					}
				})
				.catch((err) => {
					emails.errorEmail(req, err);
					res.status(500).send({
						message: err.message || "Some error occurred."
					});
				});
		}
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
