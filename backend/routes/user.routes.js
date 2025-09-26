import Router from "express";
import authenticateUser from "../middleware/authenticateusers.middleware.js";
import { verifyOTP } from "../controllers/otp.controller.js";
import {
	addPropertyToFavorites,
	addUser,
	addProperty,
	getUser,
	resendUserOTP,
	sendUserOTP,
	updateProperty,
	deleteProperty,
	getOwnedProperties,
	getOwnedPropertiesByID,
	getProperties,
	getPropertiesByID,
	removePropertyFromFavorites,
	getUserDetailsForOwner,
	getFavoritedProperties,
	updateUserDetails,
	sendReservationEmail,
} from "../controllers/user.controller.js";

const UserRouter = Router();

UserRouter.post("/sign-up", addUser);
UserRouter.post("/log-in", getUser);
UserRouter.get("/properties", getProperties);
UserRouter.get("/properties/:propertyID", getPropertiesByID);
UserRouter.get("/properties/:ownerID", authenticateUser, getOwnedProperties);
UserRouter.get("/properties/:ownerID/:propertyID", authenticateUser, getOwnedPropertiesByID);
UserRouter.post("/add-properties", authenticateUser, addProperty);
UserRouter.put("/properties/update/:propertyID", authenticateUser, updateProperty);
UserRouter.delete("/properties/:ownerID/:propertyID", authenticateUser, deleteProperty);
UserRouter.post("/send-otp", authenticateUser, sendUserOTP);
UserRouter.post("/resend-otp", authenticateUser, resendUserOTP);
UserRouter.post("/properties/add-to-favorites", authenticateUser, addPropertyToFavorites);
UserRouter.post("/properties/remove-from-favorites", authenticateUser, removePropertyFromFavorites);
UserRouter.post("/verify-otp", authenticateUser, verifyOTP);
UserRouter.get("/", getUserDetailsForOwner);
UserRouter.get("/favorites/:userID", authenticateUser, getFavoritedProperties);
UserRouter.put("/update-details/", authenticateUser, updateUserDetails);
UserRouter.post("/send-reservation-email", authenticateUser, sendReservationEmail);

// Renter specific routes

export default UserRouter;
