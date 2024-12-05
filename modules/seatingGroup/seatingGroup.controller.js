const Joi = require("@hapi/joi");

const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const crypto = require("../../utils/crypto");
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

const SeatingGroup = db.seatingGroup;

exports.update = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			seatingGroup: Joi.any().required()
			// femaleIds: Joi.array().required()
		});
		const { error, value } = joiSchema.validate(req.body);
		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			// const eventId = crypto.decrypt(req.body.eventId);
			const seatingGroup = req.body.seatingGroup ? req.body.seatingGroup : null;
			// const femaleIds = req.body.femaleIds ? req.body.femaleIds : null;
			let updateFemale;
			let updateMale;
			console.log(seatingGroup);
			let seatingGroups = await SeatingGroup.findAll({ where: { isActive: "Y" }, attributes: ["id"] });
			// console.log(seatingGroup);

			let idsmale = [];
			let idsfemale = [];
			// console.log(idsfemale, idsmale);
			seatingGroup.forEach(async (e) => {
				if (!e.malechecked) {
					let update = await SeatingGroup.update({ maleStatus: "N" }, { where: { id: e.id } });
				}
				if (!e.femalechecked) {
					let update = await SeatingGroup.update({ femaleStatus: "N" }, { where: { id: e.id } });
				}

				if (e.maleStatus == "N" && e.malechecked == true) {
					let update = await SeatingGroup.update({ maleStatus: "Y" }, { where: { id: e.id } });
				}
				if (e.femaleStatus == "N" && e.femalechecked == true) {
					let update = await SeatingGroup.update({ femaleStatus: "Y" }, { where: { id: e.id } });
				}
			});

			// if (femaleIds) {
			// 	updateFemale = await SeatingGroup.update({ femaleStatus: "N" }, { where: { id: femaleIds } });
			// }
			// if (maleIds) {
			// 	updateMale = await SeatingGroup.update({ maleStatus: "N" }, { where: { id: maleIds } });
			// }
			res.send({ message: "Configuration is saved" });
		}
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

exports.detail = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			gender: Joi.string().required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const gender = req.body.gender;
			let whereClause;
			if (gender == "male" || gender == "Male") {
				whereClause = { isActive: "Y", maleStatus: "Y" };
			}
			if (gender == "female" || gender == "Female") {
				whereClause = { isActive: "Y", femaleStatus: "Y" };
			}

			SeatingGroup.findAll({ where: whereClause })
				.then((response) => {
					res.send({ message: `Seating Group for ${gender} is retrived`, data: response });
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
