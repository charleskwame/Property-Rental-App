/* eslint-disable @next/next/no-img-element */
"use client";

export const runtime = "edge";

//import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
// import { User } from "@/interfaces/user.interface";
//import Image from "next/image";
import NavBar from "@/components/navbar.component";
import {
	ArrowUpOnSquareIcon,
	HeartIcon,
	HomeModernIcon,
	BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Toast from "@/components/toast.component";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ImageGallerySkeletonLoader from "@/components/imagegalleryskeleton.component";
import { MapPin } from "lucide-react";
// import { useRef } from "react";

type ReservationDetails = {
	date?: string;
	time?: string;
	propertyID?: string;
	userID?: string;
};

export default function SpecificProperty() {
	//const pathName = usePathname();
	const params = useParams();
	const routerToGoToLogIn = useRouter();
	// const timeInputRef = useRef(null);
	const [property, setProperty] = useState<PropertyInterFace>();
	// const [user, setUser] = useState<User>();
	const [selectedImage, setSelectedImage] = useState<string>();
	// const [isSelectedImage, setIsSelectedImage] = useState<boolean>(false);

	//const routerToGoToSpecificPropertyPage = useRouter();
	//const propertyRouter = useRouter();
	//const { _id } = propertyRouter.query;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		const propertyDetails = async (_id: string) => {
			//event.preventDefault();
			// const storedRenterData = JSON.parse(`${sessionStorage.getItem("Renter")}`);
			// const token = `Bearer ${storedRenterData.data.token}`;
			// console.log(token);
			// console.log(_id);
			try {
				const request = await axios.get(`${API_URL}user/properties/${_id}`, {
					headers: {
						"Content-Type": "application/json",
						//Authorization: token,
					},
				});
				if (request.status === 200) {
					// const requestOwner = await axios.get(`${API_URL}user?userID=${request.data.message.owner}`, {
					// 	headers: {
					// 		"Content-Type": "application/json",
					// 	},
					// });
					// if (requestOwner.status === 200) {
					// 	setProperty(request.data.message);
					// 	//console.log(requestOwner.data.data.userWithoutPassword);
					// 	setUser(requestOwner.data.data.userWithoutPassword);
					// }
					setProperty(request.data.message);
				}
				//sessionStorage.setItem("PropertyInViewing", JSON.stringify(request.data.message));
			} catch (error) {
				console.log(error);
			}
			//routerToGoToSpecificPropertyPage.push(`/properties-for-rent/${_id}`);
		};

		propertyDetails(`${params.property}`);
	}, [params.property]);

	const addPropertyToFavorites = async (event: React.MouseEvent, propertyID: string) => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

			const token = `Bearer ${storedUserData.data.token}`;
			const userID = storedUserData.data.userWithoutPassword._id;

			const formData = {
				userID: userID,
				propertyID: propertyID,
			};

			try {
				const request = await axios.post(`${API_URL}user/properties/add-to-favorites`, formData, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				if (request.status === 200) {
					toast.success("Property added to favorites");
					//alert("Property added to favorites");
				}
				sessionStorage.setItem("User", JSON.stringify(request.data));
				//location.reload();
				//console.log(request);
			} catch (error) {
				toast.error("Failed to add property to favorites");
				console.log(error);
			}
		} else {
			routerToGoToLogIn.push("/login");
		}

		// console.log(token);
		// console.log(userID);
	};
	//console.log(params);

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Copied link to clipboard");
			//alert("Copied the text: " + text);
		} catch (err) {
			toast.error("Failed to copy text");
			console.error("Failed to copy text: ", err);
		}
	};

	const changeMainImage = (image: string) => {
		setSelectedImage(image);
		// setIsSelectedImage(true);
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
		const formatted = formatTimeTo12Hour(reservationData.time);
		if (formatted) {
			reservationData.time = formatted;
			// console.log(reservationData.time);
		}
		// return true;

		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

			reservationData.propertyID = property?._id;
			reservationData.userID = storedUserData.data.userWithoutPassword._id;
			// const token = `Bearer ${user?.token}`;
			const token = `Bearer ${storedUserData.data.token}`;

			// console.log(reservationData);
			try {
				const request = await axios.post(`${API_URL}user/send-reservation-email`, reservationData, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				if (request.status === 200) {
					toast.success("Viewing request sent");
					//alert("Viewing request sent");
				}
			} catch (error) {
				toast.error("Failed to send viewing request");
				console.log(error);
			}
		} else {
			routerToGoToLogIn.push("/login");
		}
	};

	// const increaseTime = () => {
	// 	const timeInputElement = document.getElementById("timeInput");
	// 	if (timeInputElement instanceof HTMLInputElement) {
	// 		const timeInput: HTMLInputElement = timeInputElement;
	// 		timeInput.stepUp(30);
	// 	}
	// };

	// const decreaseTime = () => {
	// 	const timeInputElement = document.getElementById("timeInput");
	// 	if (timeInputElement instanceof HTMLInputElement) {
	// 		const timeInput: HTMLInputElement = timeInputElement;
	// 		timeInput.stepDown(30);
	// 	}
	// };

	return (
		<>
			<NavBar />
			<Toast />
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
								onClick={(event) => addPropertyToFavorites(event, property!._id)}
								className="cursor-pointer flex items-center gap-1 hover:bg-fuchsia-800/15 hover:text-fuchsia-800 transition-all ease-in-out duration-300 px-2 py-1 rounded-lg">
								<HeartIcon className="size-5" />
								<p>Favorite</p>
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
							<div className="bg-custom-white-50 text-gray-500  p-2 py-2 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10 lg:w-[30%] h-fit">
								<p className="text-lg text-fuchsia-800 lg:text-xl font-bold">
									GHc{property?.price} <span className="text-sm text-black/50">/month</span>
								</p>

								{/* <h1 className="font-semibold">Owner</h1> */}
								<p className="text-sm text-black/50">Posted by {property?.ownerName}</p>

								<form action="" onSubmit={handleSubmit(sendViewingRequestEmail)}>
									<div className="mt-3 grid gap-2">
										<h1 className="font-semibold text-xs">Select Date and Time for Vieweing</h1>
										<div className="flex items-start justify-between">
											<div className="grid">
												<input
													type="date"
													//name="date"
													id=""
													className="border rounded-lg border-fuchsia-800/10 p-2 text-fuchsia-800 font-semibold text-xs"
													{...register("date", {
														required: {
															value: true,
															message: "Date is required",
														},
													})}
													onChange={(event) => console.log(event.target.value)}
												/>
												<span className="text-red-500 text-xs">
													{errors.date ? `(${errors.date!.message})` : ""}
												</span>
											</div>
											<div className="grid">
												<input
													// ref={timeInputRef}
													type="time"
													//name="time"
													id="timeInput"
													className="border rounded-lg border-fuchsia-800/10 p-2 text-fuchsia-800 font-semibold text-xs"
													min={`8:00`}
													max={`17:00`}
													{...register("time", {
														required: {
															value: true,
															message: "Time is required",
														},
														min: {
															value: "08:00",
															message: "Min time - 8:00 am",
														},
														max: {
															value: "18:00",
															message: "Max time - 6:00 pm",
														},
													})}

													//onChange={(event) => console.log(event.target.value)}
												/>

												<span className="text-red-500 text-xs container">
													{errors.time ? `(${errors.time!.message})` : ""}
												</span>

												{/* <button
													className="border border-fuchsia-800/10 p-1"
													type="button"
													onClick={() => increaseTime()}>
													+
												</button>
												<button
													className="border border-fuchsia-800/10 p-1"
													type="button"
													onClick={() => decreaseTime()}>
													-
												</button> */}

												{/* <select className="border rounded-lg border-fuchsia-800/10 p-2 text-fuchsia-800 font-semibold text-xs">
												{/* {property?.viewingTimes ? (
													<>
														<select
															className="border rounded-lg border-fuchsia-800/10 p-2 text-fuchsia-800 font-semibold text-xs"
															{...register("time", {
																required: {
																	value: true,
																	message: "Time is required",
																},
															})}>
															<option value="" className="w-56">
																Select Time
															</option>
															{property?.viewingTimes.map((time) => {
																return (
																	<option key={time} className="font-semibold">
																		{time}
																	</option>
																);
															})}
														</select>
														<span className="text-red-500 text-xs container">
															{errors.time ? `(${errors.time!.message})` : ""}
														</span>
													</>
												) : null} */}
												{/* </select> */}
											</div>
										</div>
									</div>
									<button className="w-full mt-3 bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border-2 border-transparent transition-all py-2.5 rounded text-white cursor-pointer flex items-center justify-center gap-1 text-sm">
										<BookOpenIcon className="size-5" />
										Reserve Viewing
									</button>
								</form>
							</div>

							{/* <div>
									<h1 className="font-semibold">Contact</h1>
									<p className="text-sm text-black/50">{user?.email}</p>
									<p className="text-sm text-black/50">{user?.phonenumber}</p>
								</div> */}
						</div>
					</div>
				</main>
			) : (
				<h1>Property Not Found</h1>
			)}
		</>
	);
}
