import mongoose from "mongoose";

const User = new mongoose.Schema(
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
		usertype: {
			type: String,
			required: [true, "User Type Not Set"],
			enum: ["renter", "owner"],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		likedproperties: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "PropertyModel",
				index: true,
			},
		],
		propertiesowned: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "PropertyModel",
				index: true,
			},
		],
	},
	{ timestamps: true },
);

const UserModel = mongoose.model("UserModel", User, "users");

export default UserModel;
