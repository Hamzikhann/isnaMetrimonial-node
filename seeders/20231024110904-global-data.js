"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const date = new Date();

		await queryInterface.bulkInsert("roles", [{ title: "Administrator", createdAt: date, updatedAt: date }], {});

		await queryInterface.bulkInsert(
			"users",
			[
				{
					firstName: "Admin",
					lastName: "Account",
					email: "admin@isna.com",
					password: "Isna12!@",
					roleId: "1",
					createdAt: date,
					updatedAt: date
				}
			],
			{}
		);
		await queryInterface.bulkInsert(
			"professions",
			[
				{
					title: "Accountant",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Architect",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Civil Engineer",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Data Scientist",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Dentist",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Electrician",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Executive Assistant",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Financial Analyst",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Graphic Designer",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Human Resources Manager",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Marketing Manager",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Mechanical Engineer",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Operations Manager",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Pharmacist",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Physical Therapist",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Physician Assistant",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Registered Nurse",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Software Engineer",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Teacher",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Other",
					createdAt: date,
					updatedAt: date
				}
			],
			{}
		);

		await queryInterface.bulkInsert(
			"seatingGroups",
			[
				{
					title: "18-28",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "29-39",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "40-50",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "51-61",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "62-72",
					createdAt: date,
					updatedAt: date
				}
			],
			{}
		);
		await queryInterface.bulkInsert(
			"educationLevels",
			[
				{
					title: "High School Diploma/GED",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Associate's Degree",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Bachelor's Degree",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Master's Degree",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Doctorate Degree",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Other",
					createdAt: date,
					updatedAt: date
				}
			],
			{}
		);

		await queryInterface.bulkInsert(
			"categories",
			[
				{
					title: "Saturday Only [Single attending]",
					price: "84",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Saturday Only [with 1 Parent/Guardian]",
					price: "180",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Sunday Only [Single attending]",
					price: "84",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Sunday Only [with 1 Parent/Guardian]",
					price: "180",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Sunday and Saturday [Single attending]",
					price: "155",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Sunday and Saturday [with 1 Parent/Guardian]",
					price: "300",
					createdAt: date,
					updatedAt: date
				}
			],
			{}
		);
		await queryInterface.bulkInsert(
			"eventCategories",
			[
				{
					title: "Dinner",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Conference",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Matrimonial Banquet",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Online Bazaar",
					createdAt: date,
					updatedAt: date
				},
				{
					title: "Concert",
					createdAt: date,
					updatedAt: date
				}
			],
			{}
		);
		await queryInterface.bulkInsert(
			"events",
			[
				{
					eventName: "Matrimonial Banquets at 61st Annual ISNA Convention",
					eventAddress: "61st Annual ISNA Convention Matrimonial Banquets Hilton Anatole Dallas, TX",
					eventStartDate: "2024-08-30",
					eventEndDate: "2024-09-02",
					createdAt: date,
					updatedAt: date,
					eventCategoryId: 3
				}
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {}
};
