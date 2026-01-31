import mongoose from "mongoose";

const ReservationSchema = mongoose.Schema({
	madeBy: {
		type: { clientID: mongoose.Schema.Types.ObjectId, clientName: String },
		ref: "UserModel",
		index: true,
		required: true,
	},

	propertyToView: {
		type: { propertyID: mongoose.Schema.Types.ObjectId, propertyName: String },
		ref: "PropertyModel",
		index: true,
		required: true,
	},
	propertyOwner: {
		type: { propertyOwnerID: mongoose.Schema.Types.ObjectId, propertyOwnerName: String },
		ref: "UserModel",
		index: true,
		required: true,
	},
	date: {
		type: Date,
		required: true,
		index: true,
	},
	time: {
		type: String,
		required: true,
	},
	startTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enums: ["Accepted", "Rejected", "Pending Confirmation"],
		default: "Pending",
	},
});

// Compound index to prevent double bookings
ReservationSchema.index({
	"propertyToView.propertyID": 1,
	date: 1,
	startTime: 1,
	endTime: 1,
});

const ReservationsModel = mongoose.model("ReservationsModel", ReservationSchema, "reservations");

export default ReservationsModel;
