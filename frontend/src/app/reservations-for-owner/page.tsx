"use client";

import NavBar from "@/components/navbar.component";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { ReservationsLoaded } from "@/interfaces/reservation.interface";
import { useRef } from "react";

export default function ReservationsForOwner() {
	const [reservationsLoaded, setReservationsLoaded] = useState<ReservationsLoaded[]>([]);
	const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState<boolean>(false);
	const [reservationToUpdate, setReservationToUpdate] = useState({
		_id: "",
		madeBy: { clientID: "", clientName: "" },
		date: "",
		propertyToView: { propertyID: "", propertyName: "" },
		propertyOwner: { propertyOwnerID: "", propertyOwnerName: "" },
		status: "",
		time: "",
	});

	const changeStatusDialogRef = useRef(null);
	useEffect(() => {
		if (sessionStorage.getItem("User") === null) {
			window.location.href = "/login";
		}
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		const token = `Bearer ${storedUserData.data.token}`;
		const ownerID = storedUserData.data.userWithoutPassword._id;
		console.log(token);
		const getReservations = async () => {
			try {
				const request = await axios.get(`${API_URL}user/reservation/${ownerID}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				if (request.status === 200) {
					setReservationsLoaded(request.data.message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		getReservations();
	}, []);

	const openChangeStatusDialog = () => {
		setIsChangeStatusDialogOpen(true);
		(changeStatusDialogRef.current as HTMLDialogElement | null)?.showModal();
	};

	const handleReservationStatusUpdate = async () => {
		try {
			// console.log(reservationToUpdate);
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
			const token = `Bearer ${storedUserData.data.token}`;
			const reservationData = {
				reservationID: reservationToUpdate._id,
				status: reservationToUpdate.status,
				userID: reservationToUpdate.madeBy.clientID,
				propertyOwnerID: reservationToUpdate.propertyOwner.propertyOwnerID,
			};

			const response = await axios.put(
				`${API_URL}user/reservation/update-reservation-status`,
				reservationData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				},
			);
			if (response.status === 200) {
				// window.location.reload();
				console.log(response);
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<NavBar />

			{/* rendering reservations */}
			{reservationsLoaded.length > 0 ? (
				<table className="w-full">
					<tr>
						<th>Property</th>
						<th>Reserved By</th>
						<th>Date of viewing</th>
						<th>Time of viewing</th>
						<th>Reservation Status</th>
					</tr>
					{reservationsLoaded.map((reservationLoaded) => {
						return (
							<>
								<tr key={reservationLoaded._id} className="text-center">
									<td>{reservationLoaded.propertyToView.propertyName}</td>
									<td>{reservationLoaded.madeBy.clientName}</td>
									<td>{reservationLoaded.date.split("T")[0]}</td>
									<td>{reservationLoaded.time}</td>
									<td>
										<select
											disabled={reservationLoaded.status === "Pending" ? false : true}
											onChange={(event) => {
												setReservationToUpdate({
													...reservationLoaded,
													status: event.target.value,
												});
												openChangeStatusDialog();
											}}>
											<option>
												{reservationLoaded.status === "Accepted" || "Rejected"
													? reservationLoaded.status
													: "Pending"}
											</option>
											<option>Accepted</option>
											<option>Rejected</option>
										</select>
									</td>
								</tr>
							</>
						);
					})}
				</table>
			) : (
				<h1>No Reservations to display</h1>
			)}
			{/* dialog to change status */}
			<dialog ref={changeStatusDialogRef} open={isChangeStatusDialogOpen}>
				<p>You are about to change the status of {reservationToUpdate._id}</p>
				<button>No Cancel</button>
				<button onClick={() => handleReservationStatusUpdate()}>Yes Change</button>
			</dialog>
		</>
	);
}
