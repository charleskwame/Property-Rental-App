"use client";

import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPinIcon, HomeModernIcon, XCircleIcon } from "@heroicons/react/24/outline";
import NavBar from "@/components/navbar.component";
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
	const { register, handleSubmit } = useForm<FilterInputs>();

	const routerToGoToSpecificPropertyPage = useRouter();

	const [propertiesFetched, setPropertiesFetched] = useState<PropertyInterFace[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [apiResponseMessage, setApiResponseMessage] = useState<string>("");
	const [loadingMessage, setLoadingMessage] = useState<string>("Loading Properties");
	const filterDialog = useRef(null);
	const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
	useEffect(() => {
		const loadTime =
			window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
		console.log(loadTime / 1000 + "s");
		const getProperties = async () => {
			try {
				setLoading(true);

				// Start a timer to show a slow loading message after 5s
				const slowLoadingTimer = setTimeout(() => {
					setLoadingMessage("Slow loading...Server is in cold start. This will happen only once");
				}, 5000);

				const request = await axios.get(`${API_URL}user/properties`, {});

				// Request finished, cancel the slow loading message
				clearTimeout(slowLoadingTimer);

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

			// try {
			// 	setLoading(true);
			// 	const request = await axios.get(`${API_URL}user/properties`, {});

			// 	// if (loadTime > 5) {
			// 	// 	setLoadingMessage("Slow loading...Server is in cold start. This will happen only once");
			// 	// }

			// 	setTimeout(() => {
			// 		setLoadingMessage("Slow loading...Server is in cold start. This will happen only once");
			// 	}, 5000);

			// 	if (request.status === 200) {
			// 		setPropertiesFetched(request.data.message);
			// 		setLoading(false);
			// 	}

			// 	if (request.status === 400) {
			// 		setPropertiesFetched([]);
			// 		setLoading(false);
			// 		setApiResponseMessage("No properties listed");
			// 	}
			// } catch (error) {
			// 	setLoading(false);
			// 	console.log(error);
			// }
		};

		getProperties();
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
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const { status, data } = error.response;
				if (status === 400 || status === 404) {
					setPropertiesFetched([]);
					setApiResponseMessage(data.message);
				}
			}
			console.log(error);
		}
	};

	return (
		<main className="">
			<NavBar />

			{loading ? (
				<LoadingSpinner message={loadingMessage} />
			) : (
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
											{...register("type", {})}>
											<option value="">All Types</option>
											{propertyTypeOptions.map((propertyOption) => {
												return (
													<option key={propertyOption.label} value={propertyOption.value}>
														{propertyOption.label}
													</option>
												);
											})}
										</select>

										{/* location filter */}
										<select
											className="w-full md:w-2/4 border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800 scroll-smooth"
											{...register("location", {})}>
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
								? `grid grid-cols-2 lg:grid-cols-4 gap-1 ${
										openFilterDialog &&
										"transition-all ease-in-out duration-300 translate-y-[120px] md:translate-y-20"
								  }`
								: ""
						}>
						{propertiesFetched.length > 0 ? (
							propertiesFetched.map((propertyFetched) => (
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
