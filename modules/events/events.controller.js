const Joi = require("@hapi/joi");

const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const crypto = require("../../utils/crypto");
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

const Events = db.events;
const EventCategories = db.eventCategories;

exports.detail = (req, res) => {
	try {
		const joiSchema = Joi.object({
			eventId: Joi.string().optional()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			Events.findOne({
				where: { isActive: "Y" },
				include: [
					{
						model: EventCategories,
						attributes: { exclude: ["createdAt", "id", "updatedAt", "isActive"] }
					}
				],
				attributes: { exclude: ["createdAt", "updatedAt", "isActive", "eventCategoryId"] }
			})
				.then((response) => {
					encryptHelper(response);
					res.send({ message: "Detail for an Event retrieved", data: response });
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
