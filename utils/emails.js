const fs = require("fs");
const secrets = require("../config/secrets");
const nodeMailer = require("./nodeMailer");
const crypto = require("../utils/crypto");
const db = require("../models");

var { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const token =
	"Zoho-enczapikey wSsVR613qEGkCq0unDL8Lroxy1oHU1rzRxsujVT0un6pTfGWp8dvlEWfBQCjFKJMGTM/F2MTrbl9zB4Dg2UK24gpyVAIWiiF9mqRe1U4J3x17qnvhDzOXGxbkBqLKYkNww9qnGRpEcok+g==";

let client = new SendMailClient({ url, token });

const emailErrorTo = secrets.email.error;
const emailFrom = secrets.email.auth.from;

const Registration = db.registration;
const EducationLevel = db.educationLevel;
const Profession = db.profession;
const SeatingGroup = db.seatingGroup;
const Bookings = db.bookings;
const Categories = db.categories;

/**
 * Email component
 * @constructor
 */
function Email() {}

Email.errorEmail = async (req, error) => {
	try {
		const data = fs.readFileSync("./templates/emailError.html", "utf8");
		var text = data;
		const userInfo = {
			userId: req.userId ? crypto.decrypt(req.userId) : "NULL",
			roleId: req.roleId ? crypto.decrypt(req.roleId) : "NULL",
			role: req.role ? req.role : "NULL"
		};
		// =================== device info ====================
		const DeviceDetector = require("device-detector-js");
		const deviceDetector = new DeviceDetector();
		const userAgent = req.headers && req.headers["user-agent"] ? req.headers["user-agent"] : null;
		const deviceInfo = userAgent ? deviceDetector.parse(userAgent) : null;
		//=====================================================
		text = text.replace("[USER_INFO]", JSON.stringify(userInfo));
		text = text.replace("[DEVICE_INFO]", JSON.stringify(deviceInfo));
		text = text.replace("[API]", JSON.stringify(req.originalUrl));
		text = text.replace("[METHOD]", req.method ? req.method : null);
		text = text.replace("[REQ_BODY]", JSON.stringify(req.body));
		text = text.replace("[REQ_PARAMS]", JSON.stringify(req.params));
		text = text.replace("[ERROR]", error);
		var mailOptions = {
			from: `ISNA <${emailFrom}>`,
			to: emailErrorTo,
			subject: "ERROR in ISNA Bazar(" + req.headers.origin + ")",
			html: text
		};
		return nodeMailer(mailOptions);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

Email.bookingConfirmation = async (id) => {
	try {
		const bookingId = id;
		let booking = await Bookings.findOne({
			where: { id: bookingId, isActive: "Y" },
			include: [
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
				}
			]
		});
		if (booking) {
			const registration = booking.registration;

			const data = fs.readFileSync("./templates/emailBooking.html", "utf8");
			var text = data;

			text = text.replace("[NAME]", registration.firstName + " " + registration.lastName);
			text = text.replace("[DOB]", registration.dateOfBirth);
			text = text.replace("[GENDER]", registration.gender);
			text = text.replace("[MARITIAL_STATUS]", registration.martialStatus);
			text = text.replace(
				"[EDUCATION_LEVEL]",
				registration.educationLevel.title == "Other"
					? registration.educationLevelOther
					: registration.educationLevel.title
			);
			text = text.replace("[RESIDENTIAL_STATUS]", registration.residentialStatus);
			text = text.replace(
				"[PROFESSION]",
				registration.profession.title == "Other" ? registration.otherProfession : registration.profession.title
			);
			text = text.replace("[EMAIL]", registration.email);
			text = text.replace("[ADDRESS]", registration.address);
			text = text.replace("[CITY]", registration.city);
			text = text.replace("[STATE]", registration.state);
			text = text.replace("[PHONE1]", registration.phone);
			text = text.replace("[PHONE2]", registration.cellPhone);
			text = text.replace("[ETHNIC]", registration.ethnicBackground);
			text = text.replace("[SEATING_GROUP]", registration?.seatingGroup.title);
			text = text.replace("[REGISTRATION_CATEGORY_TITLE]", registration?.category.title);
			text = text.replace("[REGISTRATION_CATEGORY_PRICE]", registration?.category.price);

			let sendmail = await client.sendMail({
				from: {
					address: "noreply@iqvis.net",
					name: "ISNA Matrimonial"
				},
				to: [
					{
						email_address: {
							address: registration.email,
							name: registration.firstName + " " + registration.lastName
						}
					}
				],
				subject: "Matrimonial Registration Confirmation - 61st Annual ISNA Convention",
				htmlbody: text
			});

			console.log(bookingId, registration.email, sendmail.message, sendmail.data);
		} else {
			console.log("Error in booking id in bookingConfirmation", bookingId);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

module.exports = Email;
