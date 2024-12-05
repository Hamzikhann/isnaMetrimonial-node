"use strict";

module.exports = (sequelize, DataTypes) => {
	const table = sequelize.define(
		"categories",
		{
			title: DataTypes.STRING,
			price: DataTypes.STRING,
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
