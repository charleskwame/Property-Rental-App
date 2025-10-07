"use client";

import NavBar from "@/components/navbar.component";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { ReservationsLoaded } from "@/interfaces/reservation.interface";
import { useRef } from "react";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/loadingspinner.component";

export const runtime = "edge";

export default function ReservationsForOwner() {
	const [reservationsLoaded, setReservationsLoaded] = useState<ReservationsLoaded[]>([]);
	const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState<boolean>(false);
	const [processingUpdate, setProcessingUpdate] = useState<boolean>(false);
	const [loadingReservations, setLoadingReservations] = useState<boolean>(false);
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
				setLoadingReservations(true);
				const request = await axios.get(`${API_URL}user/reservation/${ownerID}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				if (request.status === 200) {
					setReservationsLoaded(request.data.message);
					setLoadingReservations(false);
				}
			} catch (error) {
				console.log(error);
				setLoadingReservations(false);
			}
		};

		getReservations();
	}, []);

	const openChangeStatusDialog = () => {
		setIsChangeStatusDialogOpen(true);
		(changeStatusDialogRef.current as HTMLDialogElement | null)?.showModal();
	};
	const closeChangeStatusDialog = () => {
		setIsChangeStatusDialogOpen(true);
		(changeStatusDialogRef.current as HTMLDialogElement | null)?.close();
		// location.reload();
	};

	const handleReservationStatusUpdate = async () => {
		try {
			setProcessingUpdate(true);
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
				// console.log(response);
				toast.success("Reservation Updated Sucessfully");
				location.reload();
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
			location.reload();
		}
	};
	return (
		<>
			<NavBar />

			<main className="px-2 mt-10">
				{/* rendering reservations */}
				{loadingReservations ? (
					<LoadingSpinner message="Loading Reservations" />
				) : reservationsLoaded.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-1">
						{reservationsLoaded.map((reservationLoaded, index) => {
							return (
								<div
									key={reservationLoaded._id}
									className="text-center text-sm border border-t-0 rounded-b-sm">
									<p className="bg-fuchsia-800 w-fit absolute z-10 p-2 py-1 font-semibold text-white rounded-br-lg ">
										{index + 1}
									</p>
									<p className="py-1 font-semibold bg-fuchsia-800/10 text-fuchsia-800">
										{reservationLoaded.propertyToView.propertyName}
									</p>
									<div className="flex items-center justify-between px-2 text-xs font-semibold">
										<p className="py-1 flex items-center gap-1">
											<CalendarDaysIcon className="size-4" /> {reservationLoaded.date.split("T")[0]}
										</p>
										<p className="py-1 flex items-center gap-1">
											<ClockIcon className="size-4" /> {reservationLoaded.time}
										</p>
									</div>
									<p className="p-1 font-semibold text-xs">
										Reserved by : {reservationLoaded.madeBy.clientName}
									</p>

									<div className="mb-0.5">
										{reservationLoaded.status === "Accepted" || reservationLoaded.status === "Rejected" ? (
											<p
												className={
													reservationLoaded.status === "Accepted"
														? "bg-green-300 mx-0.5 rounded-b-sm p-[1px]"
														: "bg-red-300 mx-0.5 rounded-b-sm p-[1px]"
												}>
												Reservation {reservationLoaded.status}
											</p>
										) : (
											<select
												className="font-semibold border border-fuchsia-800/20 w-[98%] p-0.5 cursor-pointer rounded-sm text-center text-fuchsia-800 text-xs"
												// disabled={reservationLoaded.status === "Pending" ? false : true}
												onChange={(event) => {
													setReservationToUpdate({
														...reservationLoaded,
														status: event.target.value,
													});
													openChangeStatusDialog();
												}}>
												<option>Pending</option>
												<option>Accepted</option>
												<option>Rejected</option>
											</select>
										)}
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<h1 className="text-center text-xl font-semibold text-fuchsia-800 mt-10">
						No Reservations to display
					</h1>
				)}
				{/* dialog to change status */}
				<dialog
					ref={changeStatusDialogRef}
					open={isChangeStatusDialogOpen}
					className="lg:max-w-1/2 mx-auto rounded-2xl backdrop:bg-fuchsia-800/15 animate-fade w-[90%] border border-fuchsia-800/10 p-4">
					<label
						htmlFor=""
						className="text-fuchsia-800 text-sm text-center font-semibold flex items-center justify-center gap-2 mb-1">
						<Edit2 className="size-4" />
						Update Reservation Status
					</label>
					<div className="grid gap-2 mb-1">
						{reservationToUpdate.status === "Accepted" ? (
							<p className="text-sm text-center">
								You are about to{" "}
								<span className="bg-green-600 text-white font-semibold px-2 rounded-sm">Accept</span> the
								reservation to view &quot;{reservationToUpdate.propertyToView.propertyName}&quot; made by{" "}
								{reservationToUpdate.madeBy.clientName} on {reservationToUpdate.date.split("T")[0]} at{" "}
								{reservationToUpdate.time}
							</p>
						) : (
							<p className="text-sm text-center">
								You are about to{" "}
								<span className="bg-red-600 text-white font-semibold px-2 rounded-sm">Reject</span> the
								reservation to view &quot;{reservationToUpdate.propertyToView.propertyName}&quot; made by{" "}
								{reservationToUpdate.madeBy.clientName} on {reservationToUpdate.date.split("T")[0]} at{" "}
								{reservationToUpdate.time}
							</p>
						)}
						{/* <button>No Cancel</button>
						<button onClick={() => handleReservationStatusUpdate()}>Yes Change</button> */}
						<div className="flex items-center justify-center gap-2">
							<button
								type="button"
								disabled={processingUpdate}
								onClick={() => closeChangeStatusDialog()}
								className={`disabled:bg-fuchsia-800/10 disabled:cursor-auto disabled:hover:text-fuchsia-800 border-2 bg-fuchsia-800/20 px-5 py-1 text-fuchsia-800 hover:bg-fuchsia-800 hover:text-white rounded-md transition-all ease-in-out duration-300 flex items-center gap-2 border-fuchsia-800 cursor-pointer text-sm font-semibold`}>
								Cancel
								<XCircleIcon className="size-6" />
							</button>
							<button
								onClick={() => handleReservationStatusUpdate()}
								disabled={processingUpdate}
								className={`disabled:bg-red-400/10 disabled:cursor-auto disabled:hover:text-red-500  border-2 bg-red-500/20 px-5 py-1 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all ease-in-out duration-300 flex items-center gap-2 border-red-500 cursor-pointer text-sm font-semibold`}>
								{processingUpdate
									? "Updating Status..."
									: `${reservationToUpdate.status === "Accepted" ? "Accept" : "Reject"}`}
								<CheckCircleIcon className="size-6" />
							</button>
						</div>
						<p className="text-xs text-red-500 font-bold text-center">This action cannot be undone</p>
					</div>
				</dialog>
			</main>
		</>
	);
}

{
	/* <tr className="bg-fuchsia-800/5 text-fuchsia-800 border-b-2 border-fuchsia-800">
                                    <th className="font-semibold py-2">Property</th>
                                    <th className="font-semibold py-2">Reserved By</th>
                                    <th className="font-semibold py-2">Date of viewing</th>
                                    <th className="font-semibold py-2">Time of viewing</th>
                                    <th className="font-semibold py-2">Reservation Status</th>
                                </tr> */
}
