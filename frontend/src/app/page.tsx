"use client";
export const runtime = "edge";

// import Link from "next/link";

import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	// HeartIcon,
	// UserCircleIcon,
	MapPinIcon,
	HomeModernIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";
import NavBar from "@/components/navbar.component";
// import SignUpRenter from "@/components/signup.component";
import LoadingSpinner from "@/components/loadingspinner.component";
import { useForm } from "react-hook-form";
import propertyTypeOptions from "@/propertytypes";
import { Locations } from "@/lib/cities";
import { FilterIcon } from "lucide-react";

type FilterInputs = {
	type?: string;
	location?: string;
};

export default function PropertiesForRent() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FilterInputs>();

	const routerToGoToSpecificPropertyPage = useRouter();
	const routerToGoToLogIn = useRouter();
	const routerToRefreshPage = useRouter();

	const [propertiesFetched, setPropertiesFetched] = useState<PropertyInterFace[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingFavorites, setLoadingFavorites] = useState<boolean>(false);
	const [favoritePropertiesFetched, setFavoritePropertiesFetched] = useState<PropertyInterFace[]>(
		[],
	);
	const [apiResponseMessage, setApiResponseMessage] = useState<string>("");
	const filterDialog = useRef(null);
	const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
	useEffect(() => {
		const getProperties = async () => {
			try {
				setLoading(true);
				const request = await axios.get(`${API_URL}user/properties`, {});

				if (request.status === 200) {
					setPropertiesFetched(request.data.message);
					setLoading(false);
				}

				if (request.status === 400) {
					setPropertiesFetched([]);
					setLoading(false);
					setApiResponseMessage("No properties listed");
				}
			} catch (error) {
				setLoading(false);
				console.log(error);
			}
		};

		getProperties();

		//const unParsedRenterData = sessionStorage.getItem("Renter");
		//console.log(unParsedRenterData);

		//if (!unParsedRenterData) return;

		//const storedRenterData = JSON.parse(unParsedRenterData);
		//const storedRenterData = JSON.parse(`${sessionStorage.getItem("Renter")}`);

		//const likedProperties = storedRenterData.data.renterWithoutPassword.likedproperties;

		// const fetchFavoriteProperties = async () => {
		// 	if (likedProperties.length === 0) return;

		// 	try {
		// 		setLoadingFavorites(true); // Start loading

		// 		const requests = likedProperties.map((propertyID: string) =>
		// 			axios.get(`${API_URL}user/properties/${propertyID}`),
		// 		);

		// 		const responses = await Promise.all(requests);

		// 		// Filter out only successful responses
		// 		const successfulData = responses
		// 			.filter((response) => response.data.status === "Success")
		// 			.map((response) => response.data.message);

		// 		//console.log(successfulData);
		// 		setFavoritePropertiesFetched(successfulData);
		// 		setLoadingFavorites(false); // Stop loading
		// 	} catch (error) {
		// 		console.error("Failed to fetch some favorite properties", error);
		// 		setLoadingFavorites(false);
		// 	}
		// };
		// fetchFavoriteProperties();
		// if (sessionStorage.getItem("Renter") !== null) {
		// }
	}, []);

	const propertyDetails = async (event: React.MouseEvent, _id: string) => {
		event.preventDefault();
		routerToGoToSpecificPropertyPage.push(`/properties-for-rent/${_id}`);
	};

	const handleOpenFilterDialog = () => {
		setOpenFilterDialog(true);
		(filterDialog.current as HTMLDialogElement | null)?.showModal();
	};

	const handleCloseFilterDialog = () => {
		setOpenFilterDialog(false);
		(filterDialog.current as HTMLDialogElement | null)?.close();
	};

	const setFilters = async (filterData: FilterInputs) => {
		try {
			const request = await axios.post(
				`${API_URL}user/properties/filter?type=${filterData.type}&location=${filterData.location}`,
			);
			if (request.status === 200) {
				setPropertiesFetched(request.data.data);
			}
			//console.log(request);
			//handleCloseFilterDialog();
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const { status, data } = error.response;
				if (status === 400 || status === 404) {
					setPropertiesFetched([]);
					setApiResponseMessage(data.message);
				}
			}
			console.log(error);
			//handleCloseFilterDialog();
		}
	};

	return (
		<main className="">
			<NavBar />
			{/* <LoadingSpinner /> */}

			{/* <SignUpRenter open={true} /> */}
			{loading ? (
				<LoadingSpinner message={"Loading Properties"} />
			) : (
				// <h1>Loading...</h1>
				<div className="px-2 mt-3">
					<div className={openFilterDialog ? "mb-0" : "mb-3"}>
						<div className="flex justify-between">
							<h1 className="text-sm md:text-base font-bold text-fuchsia-800 self-end">
								Current Listings
							</h1>

							<button
								className="flex items-center gap-1 text-xs font-semibold border-2 px-2 py-1 rounded-lg bg-fuchsia-800 text-white border-fuchsia-800 cursor-pointer hover:text-fuchsia-800 hover:bg-fuchsia-800/10 transition-all duration-300 ease-in-out"
								onClick={() => handleOpenFilterDialog()}>
								Filter Listings
								<FilterIcon className="size-4" />
							</button>
						</div>
						{/* filter dialog */}
						<div
							// ref={filterDialog}
							// open={openFilterDialog}
							className={
								openFilterDialog
									? `p-1 rounded-lg animate-jump-in w-[95%] md:w-fit border-1 mt-2 mx-auto fixed bg-white left-1/2 -translate-x-1/2 duration-500`
									: `hidden`
							}>
							<XCircleIcon
								className="size-6 absolute -top-[6%] -right-[2%] md:-top-[15%] md:-right-[2%] fill-red-500 stroke-white cursor-pointer hover:fill-white hover:stroke-red-500 transition-all duration-300 ease-in-out"
								onClick={() => handleCloseFilterDialog()}
							/>
							<form onSubmit={handleSubmit(setFilters)} className="">
								<p className="text-xs font-semibold mb-1 text-fuchsia-800">
									Filter your search to find the perfect property
								</p>
								{/* type filter */}
								<div className="md:flex items-center md:justify-center grid gap-2">
									<div className="flex gap-1">
										<select
											id="propertyType"
											className="w-full md:w-2/4 border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800 scroll-smooth"
											{...register("type", {
												// required: { value: true, message: "Type is required" },
											})}>
											<option value="">All Types</option>
											{propertyTypeOptions.map((propertyOption) => {
												return (
													<option key={propertyOption.label} value={propertyOption.value}>
														{propertyOption.label}
													</option>
												);
											})}
										</select>
										{/* <hr className="w-5 h-[2px] bg-fuchsia-800/20" />
							<p>or</p>
							<hr className="w-5 h-[2px] bg-fuchsia-800/20" /> */}
										{/* location filter */}
										<select
											className="w-full md:w-2/4 border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800 scroll-smooth"
											{...register("location", {
												// required: { value: true, message: "Location is required" },
											})}>
											<option value="">All Locations</option>
											{Locations.map((location) => (
												<optgroup
													key={location.region}
													label={`${location.region}` + " Region"}
													className="bg-fuchsia-800/5">
													{location.cities.map((city) => (
														<option key={city} value={city}>
															{city}
														</option>
													))}
												</optgroup>
											))}
										</select>
									</div>
									<button className="bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 border-fuchsia-800 border-2 transition-all py-1 rounded text-white cursor-pointer px-3 text-center text-sm">
										Apply Filters
									</button>
								</div>
							</form>
						</div>
					</div>
					<div
						className={
							propertiesFetched.length > 0
								? `grid grid-cols-2 lg:grid-cols-5 gap-1 ${
										openFilterDialog &&
										"transition-all ease-in-out duration-300 translate-y-[120px] md:translate-y-20"
								  }`
								: ""
						}>
						{propertiesFetched.length > 0 ? (
							propertiesFetched.map((propertyFetched) => (
								// <div
								// 	key={propertyFetched._id}
								// 	className="relative w-[400px] h-[360px] md:w-fit md:h-fit cursor-pointer border rounded-xl flex flex-col overflow-hidden">
								// 	<div
								// 		className="flex flex-col h-full"
								// 		onClick={(event) => propertyDetails(event, propertyFetched._id)}>
								// 		{/* Image Section */}
								// 		<Image
								// 			className="object-cover rounded-t-xl"
								// 			src={propertyFetched.images[0]}
								// 			alt={`Image of ${propertyFetched.name}`}
								// 			width={400}
								// 			height={180}
								// 		/>

								// 		{/* Content Area (flex column to push bottom section down) */}
								// 		<div className="flex flex-col justify-between flex-grow p-1">
								// 			{/* Title */}
								// 			<h1 className="font-semibold text-xs md:text-sm flex items-center gap-1 text-fuchsia-800">
								// 				<HomeModernIcon className="size-4" />
								// 				{propertyFetched.name}
								// 			</h1>

								// 			{/* Spacer or optional description could go here */}
								// 			<div className="flex-grow" />

								// 			{/* Location and Price pinned to bottom */}
								// 			<div className="flex items-center justify-between pt-2">
								// 				<p className="text-[10px] md:text-xs flex items-center gap-1">
								// 					<MapPinIcon className="size-3" />
								// 					{propertyFetched.location}
								// 				</p>
								// 				<p className="text-xs font-semibold text-fuchsia-800">
								// 					GHc{propertyFetched.price}
								// 					<small className="text-black text-[10px]">/m</small>
								// 				</p>
								// 			</div>
								// 		</div>
								// 	</div>
								// </div>

								<div
									key={propertyFetched._id}
									className="relative w-fit cursor-pointer border-1 rounded-xl flex flex-col h-full justify-between">
									<div
										className="rounded-xl"
										onClick={(event) => {
											propertyDetails(event, propertyFetched._id);
										}}>
										<Image
											className=" border-2 border-gray-100 object-cover rounded-t-xl"
											src={propertyFetched.images[0]}
											alt={`Image of ${propertyFetched.name}`}
											//fill
											width={400}
											height={200}
										/>
										<div className="flex-grow">
											<div className="p-1 flex flex-col gap-1">
												<h1 className="font-semibold text-xs md:text-sm flex items-center gap-1 text-fuchsia-800">
													<HomeModernIcon className="size-4" />
													{propertyFetched.name}
												</h1>
												<div className="flex items-center justify-between">
													<p className="text-[10px] md:text-xs flex items-center gap-1 w-fit">
														<MapPinIcon className="size-3" />
														{propertyFetched.location}
													</p>
													<p className="text-xs font-semibold text-fuchsia-800 w-fit">
														GHc{propertyFetched.price} <small className="text-black text-[10px]">/m</small>
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<h1
								className={`text-center text-xs lg:text-lg font-semibold text-fuchsia-800 mt-10 ${
									openFilterDialog &&
									"transition-all ease-in-out duration-300 translate-y-32 md:translate-y-20"
								}`}>
								{apiResponseMessage}
							</h1>
						)}
					</div>
				</div>
			)}
		</main>
	);
}

{
	/* {loading ? (
	<h1>Loading...</h1>
) : (
	<div>
		<h1>View Listings</h1>
		<div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
			{!loading && propertiesFetched?.length > 0 ? (
				propertiesFetched.map((property) => (
					<div key={property._id} className="relative">
						<HeartIcon
							className="size-7 absolute top-2 right-2 fill-gray-200 hover:fill-red-500"
							onClick={(event) => addPropertyToFavorites(event, property._id)}
						/>
						<div
							className="w-fit border-2 border-gray-100 rounded-3xl p-1"
							onClick={(event) => {
								propertyDetails(event, property._id);
							}}
						>
							<Image
								className="rounded-3xl border-2 border-gray-100"
								src={property.images}
								alt={`Image of ${property.name}`}
								width={200}
								height={200}
							/>
							<div className="px-2 flex items-baseline justify-between py-2">
								<h1 className="font-semibold text-sm">{property.name}</h1>
								<p className="text-xs">{property.price}</p>
							</div>
						</div>
					</div>
				))
			) : (
				<h1>No properties found</h1>
			)}
		</div>
	</div>
)} */
}

{
	/* {sessionStorage.getItem("User") !== null && (
                                        <HeartIcon
                                            className="size-7 absolute top-2 right-2 fill-gray-200 hover:fill-red-500 hover:stroke-red-500 transition-all ease-in-out duration-300"
                                            onClick={(event) => addPropertyToFavorites(event, propertyFetched._id)}
                                        />
                                    )} */
}

// const addPropertyToFavorites = async (event: React.MouseEvent, propertyID: string) => {
// 	if (sessionStorage.getItem("User") !== null) {
// 		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

// 		const token = `Bearer ${storedUserData.data.token}`;
// 		const userID = storedUserData.data.userWithoutPassword._id;

// 		const formData = {
// 			userID: userID,
// 			propertyID: propertyID,
// 		};

// 		try {
// 			const request = await axios.post(`${API_URL}user/properties/add-to-favorites`, formData, {
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: token,
// 				},
// 			});
// 			if (request.status === 200) {
// 				alert("Property added to favorites");
// 			}
// 			sessionStorage.setItem("User", JSON.stringify(request.data));
// 			//location.reload();
// 			//console.log(request);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	} else {
// 		routerToGoToLogIn.push("/login");
// 	}

// 	// console.log(token);
// 	// console.log(userID);
// };

// console.log(
// 	JSON.parse(`${sessionStorage.getItem("User")}`).data.userWithoutPassword.likedproperties,
// );
