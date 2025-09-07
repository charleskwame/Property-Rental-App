/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import PropertyModel from "../models/property.model.js";
import RenterModel from "../models/Renter.models.js";
import bcrypt from "bcryptjs";
import {
	JWT_EXPIRES_IN,
	JWT_SECRET,
	NODEMAILER_EMAIL,
	NODEMAILER_PASSWORD,
} from "../config/env.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import RenterOTPModel from "../models/renterotp.model.js";

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
export const addRenter = async (request, response, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { name, email, password, phonenumber } = request.body;
		const existingRenter = await RenterModel.findOne({ email });
		if (existingRenter) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Renter Account Already Registered" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const renterAdded = await RenterModel.create(
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
		const token = jwt.sign({ userID: renterAdded[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
		await session.commitTransaction();
		session.endSession();

		const { password: _, ...renterWithoutPassword } = renterAdded[0].toObject();
		response.status(200).json({
			status: "Success",
			message: "Renter Added Success",
			data: { token, renterWithoutPassword },
		});
		// verifyRenterOTP(renterAdded[0]._id, renterAdded[0].email);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};

//function to log in
export const getRenter = async (request, response, next) => {
	try {
		const { email, password } = request.body;
		const foundRenter = await RenterModel.findOne({ email });
		if (!foundRenter) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Check Credentials, Renter Not Found" });
		}
		const decodedPassword = await bcrypt.compare(password, foundRenter.password);

		if (!decodedPassword) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Check Password, Renter Not Found" });
		}

		const token = jwt.sign({ userID: foundRenter._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		// 3. Exclude password before sending
		// eslint-disable-next-line no-unused-vars
		const { password: _, ...renterWithoutPassword } = foundRenter.toObject();

		if (!renterWithoutPassword.isVerified) {
			return response.json({ status: "Pending Verification", data: { token, renterWithoutPassword } });
		}

		response.status(200).json({
			status: "Success",
			//message: "User Found, Signed In",
			data: { token, renterWithoutPassword },
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

// function to verify renter otp
export const sendRenterOTP = async (request, response) => {
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

		await RenterOTPModel.create({
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
export const resendRenterOTP = async (request, response) => {
	const { userID, email } = request.body;
	//console.log(request.body);
	try {
		//return response.json(request.body);
		if (!userID || !email) {
			return response.status(400).json({ status: "Failed", message: "Empty UserID/Email" });
		}
		await RenterOTPModel.deleteMany({ userID: userID });
		await sendRenterOTP(request, response);
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
		const renterWithFavoritedProperty = await RenterModel.findByIdAndUpdate(
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
		const renterWithoutFavoritedProperty = await RenterModel.findOneAndUpdate(
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
