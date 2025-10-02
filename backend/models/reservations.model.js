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
	},
	time: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enums: "Accepted" | "Rejected" | "Pending",
		default: "Pending",
	},
});

const ReservationsModel = mongoose.model("ReservationsModel", ReservationSchema, "reservations");

export default ReservationsModel;
