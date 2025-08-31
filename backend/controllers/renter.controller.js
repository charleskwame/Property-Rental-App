import mongoose from "mongoose";
import PropertyModel from "../models/property.model.js";
import RenterModel from "../models/Renter.models.js";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

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
		response.status(200).json({
			status: "Success",
			message: "Renter Added Success",
			data: { token, renterCreated: renterAdded[0] },
		});
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
				.json({ status: false, message: "Check Credentials, Renter Not Found" });
		}
		const decodedPassword = await bcrypt.compare(password, foundRenter.password);

		if (!decodedPassword) {
			return response.status(400).json({ status: false, message: "Check Password, Renter Not Found" });
		}

		const token = jwt.sign({ userID: foundRenter._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		// 3. Exclude password before sending
		// eslint-disable-next-line no-unused-vars
		const { password: _, ...renterWithoutPassword } = foundRenter.toObject();

		response.status(200).json({
			status: true,
			message: "User Found, Signed In",
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
		const { propertyID } = request.body;
		const property = await PropertyModel.findOne({ _id: propertyID });
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
//function to add property to favoriates

//function to remove property from favorites

//export default getProperties;
