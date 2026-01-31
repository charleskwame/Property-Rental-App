"use client";

import NavBar from "@/components/navbar.component";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { ReservationsLoaded } from "@/interfaces/reservation.interface";
import { useRef } from "react";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { ClockIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/loadingspinner.component";

export default function ReservationsForOwner() {
	const [reservationsLoaded, setReservationsLoaded] = useState<ReservationsLoaded[]>([]);
	const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState<boolean>(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
	const [processingUpdate, setProcessingUpdate] = useState<boolean>(false);
	const [processingDelete, setProcessingDelete] = useState<boolean>(false);
	const [loadingReservations, setLoadingReservations] = useState<boolean>(false);
	const [reservationToDelete, setReservationToDelete] = useState<string>("");
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
	const deleteDialogRef = useRef(null);
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

			const request = await axios.put(
				`${API_URL}user/reservation/update-reservation-status`,
				reservationData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				},
			);
			if (request.status === 200) {
				try {
					const body = {
						clientemail: request.data.data.clientEmail,
						owneremail: request.data.data.ownerEmail,
						propertyname: request.data.data.existingReservation.propertyToView.propertyName,
						date: request.data.data.existingReservation.date,
						time: request.data.data.existingReservation.time,
						username: request.data.data.existingReservation.madeBy.clientName,
						ownername: request.data.data.existingReservation.propertyOwner.propertyOwnerName,
						status: request.data.data.existingReservation.status.toLowerCase(),
					};

					const response = await fetch("/api/send-reservation-update-emails", {
						method: "POST",
						cache: "no-cache",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
						},
					});

					const data = await response.json();

					if (!response.ok) {
						console.error("Error sending email:", data.error || "Unknown error");
						toast.error("Could Not Complete Reservation, Try again later");

						location.reload();
						return;
					}

					console.log("Email sent successfully:", data.message);

					toast.success("Reservation Updated Sucessfully");
					location.reload();
				} catch (error) {
					// Network error or unexpected issue
					console.error("Network or unexpected error:", error);
					toast.error("Reservation Could Not Be Completed! Try Again");
					location.reload();
				}
			}
		} catch (error) {
			console.log(error);
			location.reload();
		}
	};

	const handleDeleteReservation = async () => {
		try {
			setProcessingDelete(true);

			const storedUserDataString = sessionStorage.getItem("User");
			if (!storedUserDataString) {
				toast.error("Session expired. Please login again.");
				setIsDeleteDialogOpen(false);
				setProcessingDelete(false);
				return;
			}

			const storedUserData = JSON.parse(storedUserDataString);
			const token = `Bearer ${storedUserData.data.token}`;

			const request = await axios.delete(`${API_URL}user/reservation/${reservationToDelete}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});

			if (request.status === 200) {
				try {
					const body = {
						clientemail: request.data.data.clientEmail,
						owneremail: request.data.data.ownerEmail,
						username: request.data.data.clientName,
						ownername: request.data.data.ownerName,
						propertyname: request.data.data.propertyName,
						date: request.data.data.date.split("T")[0],
						time: request.data.data.time,
					};

					const response = await fetch("/api/send-reservation-delete-emails", {
						method: "POST",
						cache: "no-cache",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
						},
					});

					const data = await response.json();

					if (!response.ok) {
						console.error("Error sending email:", data.error || "Unknown error");
						toast.error("Reservation deleted but email notification failed");
						location.reload();
						return;
					}

					console.log("Emails sent successfully:", data.message);
					toast.success("Reservation Deleted Successfully");
					setIsDeleteDialogOpen(false);
					setReservationToDelete("");
					location.reload();
				} catch (emailError) {
					console.error("Email sending error:", emailError);
					toast.error("Reservation deleted but email notification failed");
					location.reload();
				}
			}
		} catch (error: any) {
			console.error("Delete reservation error:", error);
			console.error("Error response:", error.response?.data);
			const errorMessage = error.response?.data?.message || "Failed to delete reservation. Try again.";
			toast.error(errorMessage);
			setIsDeleteDialogOpen(false);
		} finally {
			setProcessingDelete(false);
		}
	};

	const openDeleteDialog = (reservationID: string) => {
		setReservationToDelete(reservationID);
		setIsDeleteDialogOpen(true);
	};

	return (
		<>
			<NavBar />

			<main className="px-2 mt-10">
				<h1 className="text-2xl font-bold text-fuchsia-800 text-center mb-5">Manage Reservations</h1>
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

									<div className="flex items-center justify-between gap-2 mb-0.5">
										<div className="flex-1">
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
													className="font-semibold border border-fuchsia-800/20 w-full p-0.5 cursor-pointer rounded-sm text-center text-fuchsia-800 text-xs"
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
										<button
											onClick={() => openDeleteDialog(reservationLoaded._id)}
											className="p-1 hover:bg-red-100 rounded transition-colors"
											title="Delete reservation">
											<TrashIcon className="size-5 text-red-600 hover:text-red-700" />
										</button>
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

				{/* dialog to delete reservation */}
				<dialog
					ref={deleteDialogRef}
					open={isDeleteDialogOpen}
					className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 lg:max-w-1/2 rounded-2xl backdrop:bg-fuchsia-800/15 animate-fade w-[90%] border border-fuchsia-800/10 p-4 bg-white">
					<label
						htmlFor=""
						className="text-red-600 text-sm text-center font-semibold flex items-center justify-center gap-2 mb-1">
						<TrashIcon className="size-5" />
						Delete Reservation
					</label>
					<div className="grid gap-2 mb-1">
						<p className="text-sm text-center">
							Are you sure you want to{" "}
							<span className="bg-red-600 text-white font-semibold px-2 rounded-sm">delete</span> this
							reservation?
						</p>

						<div className="flex items-center justify-center gap-2">
							<button
								type="button"
								disabled={processingDelete}
								onClick={() => {
									setIsDeleteDialogOpen(false);
									setReservationToDelete("");
								}}
								className={`disabled:bg-fuchsia-800/10 disabled:cursor-auto disabled:hover:text-fuchsia-800 border-2 bg-fuchsia-800/20 px-5 py-1 text-fuchsia-800 hover:bg-fuchsia-800 hover:text-white rounded-md transition-all ease-in-out duration-300 flex items-center gap-2 border-fuchsia-800 cursor-pointer text-sm font-semibold`}>
								Cancel
								<XCircleIcon className="size-6" />
							</button>
							<button
								onClick={() => handleDeleteReservation()}
								disabled={processingDelete}
								className={`disabled:bg-red-400/10 disabled:cursor-auto disabled:hover:text-red-500 border-2 bg-red-500/20 px-5 py-1 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all ease-in-out duration-300 flex items-center gap-2 border-red-500 cursor-pointer text-sm font-semibold`}>
								{processingDelete ? "Deleting..." : "Delete"}
								<TrashIcon className="size-5" />
							</button>
						</div>
						<p className="text-xs text-red-500 font-bold text-center">This action cannot be undone</p>
					</div>
				</dialog>
			</main>
		</>
	);
}
