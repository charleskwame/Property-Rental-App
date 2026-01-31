import ReservationsModel from "../models/reservations.model.js";

/**
 * Generates all 30-minute time slots between 8:00 AM and 5:00 PM
 * @returns {string[]} Array of time slots in HH:MM format
 */
export const generateTimeSlots = () => {
	const slots = [];
	for (let hour = 8; hour < 17; hour++) {
		for (let minute = 0; minute < 60; minute += 30) {
			const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
			slots.push(time);
		}
	}
	return slots;
};

/**
 * Converts time string (HH:MM) to minutes since midnight
 * @param {string} time - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
export const timeToMinutes = (time) => {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
};

/**
 * Validates if a time slot is within operating hours (8 AM to 5 PM)
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {boolean} True if within operating hours
 */
export const isWithinOperatingHours = (startTime, endTime) => {
	const startMinutes = timeToMinutes(startTime);
	const endMinutes = timeToMinutes(endTime);

	const operatingStart = 8 * 60; // 8:00 AM in minutes
	const operatingEnd = 17 * 60; // 5:00 PM in minutes

	return startMinutes >= operatingStart && endMinutes <= operatingEnd;
};

/**
 * Checks if two time slots overlap
 * @param {string} slot1Start - First slot start time
 * @param {string} slot1End - First slot end time
 * @param {string} slot2Start - Second slot start time
 * @param {string} slot2End - Second slot end time
 * @returns {boolean} True if slots overlap
 */
export const doTimeSlotsOverlap = (slot1Start, slot1End, slot2Start, slot2End) => {
	const start1 = timeToMinutes(slot1Start);
	const end1 = timeToMinutes(slot1End);
	const start2 = timeToMinutes(slot2Start);
	const end2 = timeToMinutes(slot2End);

	return start1 < end2 && start2 < end1;
};

/**
 * Checks if a property has any conflicting bookings for the given date and time slot
 * @param {string} propertyID - The property ID to check
 * @param {Date} date - The date to check (should be normalized to start of day)
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {string} excludeReservationID - Optional: reservation ID to exclude from check (for updates)
 * @returns {Promise<boolean>} True if booking conflict exists
 */
export const checkBookingConflict = async (
	propertyID,
	date,
	startTime,
	endTime,
	excludeReservationID = null,
) => {
	try {
		// Normalize the date to start of day
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		// Query for reservations on the same day for this property
		let query = {
			"propertyToView.propertyID": propertyID,
			date: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
			status: { $in: ["Pending", "Accepted", "Pending Confirmation"] },
		};

		// Exclude the reservation being updated (if provided)
		if (excludeReservationID) {
			query._id = { $ne: excludeReservationID };
		}

		const conflictingReservations = await ReservationsModel.find(query);

		// Check if any reservation has overlapping time slots
		for (const reservation of conflictingReservations) {
			if (doTimeSlotsOverlap(startTime, endTime, reservation.startTime, reservation.endTime)) {
				return true; // Conflict found
			}
		}

		return false; // No conflict
	} catch (error) {
		console.error("Error checking booking conflict:", error);
		throw error;
	}
};

/**
 * Gets available time slots for a property on a specific date
 * @param {string} propertyID - The property ID
 * @param {Date} date - The date to check
 * @returns {Promise<string[]>} Array of available time slots
 */
export const getAvailableSlots = async (propertyID, date) => {
	try {
		const allSlots = generateTimeSlots();

		// Normalize the date to start of day
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		// Get all reservations for this property on this date
		const reservations = await ReservationsModel.find({
			"propertyToView.propertyID": propertyID,
			date: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
			status: { $in: ["Pending", "Accepted", "Pending Confirmation"] },
		});

		// Filter out booked slots
		const availableSlots = allSlots.filter((slot) => {
			const endTime = getEndTime(slot);

			for (const reservation of reservations) {
				if (doTimeSlotsOverlap(slot, endTime, reservation.startTime, reservation.endTime)) {
					return false; // Slot is booked
				}
			}
			return true; // Slot is available
		});

		return availableSlots;
	} catch (error) {
		console.error("Error getting available slots:", error);
		throw error;
	}
};

/**
 * Calculates the end time for a 30-minute slot
 * @param {string} startTime - Start time in HH:MM format
 * @returns {string} End time in HH:MM format
 */
export const getEndTime = (startTime) => {
	const minutes = timeToMinutes(startTime);
	const endMinutes = minutes + 30;
	const hours = Math.floor(endMinutes / 60);
	const mins = endMinutes % 60;
	return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};
