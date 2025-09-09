/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import PropertyModel from "../models/property.model.js";
//import RenterModel from "../models/Renter.models.js";
import bcrypt from "bcryptjs";
import {
	JWT_EXPIRES_IN,
	JWT_SECRET,
	NODEMAILER_EMAIL,
	NODEMAILER_PASSWORD,
} from "../config/env.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
//import RenterOTPModel from "../models/otp.model.js";
import UserModel from "../models/user.model.js";
import OTPModel from "../models/otp.model.js";

//creating nodemailer transport
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	secure: false,
	auth: {
		user: NODEMAILER_EMAIL,
		pass: NODEMAILER_PASSWORD,
	},
});

//function to add renter(sign up)
export const addUser = async (request, response, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { name, email, password, phonenumber, usertype } = request.body;
		const existingUser = await UserModel.findOne({ email });
		if (existingUser) {
			return response.status(400).json({ status: "Failed", message: "Account Already Registered" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const userAdded = await UserModel.create(
			[
				{
					name,
					email,
					password: hashedPassword,
					phonenumber,
					usertype,
				},
			],
			{ session },
		);
		const token = jwt.sign({ userID: userAdded[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
		await session.commitTransaction();
		session.endSession();

		const { password: _, ...userWithoutPassword } = userAdded[0].toObject();
		response.status(200).json({
			status: "Success",
			message: "Account Added Success",
			data: { token, userWithoutPassword },
		});
		// verifyRenterOTP(renterAdded[0]._id, renterAdded[0].email);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};

//function to log in
export const getUser = async (request, response, next) => {
	try {
		const { email, password } = request.body;
		const foundUser = await UserModel.findOne({ email });
		if (!foundUser) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Check Credentials, User Not Found" });
		}
		const decodedPassword = await bcrypt.compare(password, foundUser.password);

		if (!decodedPassword) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Check Password, User Not Found" });
		}

		const token = jwt.sign({ userID: foundUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		// 3. Exclude password before sending
		// eslint-disable-next-line no-unused-vars
		const { password: _, ...userWithoutPassword } = foundUser.toObject();

		if (!userWithoutPassword.isVerified) {
			return response.json({ status: "Pending Verification", data: { token, userWithoutPassword } });
		}

		response.status(200).json({
			status: "Success",
			//message: "User Found, Signed In",
			data: { token, userWithoutPassword },
		});
	} catch (error) {
		next(error);
	}
};

// function to get all properties
export const getProperties = async (request, response, next) => {
	// connecting to database
	try {
		const properties = await PropertyModel.find();
		if (properties.length <= 0) {
			return response.status(400).json({
				status: "Failed",
				message: "No Property Found",
			});
		}
		response.status(200).json({ status: "Success", message: properties });
	} catch (error) {
		response.status(404).json({
			status: "Failed",
			message: "Cannot Connect To The Database",
		});
		next(error);
	}
};

// function to get one particular property
export const getPropertiesByID = async (request, response, next) => {
	// connecting to database
	try {
		const _id = request.params.propertyID;
		//return response.json({ _id: `The id is ${_id}` });
		const property = await PropertyModel.findOne({ _id });
		if (!property) {
			return response.status(400).json({
				status: "Failed",
				message: "No Property Found",
			});
		}
		response.status(200).json({ status: "Success", message: property });
	} catch (error) {
		response.status(404).json({
			status: "Failed",
			message: "Cannot Connect To The Database",
		});
		next(error);
	}
};

//function to get all owned properties
export const getOwnedProperties = async (request, response, next) => {
	try {
		const ownerID = request.params.ownerID;
		//return response.json({ ownerID });
		const ownedProperties = await PropertyModel.find({ owner: ownerID });
		if (!ownedProperties || ownedProperties.length === 0) {
			return response.status(400).json({
				status: "Failed",
				message: `No properties added by ${ownerID}`,
			});
		}
		response.status(200).json({ status: "Success", message: ownedProperties });
	} catch (error) {
		response
			.status(404)
			.json({ status: "Failed", message: "Cannot Connect To Database", error: error });
		next(error);
	}
};

//function to get a single property
export const getOwnedPropertiesByID = async (request, response, next) => {
	try {
		const ownerID = request.params.ownerID;
		const propertyID = request.params.propertyID;
		const specificPropertyOwned = await PropertyModel.findOne({ owner: ownerID, _id: propertyID });
		if (!specificPropertyOwned || specificPropertyOwned.length === 0) {
			return response.status(400).json({
				status: "Failed",
				message: specificPropertyOwned,
			});
		}
		response.status(200).json({ status: "Success", message: specificPropertyOwned });
	} catch (error) {
		response
			.status(404)
			.json({ status: "Failed", message: "Cannot Connect To Database", error: error });
		next(error);
	}
};

//function to add property
export const addProperty = async (request, response, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { name, location, type, description, images, price, owner } = request.body;
		const existingProperty = await PropertyModel.findOne({ name, location, type });
		if (existingProperty) {
			return response.status(400).json({ status: "Failed", message: "Property Already Registered" });
		}

		const propertyAdded = await PropertyModel.create(
			[
				{
					name,
					location,
					type,
					description,
					images,
					price,
					owner,
				},
			],
			{ session },
		);
		await session.commitTransaction();
		session.endSession();
		response
			.status(200)
			.json({ status: "Success", message: "Property Added Success", data: propertyAdded });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};

//function to update property
export const updateProperty = async (request, response, next) => {
	try {
		const propertyID = request.params.propertyID;
		const { name, location, type, description, images, price } = request.body;
		const existingProperty = await PropertyModel.findByIdAndUpdate(
			propertyID,
			{
				name,
				location,
				type,
				description,
				images,
				price,
			},
			{ new: true, runValidators: true },
		);
		if (!existingProperty) {
			return response.status(400).json({
				status: "Failed",
				message: "No property with these details has been found. Update not done",
			});
		}
		response.status(200).json({
			status: "Success",
			message: `Property with id ${propertyID} has been updated`,
			data: existingProperty,
		});
	} catch (error) {
		next(error);
	}
};

//function to delete property
export const deleteProperty = async (request, response, next) => {
	try {
		const propertyID = request.params.propertyID;
		const existingProperty = await PropertyModel.deleteOne({ _id: propertyID });
		if (!existingProperty) {
			return response.status(400).json({
				status: "Failed",
				message: "Cannot Delete Property",
			});
		}
		response.status(200).json({
			status: "Success",
			message: `Property with id ${propertyID} has been deleted`,
		});
	} catch (error) {
		next(error);
	}
};

// function to verify renter otp
export const sendUserOTP = async (request, response) => {
	const { userID, email } = request.body;
	const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

	const mailOptions = {
		from: NODEMAILER_EMAIL,
		to: email,
		subject: "Your OTP",
		html: `<b>${otp}</b>`,
	};

	//console.log(email);

	try {
		const salt = await bcrypt.genSalt(10);

		const hashedOTP = await bcrypt.hash(otp, salt);

		await OTPModel.create({
			userID: userID,
			otp: hashedOTP,
			createdAt: Date.now(),
			expiresIn: Date.now() + 3600000,
		});

		await transporter.sendMail(mailOptions);

		return response.status(200).json({
			status: "Pending",
			message: "OTP SENT",
			data: {
				userID: userID,
				email: email,
			},
		});
	} catch (error) {
		throw new Error(error);
	}
};

//function to resend renter otp
export const resendUserOTP = async (request, response) => {
	const { userID, email } = request.body;
	//console.log(request.body);
	try {
		//return response.json(request.body);
		if (!userID || !email) {
			return response.status(400).json({ status: "Failed", message: "Empty UserID/Email" });
		}
		await OTPModel.deleteMany({ userID: userID });
		await sendUserOTP(request, response);
	} catch (error) {
		return response.status(404).json({ status: "Failed", message: error.message });
	}
};

//function to add property to favoriates
export const addPropertyToFavorites = async (request, response) => {
	const { userID, propertyID } = request.body;
	try {
		if (!userID || !propertyID) {
			return response.status(400).json({ status: "Failed", message: "Empty Property ID/User ID" });
		}
		const renterWithFavoritedProperty = await UserModel.findByIdAndUpdate(
			userID,
			{
				$addToSet: { likedproperties: [propertyID] },
			},
			{ new: true },
		);

		const { password: _, ...renterWithoutPassword } = renterWithFavoritedProperty.toObject();
		const token = jwt.sign({ userID: renterWithoutPassword._id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});
		response.status(200).json({ status: "Success", data: { token, renterWithoutPassword } });
	} catch (error) {
		return response.status(404).json({ status: "Failed", message: error.message });
	}
};

//function to remove property from favorites
export const removePropertyFromFavorites = async (request, response) => {
	const { userID, propertyID } = request.body;
	try {
		if (!userID || !propertyID) {
			return response.status(400).json({ status: "Failed", message: "Empty Property ID/User ID" });
		}
		const renterWithoutFavoritedProperty = await UserModel.findOneAndUpdate(
			{ _id: userID },
			{ $pull: { likedproperties: propertyID } },
			{ new: true },
		);

		const { password: _, ...renterWithoutPassword } = renterWithoutFavoritedProperty.toObject();
		const token = jwt.sign({ userID: renterWithoutPassword._id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});
		response.status(200).json({ status: "Success", data: { token, renterWithoutPassword } });
	} catch (error) {
		return response.status(404).json({ status: "Failed", message: error.message });
	}
};

//export default getProperties;
