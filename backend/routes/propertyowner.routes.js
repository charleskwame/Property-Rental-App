import Router from "express";
import {
	addProperty,
	addPropertyOwner,
	deleteProperty,
	getOwnedProperties,
	getOwnedPropertiesByID,
	getPropertyOwner,
	resendOwnerOTP,
	sendOwnerOTP,
	updateProperty,
} from "../controllers/propertyowner.controller.js";
import authenticatePropertyOwner from "../middleware/authenticatepropertyowners.middleware.js";
import { verifyOwnerOTP } from "../controllers/otp.controller.js";

const PropertyOwnerRouter = Router();

PropertyOwnerRouter.post("/sign-up", addPropertyOwner);

PropertyOwnerRouter.post("/send-owner-otp", authenticatePropertyOwner, sendOwnerOTP);

PropertyOwnerRouter.post("/resend-owner-otp", authenticatePropertyOwner, resendOwnerOTP);

PropertyOwnerRouter.post("/verify-owner-otp", authenticatePropertyOwner, verifyOwnerOTP);

PropertyOwnerRouter.post("/log-in", getPropertyOwner);

PropertyOwnerRouter.post("/add-properties", authenticatePropertyOwner, addProperty);

PropertyOwnerRouter.put(
	"/properties/:ownerID/:propertyID",
	authenticatePropertyOwner,
	updateProperty,
);

PropertyOwnerRouter.get("/properties/:ownerID", authenticatePropertyOwner, getOwnedProperties);

PropertyOwnerRouter.get(
	"/properties/:ownerID/:propertyID",
	authenticatePropertyOwner,
	getOwnedPropertiesByID,
);

PropertyOwnerRouter.delete(
	"/properties/:ownerID/:propertyID",
	authenticatePropertyOwner,
	deleteProperty,
);

export default PropertyOwnerRouter;
