"use strict";

module.exports = (sequelize, DataTypes) => {
	const table = sequelize.define(
		"educationLevel",
		{
			title: DataTypes.STRING,
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			}
		},
		{ timestamps: true }
	);
	table.associate = function (models) {
		table.hasMany(models.registration);
	};
	return table;
};
