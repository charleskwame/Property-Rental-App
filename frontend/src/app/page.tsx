"use client";
import Link from "next/link";

import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import NavBar from "@/components/navbar.component";

export default function PropertiesForRent() {
	const routerToGoToSpecificPropertyPage = useRouter();
	const routerToGoToLogIn = useRouter();
	const routerToRefreshPage = useRouter();

	const [propertiesFetched, setPropertiesFetched] = useState<PropertyInterFace[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingFavorites, setLoadingFavorites] = useState<boolean>(false);
	const [favoritePropertiesFetched, setFavoritePropertiesFetched] = useState<PropertyInterFace[]>(
		[],
	);
	useEffect(() => {
		const getProperties = async () => {
			try {
				const request = await axios.get(`${API_URL}user/properties`, {});

				if (request.data.status === "Success") {
					setLoading(!loading);
					setPropertiesFetched(request.data.message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		getProperties();

		const unParsedRenterData = localStorage.getItem("Renter");

		if (!unParsedRenterData) return;

		const storedRenterData = JSON.parse(unParsedRenterData);
		//const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);

		const likedProperties = storedRenterData.data.renterWithoutPassword.likedproperties;

		const fetchFavoriteProperties = async () => {
			if (likedProperties.length === 0) return;

			try {
				setLoadingFavorites(true); // Start loading

				const requests = likedProperties.map((propertyID: string) =>
					axios.get(`${API_URL}user/properties/${propertyID}`),
				);

				const responses = await Promise.all(requests);

				// Filter out only successful responses
				const successfulData = responses
					.filter((response) => response.data.status === "Success")
					.map((response) => response.data.message);

				//console.log(successfulData);
				setFavoritePropertiesFetched(successfulData);
				setLoadingFavorites(false); // Stop loading
			} catch (error) {
				console.error("Failed to fetch some favorite properties", error);
				setLoadingFavorites(false);
			}
		};
		fetchFavoriteProperties();
		// if (localStorage.getItem("Renter") !== null) {
		// }
	}, []);

	const propertyDetails = async (event: React.MouseEvent, _id: string) => {
		event.preventDefault();
		routerToGoToSpecificPropertyPage.push(`/properties-for-rent/${_id}`);
	};

	const addPropertyToFavorites = async (event: React.MouseEvent, propertyID: string) => {
		if (localStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${localStorage.getItem("User")}`);

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
				localStorage.setItem("User", JSON.stringify(request.data));
				//location.reload();
				//console.log(request);
			} catch (error) {
				console.log(error);
			}
		} else {
			routerToGoToLogIn.push("/login");
		}

		// console.log(token);
		// console.log(userID);
	};

	// const removePropertyFromFavorites = async (event: React.MouseEvent, propertyID: string) => {
	// 	if (localStorage.getItem("Renter") !== null) {
	// 		const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);

	// 		const token = `Bearer ${storedRenterData.data.token}`;
	// 		const userID = storedRenterData.data.renterWithoutPassword._id;

	// 		const formData = {
	// 			userID: userID,
	// 			propertyID: propertyID,
	// 		};

	// 		try {
	// 			const request = await axios.post(
	// 				`${API_URL}renters/properties/remove-from-favorites`,
	// 				formData,
	// 				{
	// 					headers: {
	// 						"Content-Type": "application/json",
	// 						Authorization: token,
	// 					},
	// 				},
	// 			);
	// 			localStorage.setItem("Renter", JSON.stringify(request.data));
	// 			location.reload();
	// 			console.log(request);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	} else {
	// 		routerToGoToLogIn.push("/login");
	// 	}
	// };

	return (
		<main className="p-2">
			<NavBar />
			{/* {loadingFavorites ? (
				<h1>Loading Favorites...</h1>
			) : (
				<div>
					<h1>Revisit your favorites</h1>
					<div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
						{favoritePropertiesFetched?.length > 0 ? (
							favoritePropertiesFetched.map((favoritePropertyFetched) => (
								<div key={favoritePropertyFetched._id} className="relative">
									<HeartIcon
										className="size-7 absolute top-2 right-2 text-red-500 fill-red-500"
										onClick={(event) => removePropertyFromFavorites(event, favoritePropertyFetched._id)}
									/>
									<div
										className="w-fit border-2 border-gray-100 rounded-3xl p-1"
										onClick={(event) => {
											propertyDetails(event, favoritePropertyFetched._id);
										}}
									>
										<Image
											className="rounded-3xl border-2 border-gray-100"
											src={favoritePropertyFetched.images}
											alt={`Image of ${favoritePropertyFetched.name}`}
											width={200}
											height={200}
										/>
										<div className="px-2 flex items-baseline justify-between py-2">
											<h1 className="font-semibold text-sm">{favoritePropertyFetched.name}</h1>
											<p className="text-xs">{favoritePropertyFetched.price}</p>
										</div>
									</div>
								</div>
							))
						) : (
							<h1>No Favorites</h1>
						)}
					</div>
				</div>
			)} */}
			{!loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					<h1>View Listings</h1>
					<div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
						{propertiesFetched?.length > 0 ? (
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
			)}
		</main>
	);
}
