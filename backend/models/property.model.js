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
		maxLength: 200,
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
	},
});

const PropertyModel = mongoose.model("PropertyModel", PropertySchema, "properties");

export default PropertyModel;
