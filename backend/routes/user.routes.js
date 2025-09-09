import Router from "express";
import authenticateUser from "../middleware/authenticatepropertyowners.middleware.js";
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
} from "../controllers/user.controller.js";

const UserRouter = Router();

UserRouter.post("/sign-up", addUser);
UserRouter.post("/log-in", getUser);
UserRouter.get("/properties", getProperties);
UserRouter.get("/properties/:propertyID", getPropertiesByID);
UserRouter.get("/properties/:ownerID", authenticateUser, getOwnedProperties);
UserRouter.get("/properties/:ownerID/:propertyID", authenticateUser, getOwnedPropertiesByID);
UserRouter.post("/add-properties", authenticateUser, addProperty);
UserRouter.put("/properties/:ownerID/:propertyID", authenticateUser, updateProperty);
UserRouter.delete("/properties/:ownerID/:propertyID", authenticateUser, deleteProperty);
UserRouter.post("/send-otp", authenticateUser, sendUserOTP);
UserRouter.post("/resend-otp", authenticateUser, resendUserOTP);
UserRouter.post("/properties/add-to-favorites", authenticateUser, addPropertyToFavorites);
UserRouter.post("/properties/remove-from-favorites", authenticateUser, removePropertyFromFavorites);
UserRouter.post("/verify-otp", authenticateUser, verifyOTP);

// Renter specific routes

export default UserRouter;
