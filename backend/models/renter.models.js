import mongoose from "mongoose";

const RenterSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name not provided"],
			minLength: 8,
			maxLength: 100,
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email not provided"],
			minLength: 8,
			maxLenth: 50,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password not provided"],
			minLength: 8,
			maxLenth: 50,
		},
		phonenumber: {
			type: String,
			required: [true, "Phone number not provided"],
			minLength: 10,
			maxLength: 15,
			unique: true,
		},
	},
	{ timestamps: true },
);

const RenterModel = mongoose.model("RenterModel", RenterSchema);

export default RenterModel;
