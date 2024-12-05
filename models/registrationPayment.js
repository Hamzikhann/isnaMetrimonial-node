"use strict";

module.exports = (sequelize, DataTypes) => {
	const table = sequelize.define(
		"registrationPayment",
		{
			registrationMethod: DataTypes.STRING,
			paymentMethod: DataTypes.STRING,
			totalPayment: DataTypes.STRING,
			referenceNo: DataTypes.STRING,
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			}
		},
		{ timestamps: true }
	);
	table.associate = function (models) {
		table.belongsTo(models.registration);
	};
	return table;
};
