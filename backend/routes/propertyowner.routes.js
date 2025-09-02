import Router from "express";
import {
	addProperty,
	addPropertyOwner,
	deleteProperty,
	getOwnedProperties,
	getOwnedPropertiesByID,
	getPropertyOwner,
	updateProperty,
} from "../controllers/propertyowner.controller.js";
import authenticatePropertyOwner from "../middleware/authenticatepropertyowners.middleware.js";

const PropertyOwnerRouter = Router();

PropertyOwnerRouter.post("/sign-up", addPropertyOwner);

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
