// import mongoose from "mongoose";

import { MONGODB_URI } from "../config/env";

// import { MONGODB_URI, NODE_ENV } from "../config/env.js";

// if (!MONGODB_URI) {
// 	throw new Error("Database URI not found in config file");
// }

// const connectToDatabase = async () => {
// 	try {
// 		await mongoose.connect(MONGODB_URI);
// 		console.log(`Database connected successfully in ${NODE_ENV}`);
// 	} catch (error) {
// 		console.log(error);
// 		process.exit(1);
// 	}
// };

// export default connectToDatabase;

const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
// 	"mongodb+srv://charlestettehnull:<db_password>@property-rental-cluster.77iyc2l.mongodb.net/?retryWrites=true&w=majority&appName=property-rental-cluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGODB_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function connectToDatabase() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
connectToDatabase().catch(console.dir);

export default connectToDatabase;
