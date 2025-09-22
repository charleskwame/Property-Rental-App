"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import axios from "axios";
import { PropertyInterFace } from "@/interfaces/property.interface";
import NavBar from "@/components/navbar.component";
import LoadingSpinner from "@/components/loadingspinner.component";
import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Toast from "@/components/toast.component";

export default function FavoriteProperties() {
	const [loading, setLoading] = useState<boolean>(false);
	const [propertiesLoaded, setPropertiesLoaded] = useState<PropertyInterFace[]>([]);
	const routerToGoToLogIn = useRouter();

	useEffect(() => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
			const token = `Bearer ${storedUserData.data.token}`;
			const userID = storedUserData.data.userWithoutPassword._id;
			const getFavoriteProperties = async () => {
				try {
					setLoading(true);
					const request = await axios.get(`${API_URL}user/favorites/${userID}`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: token,
						},
					});
					if (request.data.status === "Success") {
						//toast.success("Favorites Loaded");
						setPropertiesLoaded(request.data.message);
						setLoading(false);
					}
					//console.log(request);
					setLoading(false);
				} catch (error) {
					toast.error("Failed to load favorites");
					console.log(error);
					setLoading(false);
				}
			};
			getFavoriteProperties();
		}
	}, []);

	const removePropertyFromFavorites = async (event: React.MouseEvent, propertyID: string) => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

			const token = `Bearer ${storedUserData.data.token}`;
			const userID = storedUserData.data.userWithoutPassword._id;

			const formData = {
				userID: userID,
				propertyID: propertyID,
			};

			try {
				const request = await axios.post(`${API_URL}user/properties/remove-from-favorites`, formData, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				sessionStorage.setItem("User", JSON.stringify(request.data));
				if (request.status === 200) {
					toast.success("Property removed from favorites");
					//alert("Property removed from favorites");
				}
				location.reload();
				// console.log(request);
			} catch (error) {
				toast.error("Failed to remove property from favorites");
				console.log(error);
			}
		} else {
			routerToGoToLogIn.push("/login");
		}
	};

	const propertyDetails = async (event: React.MouseEvent, _id: string) => {
		event.preventDefault();
		routerToGoToLogIn.push(`/properties-for-rent/${_id}`);
	};

	return (
		<>
			<NavBar />
			<Toast />
			{loading ? (
				<LoadingSpinner message={`Loading Favorites`} />
			) : (
				<div className="px-2 mt-5">
					<h1 className="mb-2 text-xl font-semibold text-fuchsia-800">Favorites</h1>
					<div className={propertiesLoaded.length > 0 ? `grid grid-cols-2 lg:grid-cols-6 gap-2` : ""}>
						{propertiesLoaded.length > 0 ? (
							propertiesLoaded.map((property) => (
								<div key={property._id} className="relative w-fit">
									<HeartIcon
										className="size-7 absolute top-2 right-2 fill-red-500 stroke-red-500 cursor-pointer"
										onClick={(event) => removePropertyFromFavorites(event, property._id)}
									/>
									<div
										className="rounded-3xl"
										onClick={(event) => {
											propertyDetails(event, property._id);
										}}>
										<Image
											className="rounded-3xl border-2 border-gray-100 aspect-square"
											src={property.images[0]}
											alt={`Image of ${property.name}`}
											width={200}
											height={200}
										/>
										<div className="px-2">
											<h1 className="font-semibold text-sm">{property.name}</h1>
											<p className="text-xs">GHc {property.price}</p>
										</div>

										<button
											className="border border-red-500 text-red-500 w-full py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all ease-in-out duration-300 mt-2 cursor-pointer"
											onClick={(event) => removePropertyFromFavorites(event, property._id)}>
											Remove Favorite
										</button>
									</div>
								</div>
							))
						) : (
							<h1 className="text-center text-xl font-semibold text-fuchsia-800 mt-10">
								No favorite properties found
							</h1>
						)}
					</div>
				</div>
			)}
		</>
	);
}
