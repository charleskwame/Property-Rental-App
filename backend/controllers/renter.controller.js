import mongoose from "mongoose";
import PropertyModel from "../models/property.model.js";
import RenterModel from "../models/Renter.models.js";

//function to add renter(sign up)
export const addRenter = async (request, response, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { name, email, password, phonenumber } = request.body;
		const existingRenter = await RenterModel.findOne({ name, email });
		if (existingRenter) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Renter Account Already Registered" });
		}

		const renterAdded = await RenterModel.create(
			[
				{
					name,
					email,
					password,
					phonenumber,
				},
			],
			{ session },
		);
		await session.commitTransaction();
		session.endSession();
		response
			.status(200)
			.json({ status: "Success", message: "Renter Added Success", data: renterAdded });
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
		const foundUser = await RenterModel.findOne({ email, password }).select("-password");
		if (!foundUser) {
			return response
				.status(400)
				.json({ status: false, message: "Check Credentials, Renter Not Found" });
		}
		response.status(200).json({
			status: true,
			message: "User Found",
			data: foundUser,
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
