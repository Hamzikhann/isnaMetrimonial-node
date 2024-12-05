"use strict";

module.exports = (sequelize, DataTypes) => {
	const table = sequelize.define(
		"events",
		{
			eventName: DataTypes.STRING,
			eventAddress: DataTypes.STRING,
			eventStartDate: DataTypes.DATEONLY,
			eventEndDate: DataTypes.DATEONLY,
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			}
		},
		{ timestamps: true }
	);
	table.associate = function (models) {
		table.belongsTo(models.eventCategories);
		// table.hasMany(models.bookings);
	};
	return table;
};
