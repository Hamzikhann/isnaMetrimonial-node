"use strict";

module.exports = (sequelize, DataTypes) => {
	const table = sequelize.define(
		"registration",
		{
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			email: DataTypes.STRING,
			martialStatus: DataTypes.STRING,
			gender: DataTypes.STRING,
			otherProfession: DataTypes.STRING,
			residentialStatus: DataTypes.STRING,
			ethnicBackground: DataTypes.STRING,
			address: DataTypes.STRING,
			city: DataTypes.STRING,
			country: DataTypes.STRING,
			otherCountry: DataTypes.STRING,
			state: DataTypes.STRING,
			otherState: DataTypes.STRING,
			zipCode: DataTypes.STRING,
			phone: DataTypes.STRING,
			cellPhone: DataTypes.STRING,
			dateOfBirth: DataTypes.STRING,
			parentFirstName: DataTypes.STRING,
			parentLastName: DataTypes.STRING,
			relationship: DataTypes.STRING,
			educationLevelOther: DataTypes.STRING,
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			}
		},
		{ timestamps: true }
	);
	table.associate = function (models) {
		table.belongsTo(models.categories);
		table.belongsTo(models.seatingGroup);
		table.belongsTo(models.profession);
		table.belongsTo(models.educationLevel);
		table.belongsTo(models.bookings);
	};
	return table;
};
