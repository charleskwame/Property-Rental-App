"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import axios from "axios";
import { PropertyInterFace } from "@/interfaces/property.interface";
import NavBar from "@/components/navbar.component";
import LoadingSpinner from "@/components/loadingspinner.component";
import Image from "next/image";
import { BookmarkIcon, HeartIcon, HomeModernIcon, MapPinIcon } from "@heroicons/react/24/outline";
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
					<h1 className="mb-2 text-xl font-semibold text-fuchsia-800 flex items-center gap-1">
						<BookmarkIcon className="size-5 fill-fuchsia-800" />
						Saved Listings
					</h1>
					<div className={propertiesLoaded.length > 0 ? `grid grid-cols-2 lg:grid-cols-5 gap-2` : ""}>
						{propertiesLoaded.length > 0 ? (
							propertiesLoaded.map((property) => (
								<div key={property._id} className="relative w-fit cursor-pointer border-1 rounded-xl">
									{/* <div className="">
									</div> */}
									{/* <p className="text-xs ">
										Remove
									</p> */}
									<HeartIcon
										className="size-8 fill-fuchsia-800 stroke-fuchsia-800 cursor-pointer flex items-center absolute top-1 right-1 gap-1 border-2 border-fuchsia-800 p-1 bg-fuchsia-800/20 text-fuchsia-800 font-semibold rounded-lg hover:bg-fuchsia-800 hover:fill-white hover:stroke-white transtion-all duration-300 ease-in-out"
										onClick={(event) => removePropertyFromFavorites(event, property._id)}
									/>
									<div
										className="rounded-xl"
										onClick={(event) => {
											propertyDetails(event, property._id);
										}}>
										<Image
											className=" border-2 border-gray-100 object-cover rounded-t-xl"
											src={property.images[0]}
											alt={`Image of ${property.name}`}
											//fill
											width={400}
											height={200}
										/>
										<div className="p-1 border rounded-b-xl grid gap-1">
											<h1 className="font-semibold text-sm flex items-center gap-1 text-fuchsia-800">
												<HomeModernIcon className="size-4" />
												{property.name}
											</h1>
											<div className="flex items-center justify-between">
												<p className="text-xs flex items-center gap-1">
													<MapPinIcon className="size-3" />
													{property.location}
												</p>
												<p className="text-xs font-semibold text-fuchsia-800">
													GHc{property.price} <small className="text-black">/month</small>
												</p>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<h1 className="text-center text-xl font-semibold text-fuchsia-800 mt-10">
								You have not saved any listings to your account
							</h1>
						)}
					</div>
				</div>
			)}
		</>
	);
}

// <div key={property._id} className="relative w-fit cursor-pointer">
// 	<div
// 		className="rounded-3xl"
// 		onClick={(event) => {
// 			propertyDetails(event, property._id);
// 		}}>
// 		<Image
// 			className="rounded-3xl border-2 border-gray-100 aspect-square"
// 			src={property.images[0]}
// 			alt={`Image of ${property.name}`}
// 			width={200}
// 			height={200}
// 		/>
// 		<div className="px-2">
// 			<h1 className="font-semibold text-sm">{property.name}</h1>
// 			<p className="text-xs">GHc {property.price}</p>
// 		</div>

// 		<button
// 			className="border border-red-500 text-red-500 w-full py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all ease-in-out duration-300 mt-2 cursor-pointer"
// 			onClick={(event) => removePropertyFromFavorites(event, property._id)}>
// 			Remove Favorite
// 		</button>
// 	</div>
// </div>
