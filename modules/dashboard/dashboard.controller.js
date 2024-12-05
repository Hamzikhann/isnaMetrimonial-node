const Joi = require("@hapi/joi");

const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const crypto = require("../../utils/crypto");

const EducationLevel = db.educationLevel;
const Categories = db.categories;
const Profession = db.profession;
const SeatingGroup = db.seatingGroup;
const Registration = db.registration;

exports.list = async (req, res) => {
	try {
		let educationLevel = await EducationLevel.findAll({
			where: { isActive: "Y" },
			attributes: { exclude: ["createdAt", "updatedAt"] }
		});
		let categories = await Categories.findAll({
			where: { isActive: "Y" },
			attributes: { exclude: ["createdAt", "updatedAt"] }
		});
		let profession = await Profession.findAll({
			where: { isActive: "Y" },
			attributes: { exclude: ["createdAt", "updatedAt"] }
		});
		let seatingGroup = await SeatingGroup.findAll({
			where: { isActive: "Y" },
			attributes: { exclude: ["createdAt", "updatedAt"] }
		});
		let totalRegistration = await Registration.count({ where: { isActive: "Y" } });
		res.send({
			message: "DropDown list",
			data: {
				educationLevel,
				categories,
				profession,
				seatingGroup,
				totalRegistration
			}
		});
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
