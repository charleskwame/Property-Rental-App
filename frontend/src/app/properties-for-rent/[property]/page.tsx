/* eslint-disable @next/next/no-img-element */
"use client";

export const runtime = "edge";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import NavBar from "@/components/navbar.component";
import {
	ArrowUpOnSquareIcon,
	HeartIcon,
	HomeModernIcon,
	BookOpenIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ImageGallerySkeletonLoader from "@/components/imagegalleryskeleton.component";
import { MapPin } from "lucide-react";

type ReservationDetails = {
	date?: string;
	time?: string;
	propertyID?: string;
	userID?: string;
};

export default function SpecificProperty() {
	const params = useParams();
	const routerToGoToLogIn = useRouter();

	const [property, setProperty] = useState<PropertyInterFace>();
	const [selectedImage, setSelectedImage] = useState<string>();
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [loadingSlots, setLoadingSlots] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isFavorited, setIsFavorited] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();

	const dateValue = watch("date");

	useEffect(() => {
		const propertyDetails = async (_id: string) => {
			try {
				const request = await axios.get(`${API_URL}user/properties/${_id}`, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (request.status === 200) {
					setProperty(request.data.message);

					// Check if current user is the owner and if property is favorited
					if (sessionStorage.getItem("User") !== null) {
						const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
						const currentUserID = storedUserData.data.userWithoutPassword._id;
						const likedProperties = storedUserData.data.userWithoutPassword.likedproperties || [];
						setIsOwner(request.data.message.owner === currentUserID);
						setIsFavorited(likedProperties.includes(request.data.message._id));
					}
				}
			} catch (error) {
				console.log(error);
			}
		};

		propertyDetails(`${params.property}`);
	}, [params.property]);

	// Fetch available slots when date changes
	useEffect(() => {
		const fetchAvailableSlots = async () => {
			if (!dateValue || !property?._id) return;

			setLoadingSlots(true);
			try {
				const response = await axios.get(`${API_URL}user/available-time-slots`, {
					params: {
						propertyID: property._id,
						date: dateValue,
					},
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.status === 200 && response.data.data) {
					setAvailableSlots(response.data.data);
					setSelectedDate(dateValue);
				}
			} catch (error) {
				console.error("Failed to fetch available slots:", error);
				if (axios.isAxiosError(error)) {
					console.error("API Error:", error.response?.status, error.response?.data);
				}
				toast.error("Could not load available time slots");
				setAvailableSlots([]);
			} finally {
				setLoadingSlots(false);
			}
		};

		fetchAvailableSlots();
	}, [dateValue, property?._id]);

	const toggleFavorite = async (event: React.MouseEvent, propertyID: string) => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

			const token = `Bearer ${storedUserData.data.token}`;
			const userID = storedUserData.data.userWithoutPassword._id;

			const formData = {
				userID: userID,
				propertyID: propertyID,
			};

			try {
				const endpoint = isFavorited
					? `${API_URL}user/properties/remove-from-favorites`
					: `${API_URL}user/properties/add-to-favorites`;

				const request = await axios.post(endpoint, formData, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});

				if (request.status === 200) {
					const updatedLikedProperties = request.data.data.userWithoutPassword.likedproperties || [];
					const isNowFavorited = updatedLikedProperties.includes(propertyID);
					setIsFavorited(isNowFavorited);

					if (isNowFavorited) {
						toast.success("Property added to favorites");
					} else {
						toast.success("Property removed from favorites");
					}
					sessionStorage.setItem("User", JSON.stringify(request.data));
				}
			} catch (error) {
				toast.error("Failed to update favorites");
				console.log(error);
			}
		} else {
			routerToGoToLogIn.push("/login");
		}
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Copied link to clipboard");
		} catch (err) {
			toast.error("Failed to copy text");
			console.error("Failed to copy text: ", err);
		}
	};

	const changeMainImage = (image: string) => {
		setSelectedImage(image);
	};

	const formatTimeTo12Hour = (timeStr: string | undefined): string | null => {
		if (!timeStr) return null;

		const [hStr, mStr] = timeStr.split(":");
		const h = parseInt(hStr);
		const m = parseInt(mStr);

		if (isNaN(h) || isNaN(m)) return null;

		const period = h >= 12 ? "PM" : "AM";
		const hour12 = h % 12 === 0 ? 12 : h % 12;

		return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
	};

	const sendViewingRequestEmail = async (reservationData: ReservationDetails) => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

			reservationData.propertyID = property?._id;
			reservationData.userID = storedUserData.data.userWithoutPassword._id;

			const token = `Bearer ${storedUserData.data.token}`;

			try {
				// Send time in 24-hour format (HH:MM) to backend for validation
				const request = await axios.post(`${API_URL}user/send-reservation-email`, reservationData, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				if (request.status === 200) {
					// Convert to 12-hour format only for email display
					const formattedTime = formatTimeTo12Hour(request.data.data.reservation.time);

					try {
						const body = {
							clientemail: request.data.data.clientEmail,
							owneremail: request.data.data.ownerEmail,
							propertyname: request.data.data.reservation.propertyToView.propertyName,
							date: request.data.data.reservation.date,
							time: formattedTime || request.data.data.reservation.time,
							username: request.data.data.reservation.madeBy.clientName,
							ownername: request.data.data.reservation.propertyOwner.propertyOwnerName,
						};

						const response = await fetch("/api/send-reservation-emails", {
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

							return;
						}

						console.log("Email sent successfully:", data.message);
						toast.success("Reservation Made! An Email Has Been Sent To You");
					} catch (error) {
						console.error("Network or unexpected error:", error);
						toast.error("Reservation Could Not Be Completed! Try Again");
					}
				}
			} catch (error) {
				// Handle booking conflict error
				const axiosError = error as AxiosError<{ message: string }>;
				if (axiosError.response?.status === 409) {
					toast.error(
						axiosError.response.data.message ||
							"This time slot is already booked. Please select another time.",
					);
				} else if (axiosError.response?.status === 403) {
					toast.error(axiosError.response.data.message || "You cannot book your own property.");
				} else {
					toast.error("Failed to send viewing request");
				}
				console.log(axiosError);
			}
		} else {
			routerToGoToLogIn.push("/login");
		}
	};

	return (
		<>
			<NavBar />
			{property !== null ? (
				<main className="px-2 mt-5 lg:px-40">
					<div className="flex items-center justify-between my-2">
						<h1 className="font-semibold lg:text-xl text-fuchsia-800 flex items-center gap-1">
							<HomeModernIcon className="size-6" />
							{property?.name}
						</h1>

						<div className="flex items-center justify-between">
							<div
								onClick={() => copyToClipboard(location.href)}
								className="cursor-pointer flex items-center gap-1 hover:bg-fuchsia-800/15 hover:text-fuchsia-800 transition-all ease-in-out duration-300 px-2 py-1 rounded-lg">
								<ArrowUpOnSquareIcon className="size-5" />
								<p>Share</p>
							</div>
							<div
								onClick={(event) => toggleFavorite(event, property!._id)}
								className={`cursor-pointer flex items-center gap-1 hover:bg-fuchsia-800/15 hover:text-fuchsia-800 transition-all ease-in-out duration-300 px-2 py-1 rounded-lg ${
									isFavorited ? "text-fuchsia-800" : ""
								}`}>
								{isFavorited ? <HeartIconSolid className="size-5" /> : <HeartIcon className="size-5" />}
								<p>{isFavorited ? "Saved" : "Save"}</p>
							</div>
						</div>
					</div>
					<div key={property?._id} className="">
						<div className="flex items-center justify-center">
							{property?.images ? (
								<div className="lg:flex items-start justify-center gap-1">
									<div className="lg:w-[60%]">
										{/* main image bigger */}
										<img
											src={selectedImage ? selectedImage : property.images[0]}
											alt={`Image of ${property.name}`}
											// fill={true}
											className="rounded-lg w-full"
											loading="lazy"
										/>
									</div>
									<div className="grid mt-1 lg:mt-0 grid-cols-4 lg:grid-cols-2 gap-1 lg:w-[40%]">
										{property.images.map((image, index) => {
											return (
												// smaller image thumbnails
												<img
													key={index}
													src={image}
													alt={`Image of ${property.name}`}
													onClick={() => changeMainImage(image)}
													// className="rounded-lg"
													className={
														selectedImage === image
															? `rounded-lg border-1 border-fuchsia-800 opacity-50 cursor-pointer`
															: `rounded-lg cursor-pointer`
													}
												/>
											);
										})}
									</div>
								</div>
							) : (
								<ImageGallerySkeletonLoader />
							)}
						</div>
						<div className="flex flex-col-reverse  lg:flex-row justify-between mt-2 gap-2 mb-5">
							<div className="bg-custom-white-50 lg:w-[70%] text-gray-500  p-2 py-2 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center justify-between">
										{/* <h1 className="font-semibold">Property Type</h1> */}
										<p className="text-sm font-semibold text-fuchsia-800 first-letter:uppercase">
											{property?.type}
										</p>
									</div>
									<div className="flex items-center justify-between">
										{/* <h1 className="font-semibold">Property Location</h1> */}
										<p className="text-sm text-fuchsia-800 font-semibold flex items-center gap-1">
											<MapPin className="size-4" /> {property?.location}
										</p>
									</div>
								</div>
								<div>
									<h1 className="font-semibold">Property Information</h1>
									<p className="text-sm text-black/50">{property?.description}</p>
								</div>
							</div>
							<div className="bg-custom-white-50 text-gray-500  p-2 py-2 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10 lg:w-[40%] h-fit">
								<p className="text-lg text-fuchsia-800 lg:text-xl font-bold">
									GHc{property?.price} <span className="text-sm text-black/50">/month</span>
								</p>

								{/* <h1 className="font-semibold">Owner</h1> */}
								<p className="text-sm text-black/50">Posted by {property?.ownerName}</p>

								{isOwner ? (
									<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
										<p className="text-xs text-blue-800 font-semibold">
											This is your property. You cannot book a viewing for your own property.
										</p>
									</div>
								) : (
									<form action="" onSubmit={handleSubmit(sendViewingRequestEmail)}>
										<div className="mt-3 grid gap-2">
											<h1 className="font-semibold text-xs">Select Date and Time for Viewing</h1>
											<div className="flex flex-col lg:flex-row items-start justify-between gap-2">
												<div className="grid w-full lg:w-auto">
													<input
														type="date"
														id="dateInput"
														min={new Date().toISOString().split("T")[0]}
														max={
															new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0]
														}
														className="border rounded-lg border-fuchsia-800/10 p-2 text-fuchsia-800 font-semibold text-xs"
														{...register("date", {
															required: {
																value: true,
																message: "Date is required",
															},
														})}
													/>
													<span className="text-red-500 text-xs">
														{errors.date ? `(${errors.date!.message})` : ""}
													</span>
												</div>
												<div className="grid w-full lg:w-auto">
													{loadingSlots ? (
														<div className="border rounded-lg border-fuchsia-800/10 p-2 text-fuchsia-800 font-semibold text-xs bg-gray-100">
															Loading slots...
														</div>
													) : availableSlots.length > 0 ? (
														<>
															<select
																id="timeInput"
																className="border rounded-lg border-fuchsia-800/10 p-2 text-fuchsia-800 font-semibold text-xs"
																{...register("time", {
																	required: {
																		value: true,
																		message: "Time is required",
																	},
																})}>
																<option value="">Select a time slot</option>
																{availableSlots.map((slot) => (
																	<option key={slot} value={slot}>
																		{slot}
																	</option>
																))}
															</select>
															<span className="text-red-500 text-xs">
																{errors.time ? `(${errors.time!.message})` : ""}
															</span>
														</>
													) : selectedDate ? (
														<div className="border rounded-lg border-red-300/50 p-2 text-red-600 font-semibold text-xs bg-red-50">
															No available slots for this date
														</div>
													) : (
														<div className="border rounded-lg border-fuchsia-800/10 p-2 text-fuchsia-800 font-semibold text-xs bg-gray-50">
															Select a date to view times
														</div>
													)}
												</div>
											</div>
										</div>
										<button className="w-full mt-3 bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border-2 border-transparent transition-all py-2.5 rounded text-white cursor-pointer flex items-center justify-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
											<BookOpenIcon className="size-5" />
											Reserve Viewing
										</button>
									</form>
								)}
							</div>
						</div>
					</div>
				</main>
			) : (
				<h1 className="text-center text-xs lg:text-lg font-semibold text-fuchsia-800 mt-10">
					Property Not Found
				</h1>
			)}
		</>
	);
}
