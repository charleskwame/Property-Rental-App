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

const PropertyOwnerRouter = Router();

PropertyOwnerRouter.post("/sign-up", addPropertyOwner);

PropertyOwnerRouter.post("/log-in", getPropertyOwner);

PropertyOwnerRouter.post("/add-properties", addProperty);

PropertyOwnerRouter.put("/properties/:ownerID/:propertyID", updateProperty);

PropertyOwnerRouter.get("/properties/:ownerID", getOwnedProperties);

PropertyOwnerRouter.get("/properties/:ownerID/:propertyID", getOwnedPropertiesByID);

PropertyOwnerRouter.delete("/properties/:ownerID/:propertyID", deleteProperty);

export default PropertyOwnerRouter;
