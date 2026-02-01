import mongoose from "mongoose";

const PropertySchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name not provided"],
		minLength: 8,
		maxLength: 100,
		trim: true,
	},
	location: {
		type: String,
		required: [true, "Location not provided"],
		minLength: 5,
		maxLength: 100,
		trim: true,
	},
	type: {
		type: String,
		required: [true, "Type not provided"],
		minLength: 5,
		maxLength: 100,
		trim: true,
	},
	description: {
		type: String,
		required: [true, "Description not provided"],
		minLength: 5,
		maxLength: 2000,
		trim: true,
	},
	images: {
		type: [String],
		required: [true, "Image not added"],
	},
	price: {
		type: String,
		required: [true, "Price not specified"],
		//default: "000.00",
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "UserModel",
		index: true,
		required: [true, "Owner not specified"],
	},
	ownerName: {
		type: String,
		required: [true, "Owner name not specified"],
	},
	// viewingTimes: {
	// 	type: [String],
	// 	default: [
	// 		"8:00 am",
	// 		"8:30 am",
	// 		"9:00 am",
	// 		"9:30 am",
	// 		"10:00 am",
	// 		"10:30 am",
	// 		"11:00 am",
	// 		"11:30 am",
	// 		"12:00 pm",
	// 		"12:30 pm",
	// 		"13:00 pm",
	// 		"13:30 pm",
	// 		"14:00 pm",
	// 		"14:30 pm",
	// 		"15:00 pm",
	// 		"15:30 pm",
	// 		"16:00 pm",
	// 		"16:30 pm",
	// 		"17:00 pm",
	// 	],
	// },
});

const PropertyModel = mongoose.model("PropertyModel", PropertySchema, "properties");

export default PropertyModel;
