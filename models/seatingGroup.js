"use strict";

module.exports = (sequelize, DataTypes) => {
	const table = sequelize.define(
		"seatingGroup",
		{
			title: DataTypes.STRING,

			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			},
			femaleStatus: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			},
			maleStatus: {
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
