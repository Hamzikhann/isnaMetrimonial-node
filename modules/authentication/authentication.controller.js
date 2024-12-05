const db = require("../../models");
const jwt = require("../../utils/jwt");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Joi = require("@hapi/joi");

const Clients = db.clients;
const Users = db.users;
const Roles = db.roles;

exports.login = async (req, res) => {
	try {
		const userExist = await Users.findOne({
			where: {
				email: req.body.email.trim(),
				isActive: "Y"
			}
		});
		if (userExist) {
			const user = await Users.findOne({
				where: {
					email: req.body.email.trim(),
					password: req.body.password,
					isActive: "Y"
				},
				include: [
					{
						model: Roles,
						attributes: ["title"]
					}
				],
				attributes: ["id", "firstName", "lastName", "email", "roleId"]
			});
			if (user) {
				encryptHelper(user);
				const token = jwt.signToken({
					userId: user.id,
					roleId: user.roleId,
					role: user.role.title
				});
				res.status(200).send({
					messgae: "Logged in successful",
					data: { user },
					token
				});
			} else {
				res.status(403).send({ message: "Incorrect Logins" });
			}
		} else {
			res.status(401).send({
				title: "Incorrect Email.",
				message: "Email does not exist in our system, Please verify you have entered correct email."
			});
		}
	} catch (err) {
		emails.errorEmail(req, err);
		console.log(err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

exports.stripeCreatePaymentIntent = async (req, res) => {
	const stripe = require("stripe")(process.env.STRIPE_KEY);
	const amountInCents = Math.round(req.body.amount * 100);

	const paymentIntent = await stripe.paymentIntents.create({
		amount: amountInCents,
		currency: "USD"
	});

	res.send({ clientSecret: paymentIntent.client_secret });
};
