const Joi = require("@hapi/joi");

const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const crypto = require("../../utils/crypto");

const EducationLevel = db.educationLevel;
const Categories = db.categories;
const Profession = db.profession;
const SeatingGroup = db.seatingGroup;

exports.detail = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			categoryId: Joi.string().required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			Categories.findOne({ where: { id: req.body.categoryId }, isActive: "Y" })
				.then((response) => {
					res.send({ message: "Selected Category Detail", data: response });
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
