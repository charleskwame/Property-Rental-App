/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import PropertyModel from "../models/property.model.js";

import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.model.js";
import OTPModel from "../models/otp.model.js";
import ReservationsModel from "../models/reservations.model.js";
import { checkBookingConflict, getEndTime } from "../lib/bookingValidation.js";

//function to add renter(sign up)
export const addUser = async (request, response, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { name, email, password, usertype } = request.body;
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
			return response
				.status(400)
				.json({ status: "Pending Verification", data: { token, userWithoutPassword } });
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
		const properties = await PropertyModel.find().limit(30);
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
		const { name, location, type, description, images, price, owner, ownerName } = request.body;
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
					ownerName,
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
		const { name, type, description, price } = request.body;
		// const { name, location, type, description, price } = request.body;
		// const { name, location, type, description, images, price } = request.body;
		const existingProperty = await PropertyModel.findByIdAndUpdate(
			propertyID,
			{
				name,
				//location,
				type,
				description,
				// images,
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
	const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

	const userToVerify = await UserModel.findOne({ email: email });

	try {
		const salt = await bcrypt.genSalt(10);

		const hashedOTP = await bcrypt.hash(otp, salt);

		await OTPModel.create({
			userID: userID,
			otp: hashedOTP,
			createdAt: Date.now(),
			expiresIn: Date.now() + 3600000,
		});

		// await transporter.sendMail(mailOptions);

		return response.status(200).json({
			status: "Pending",
			message: "OTP SENT",
			data: {
				userID: userID,
				email: email,
				otp: otp,
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
		const userWithFavoritedProperty = await UserModel.findByIdAndUpdate(
			userID,
			{
				$addToSet: { likedproperties: [propertyID] },
			},
			{ new: true },
		);

		const { password: _, ...userWithoutPassword } = userWithFavoritedProperty.toObject();
		const token = jwt.sign({ userID: userWithoutPassword._id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});
		response.status(200).json({ status: "Success", data: { token, userWithoutPassword } });
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
		const userWithoutFavoritedProperty = await UserModel.findOneAndUpdate(
			{ _id: userID },
			{ $pull: { likedproperties: propertyID } },
			{ new: true },
		);

		const { password: _, ...userWithoutPassword } = userWithoutFavoritedProperty.toObject();
		const token = jwt.sign({ userID: userWithoutPassword._id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});
		response.status(200).json({ status: "Success", data: { token, userWithoutPassword } });
	} catch (error) {
		return response.status(404).json({ status: "Failed", message: error.message });
	}
};

// function to get owner email, name and phone number
export const getUserDetailsForOwner = async (request, response, next) => {
	try {
		const userID = request.params.userID;
		const foundUser = await UserModel.findOne({ userID });
		if (!foundUser) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Check Credentials, User Not Found" });
		}

		// 3. Exclude password before sending
		// eslint-disable-next-line no-unused-vars
		const { password: _, ...userWithoutPassword } = foundUser.toObject();

		response.status(200).json({
			status: "Success",
			data: { userWithoutPassword },
		});
	} catch (error) {
		next(error);
	}
};

//function to get favorited properties
export const getFavoritedProperties = async (request, response, next) => {
	try {
		const userID = request.params.userID;
		const foundUser = await UserModel.findOne({ _id: userID });
		if (!foundUser) {
			return response.status(400).json({
				status: "Failed",
				message: "Check Credentials, User Not Found",
			});
		}
		const favoritedProperties = await PropertyModel.find({
			_id: { $in: foundUser.likedproperties },
		});
		response.status(200).json({ status: "Success", message: favoritedProperties });
	} catch (error) {
		next(error);
	}
};

//update user details
export const updateUserDetails = async (request, response, next) => {
	try {
		// const userID = request.params.userID;
		const { userID, name, email, password } = request.body;
		const existingUser = await UserModel.findOne({ _id: userID });
		if (!existingUser) {
			return response.status(400).json({
				status: "Failed",
				message: "No user with these details has been found. Update not done",
			});
		}

		if (!name || !email) {
			return response.status(400).json({ status: "Failed", message: "Empty Fields, Cannot Update" });
		}

		const updateData = {
			name,
			email,
			isVerified: false,
		};

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			updateData.password = hashedPassword;
		}

		const updatedUser = await UserModel.findByIdAndUpdate(userID, updateData, {
			new: true,
			runValidators: true,
		});

		const token = jwt.sign({ userID: existingUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
		//const { password: _, ...userWithoutPassword } = existingUser.toObject();
		const { password: _, ...userWithoutPassword } = updatedUser.toObject();
		response.status(200).json({
			status: "Pending Verification",
			data: { token, userWithoutPassword },
		});
	} catch (error) {
		next(error);
	}
};

export const sendReservationEmail = async (request, response) => {
	const { date, time, propertyID, userID } = request.body;

	try {
		// Validate inputs
		if (!date || !time || !propertyID || !userID) {
			return response.status(400).json({
				status: "Failed",
				message: "Missing required fields: date, time, propertyID, userID",
			});
		}

		const property = await PropertyModel.findOne({ _id: propertyID });
		const user = await UserModel.findOne({ _id: userID });
		const propertyOwner = await UserModel.findOne({ _id: property.owner });

		if (!property || !user || !propertyOwner) {
			return response.status(400).json({
				status: "Failed",
				message: "Property, user, or owner not found",
			});
		}

		// Prevent owners from booking their own properties
		if (property.owner.toString() === userID.toString()) {
			return response.status(403).json({
				status: "Failed",
				message: "Property owners cannot book their own properties",
			});
		}

		// Parse the date and normalize it to start of day
		const reservationDate = new Date(date);
		reservationDate.setHours(0, 0, 0, 0);

		// Calculate end time (30-minute slots)
		const endTime = getEndTime(time);

		// Check for booking conflicts
		const hasConflict = await checkBookingConflict(propertyID, reservationDate, time, endTime);

		if (hasConflict) {
			return response.status(409).json({
				status: "Failed",
				message: "This time slot is already booked. Please select a different time.",
			});
		}

		const mailList = [user.email, propertyOwner.email];

		const reservation = await ReservationsModel.create({
			madeBy: { clientID: user._id, clientName: user.name },
			propertyToView: { propertyID: property._id, propertyName: property.name },
			propertyOwner: { propertyOwnerID: propertyOwner._id, propertyOwnerName: propertyOwner.name },
			date: reservationDate,
			time: time,
			startTime: time,
			endTime: endTime,
			status: "Pending",
		});

		if (!reservation) {
			return response.status(400).json({
				status: "Failed",
				message: "Reservation not created",
			});
		}

		return response.status(200).json({
			status: "Success",
			message: "Reservation created",
			data: { reservation, clientEmail: mailList[0], ownerEmail: mailList[1] },
		});
	} catch (error) {
		console.error("Email sending failed:", error);
		return response.status(500).json({
			status: "Error",
			message: "Email failed to send",
			error: error.message,
		});
	}
};

export const filterProperties = async (request, response, next) => {
	try {
		const { type, location } = request.query;
		let filter = {};

		// Build dynamic filter based on query
		if (type) filter.type = type;
		if (location) filter.location = location;

		// No filters provided
		if (Object.keys(filter).length === 0) {
			const results = await PropertyModel.find();
			return response.status(200).json({
				status: "Success",
				message: `No filters applied. \n Please provide 'type' or 'location' to filter by.`,
				data: results,
			});
		}

		// Fetch properties with filters
		const results = await PropertyModel.find(filter);

		if (results.length === 0) {
			return response.status(404).json({
				status: "Failed",
				message: `No properties found for the provided filters.`,
				data: [],
			});
		}

		// Success
		response.status(200).json({
			status: "Success",
			message: `Found ${results.length} properties${type ? ` of type '${type}'` : ""}${
				location ? ` in '${location}'` : ""
			}.`,
			data: results,
		});
	} catch (error) {
		next(error);
	}
};

export const getReservationsForOwner = async (request, response, next) => {
	try {
		const ownerID = request.params.ownerID;
		const reservations = await ReservationsModel.find({
			"propertyOwner.propertyOwnerID": ownerID,
		});

		if (!reservations) {
			return response.status(400).json({
				status: "Failed",
				message: "No reservations found",
			});
		}
		response.status(200).json({ status: "Success", message: reservations });
	} catch (error) {
		next(error);
	}
};

export const updateReservationStatus = async (request, response, next) => {
	try {
		const { reservationID, status } = request.body;
		const existingReservation = await ReservationsModel.findByIdAndUpdate(
			reservationID,
			{ status },
			{
				new: true,
				runValidators: true,
			},
		);
		const user = await UserModel.findOne(existingReservation.madeBy.clientID);
		const propertyOwner = await UserModel.findOne(existingReservation.propertyOwner.propertyOwnerID);

		const mailList = [user.email, propertyOwner.email];

		return response.json({
			message: "All done, Updates Done",
			data: { existingReservation, clientEmail: mailList[0], ownerEmail: mailList[1] },
		});
	} catch (error) {
		next(error);
	}
};

export const getAvailableTimeSlots = async (request, response, next) => {
	try {
		const { propertyID, date } = request.query;

		if (!propertyID || !date) {
			return response.status(400).json({
				status: "Failed",
				message: "propertyID and date query parameters are required",
			});
		}

		// Import the function dynamically to avoid circular imports
		const { getAvailableSlots } = await import("../lib/bookingValidation.js");

		// Parse and validate the date
		const selectedDate = new Date(date);
		if (isNaN(selectedDate.getTime())) {
			return response.status(400).json({
				status: "Failed",
				message: "Invalid date format",
			});
		}

		// Get available slots
		const availableSlots = await getAvailableSlots(propertyID, selectedDate);

		return response.status(200).json({
			status: "Success",
			message: "Available time slots retrieved",
			data: availableSlots,
		});
	} catch (error) {
		console.error("Error getting available slots:", error);
		return response.status(500).json({
			status: "Error",
			message: "Failed to retrieve available slots",
			error: error.message,
		});
	}
};

export const deleteReservation = async (request, response, next) => {
	try {
		const { reservationID } = request.params;

		if (!reservationID) {
			return response.status(400).json({
				status: "Failed",
				message: "Reservation ID is required",
			});
		}

		const reservationToDelete = await ReservationsModel.findById(reservationID);

		if (!reservationToDelete) {
			return response.status(404).json({
				status: "Failed",
				message: "Reservation not found",
			});
		}

		// Get user and owner details for emails
		const user = await UserModel.findById(reservationToDelete.madeBy.clientID);
		const propertyOwner = await UserModel.findById(reservationToDelete.propertyOwner.propertyOwnerID);

		if (!user || !propertyOwner) {
			return response.status(404).json({
				status: "Failed",
				message: "User or property owner not found",
			});
		}

		// Delete the reservation
		await ReservationsModel.findByIdAndDelete(reservationID);

		return response.status(200).json({
			status: "Success",
			message: "Reservation deleted successfully",
			data: {
				reservation: reservationToDelete,
				clientEmail: user.email,
				ownerEmail: propertyOwner.email,
				clientName: user.name,
				ownerName: propertyOwner.name,
				propertyName: reservationToDelete.propertyToView.propertyName,
				date: reservationToDelete.date,
				time: reservationToDelete.time,
			},
		});
	} catch (error) {
		console.error("Error deleting reservation:", error);
		return response.status(500).json({
			status: "Error",
			message: "Failed to delete reservation",
			error: error.message,
		});
	}
};

//export default getProperties;
