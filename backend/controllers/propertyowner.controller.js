/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import PropertyModel from "../models/property.model.js";
import PropertyOwnerModel from "../models/propertyowner.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
	JWT_SECRET,
	JWT_EXPIRES_IN,
	NODEMAILER_EMAIL,
	NODEMAILER_PASSWORD,
} from "../config/env.js";
import OwnerOTPModel from "../models/ownerotp.model.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	secure: false,
	auth: {
		user: NODEMAILER_EMAIL,
		pass: NODEMAILER_PASSWORD,
	},
});

//function to add owner
export const addPropertyOwner = async (request, response, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { name, email, password, phonenumber } = request.body;
		const existingOwner = await PropertyOwnerModel.findOne({ email });
		if (existingOwner) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Owner Email / Phonenumber Already Registered" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const ownerAdded = await PropertyOwnerModel.create(
			[
				{
					name,
					email,
					password: hashedPassword,
					phonenumber,
				},
			],
			{ session },
		);

		const token = jwt.sign({ userID: ownerAdded[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
		await session.commitTransaction();
		session.endSession();

		const { password: _, ...ownerWithoutPassword } = ownerAdded[0].toObject();
		response.status(200).json({
			status: "Success",
			message: "Owner Added Success",
			data: { token, ownerWithoutPassword },
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};

// function to get property owner(log-in)
export const getPropertyOwner = async (request, response, next) => {
	try {
		const { email, password } = request.body;
		const foundOwner = await PropertyOwnerModel.findOne({ email });
		if (!foundOwner) {
			return response
				.status(400)
				.json({ status: false, message: "Check Credentials, Property Owner Not Found" });
		}
		const decodedPassword = await bcrypt.compare(password, foundOwner.password);

		if (!decodedPassword) {
			return response
				.status(400)
				.json({ status: false, message: "Check credentials, wrong password" });
		}

		const token = jwt.sign({ userID: foundOwner._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		// eslint-disable-next-line no-unused-vars
		const { password: _, ...ownerWithoutPassword } = foundOwner.toObject();

		if (!ownerWithoutPassword.isVerified) {
			return response.json({ status: "Pending Verification", data: { token, ownerWithoutPassword } });
		}

		response.status(200).json({
			status: "Success",
			message: "User Found",
			data: { token, ownerWithoutPassword },
		});
	} catch (error) {
		next(error);
	}
};

//function to get all owned properties
export const getOwnedProperties = async (request, response, next) => {
	try {
		const ownerID = request.params.ownerID;
		const ownedProperties = await PropertyModel.find({ owner: ownerID });
		if (!ownedProperties || ownedProperties.length === 0) {
			return response.status(400).json({
				success: "Failed",
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
		const specificPropertyOwned = await PropertyModel.find({ owner: ownerID, _id: propertyID });
		if (!specificPropertyOwned || specificPropertyOwned.length === 0) {
			return response.status(400).json({
				success: "Failed",
				message: `No properties with id of ${propertyID} added by ${ownerID}`,
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
		const { name, location, type, description, images, owner } = request.body;
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
		const { name, location, type, description } = request.body;
		const existingProperty = await PropertyModel.findByIdAndUpdate(
			propertyID,
			{
				name,
				location,
				type,
				description,
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
export const sendOwnerOTP = async (request, response) => {
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

		await OwnerOTPModel.create({
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
export const resendOwnerOTP = async (request, response) => {
	const { userID, email } = request.body;
	//console.log(request.body);
	try {
		//return response.json(request.body);
		if (!userID || !email) {
			return response.status(400).json({ status: "Failed", message: "Empty UserID/Email" });
		}
		await OwnerOTPModel.deleteMany({ userID: userID });
		await sendOwnerOTP(request, response);
	} catch (error) {
		return response.status(404).json({ status: "Failed", message: error.message });
	}
};
