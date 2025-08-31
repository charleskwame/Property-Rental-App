const errorMiddleware = (err, req, res, next) => {
	try {
		let error = { ...err };

		// Ensure error.message exists
		error.message = err.message;
		console.error("Error Middleware:", err);

		// Mongoose: Invalid ObjectId
		if (err.name === "CastError") {
			error = new Error("Resource Not Found");
			error.statusCode = 404;
		}

		// Mongoose: Duplicate key
		if (err.code && err.code === 11000) {
			error = new Error("Duplicate key: check if a unique property is being repeated");
			error.statusCode = 400;
		}

		// Mongoose: Validation error
		if (err.name === "ValidationError") {
			const message = Object.values(err.errors)
				.map((values) => values.message)
				.join(", ");
			error = new Error(message);
			error.statusCode = 400;
		}

		res.status(error.statusCode || 500).json({
			success: false,
			error: error.message || "Server Error",
		});
	} catch (error) {
		next(error); // Pass unexpected errors to the default Express handler
	}
};

export default errorMiddleware;
