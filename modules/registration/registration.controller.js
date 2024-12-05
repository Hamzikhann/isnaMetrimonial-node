const Joi = require("@hapi/joi");

const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const crypto = require("../../utils/crypto");

const Registration = db.registration;
const Categories = db.categories;
const Profession = db.profession;
const SeatingGroup = db.seatingGroup;
const EducationLevel = db.educationLevel;
const Bookings = db.bookings;

exports.list = (req, res) => {
	try {
		Registration.findAll({
			where: { isActive: "Y" },
			include: [
				{
					model: Categories,
					where: { isActive: "Y" }
				},
				{
					model: Profession,
					where: { isActive: "Y" }
				},
				{
					model: SeatingGroup,
					where: { isActive: "Y" }
				},
				{
					model: EducationLevel,
					where: { isActive: "Y" }
				},
				{
					model: Bookings,
					where: { isActive: "Y" }
				}
			],
			attributes: {
				exclude: ["professionId", "categoriesId", "seatingGroupId", "educationLevelId", "updatedAt", "createdAt"]
			}
		})
			.then((response) => {
				if (response) {
					res.send({ message: "List of Registration", data: response });
				}
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

exports.create = (req, res) => {
	try {
		const joiSchema = Joi.object({
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			email: Joi.string().required(),
			martialStatus: Joi.string().required(),
			gender: Joi.string().required(),
			otherProfession: Joi.string().optional().allow("").allow(null),
			residentialStatus: Joi.string().required(),
			ethnicBackground: Joi.string().required(),
			address: Joi.string().required(),
			city: Joi.string().required(),
			country: Joi.string().required(),
			otherCountry: Joi.string().optional().allow(null).allow(""),
			state: Joi.string().required(),
			otherState: Joi.string().optional().allow(null).allow(""),
			zipCode: Joi.string().required(),
			phone: Joi.string().required(),
			cellPhone: Joi.string().optional().allow("").allow(null),
			dateOfBirth: Joi.string().required(),
			parentFirstName: Joi.string().required(),
			parentLastName: Joi.string().required(),
			categoryId: Joi.string().required(),
			educationLevelId: Joi.string().required(),
			professionId: Joi.string().required(),
			seatingGroupId: Joi.string().optional().allow(null).allow("")
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const registrationObj = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				martialStatus: req.body.martialStatus,
				gender: req.body.gender,
				otherProfession: req.body.otherProfession ? req.body.otherProfession : null,
				residentialStatus: req.body.residentialStatus,
				ethnicBackground: req.body.ethnicBackground,
				address: req.body.address,
				city: req.body.city,
				country: req.body.country,
				otherCountry: req.body.otherCountry ? req.body.otherCountry : null,
				state: req.body.state,
				otherState: req.body.otherState ? req.body.otherState : null,
				zipCode: req.body.zipCode,
				phone: req.body.phone,
				cellPhone: req.body.cellPhone ? req.body.cellPhone : null,
				dateOfBirth: req.body.dateOfBirth,
				parentFirstName: req.body.parentFirstName,
				parentLastName: req.body.parentLastName,
				categoryId: req.body.categoryId,
				educationLevelId: req.body.educationLevelId,
				professionId: req.body.professionId,
				seatingGroupId: req.body.seatingGroupId
			};

			Registration.create(registrationObj)
				.then((response) => {
					if (response) {
						res.send({ message: "Registration is Created", data: response });
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

exports.update = (req, res) => {
	try {
		const joiSchema = Joi.object({
			bookingId: Joi.number().required(),
			id: Joi.number().required(),
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			email: Joi.string().required(),
			martialStatus: Joi.string().required(),
			gender: Joi.string().required(),
			otherProfession: Joi.string().optional().allow("").allow(null),
			residentialStatus: Joi.string().required(),
			ethnicBackground: Joi.string().required(),
			address: Joi.string().required(),
			city: Joi.string().required(),
			country: Joi.string().required(),
			otherCountry: Joi.string().optional().allow(null).allow(""),
			state: Joi.string().required(),
			otherState: Joi.string().optional().allow(null).allow(""),
			zipCode: Joi.string().optional().allow("").allow(null),
			phone: Joi.string().required(),
			cellPhone: Joi.string().optional().allow("").allow(null),
			dateOfBirth: Joi.string().required(),
			parentFirstName: Joi.string().optional().allow("").allow(null),
			parentLastName: Joi.string().optional().allow("").allow(null),
			educationLevelId: Joi.string().required(),
			educationLevelOther: Joi.string().optional().allow("").allow(null),
			professionId: Joi.string().required(),
			seatingGroupId: Joi.string().required(),
			categoryId: Joi.string().required(),
			relationship: Joi.string().optional().allow("").allow(null)
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			let educationLevelId = req.body.educationLevelId;
			let professionId = req.body.professionId;
			let seatingGroupId = req.body.seatingGroupId;
			let categoryId = req.body.categoryId;

			const registrationObj = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				martialStatus: req.body.martialStatus,
				gender: req.body.gender,
				otherProfession: req.body.otherProfession ? req.body.otherProfession : null,
				residentialStatus: req.body.residentialStatus,
				ethnicBackground: req.body.ethnicBackground,
				address: req.body.address,
				city: req.body.city,
				country: req.body.country,
				otherCountry: req.body.otherCountry ? req.body.otherCountry : null,
				state: req.body.state,
				otherState: req.body.otherState ? req.body.otherState : null,
				zipCode: req.body.zipCode,
				phone: req.body.phone,
				educationLevelOther: req.body.educationLevelOther,
				cellPhone: req.body.cellPhone ? req.body.cellPhone : null,
				dateOfBirth: req.body.dateOfBirth,
				parentFirstName: req.body.parentFirstName,
				parentLastName: req.body.parentLastName,
				relationship: req.body.relationship
			};

			if (seatingGroupId != "0") registrationObj.seatingGroupId = seatingGroupId;

			if (professionId != "0") registrationObj.professionId = professionId;

			if (educationLevelId != "0") registrationObj.educationLevelId = educationLevelId;

			if (categoryId != "0") registrationObj.categoryId = categoryId;

			Registration.update(registrationObj, { where: { id: req.body.id } })
				.then((response) => {
					if (response) {
						res.send({ message: "Registration is Updated", data: response });
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
