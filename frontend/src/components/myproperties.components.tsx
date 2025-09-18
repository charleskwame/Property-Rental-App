import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./loadingspinner.component";

export default function MyProperties() {
	const [loading, setLoading] = useState<boolean>(false);
	const [propertiesLoaded, setPropertiesLoaded] = useState<PropertyInterFace[]>([]);
	const routerToGoToSpecificPropertyPage = useRouter();
	useEffect(() => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
			const token = `Bearer ${storedUserData.data.token}`;

			const userID = storedUserData.data.userWithoutPassword._id;
			const getMyProperties = async () => {
				try {
					setLoading(true);
					const request = await axios.get(`${API_URL}user/properties?ownerID=${userID}`, {
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
				} catch (error) {
					setLoading(false);

					console.log(error);
				}
			};

			getMyProperties();
		}
	}, []);

	const propertyDetails = async (event: React.MouseEvent, _id: string) => {
		event.preventDefault();
		routerToGoToSpecificPropertyPage.push(`/properties-for-owner/${_id}`);
	};
	return (
		<>
			{loading ? (
				<LoadingSpinner message={"Loading Properties"} />
			) : (
				<div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mt-5 px-2">
					{propertiesLoaded?.length > 0 ? (
						propertiesLoaded.map((propertyLoaded) => (
							<div key={propertyLoaded._id} className="relative w-fit">
								{/* {sessionStorage.getItem("User") !== null && (
														<HeartIcon
															className="size-7 absolute top-2 right-2 fill-gray-200 hover:fill-red-500 hover:stroke-red-500 transition-all ease-in-out duration-300"
															onClick={(event) => addPropertyToFavorites(event, propertyFetched._id)}
														/>
													)} */}
								<div
									className="rounded-3xl"
									onClick={(event) => {
										propertyDetails(event, propertyLoaded._id);
									}}
								>
									<Image
										className="rounded-3xl border-2 border-gray-100 aspect-square"
										src={propertyLoaded.images}
										alt={`Image of ${propertyLoaded.name}`}
										width={200}
										height={200}
									/>
									<div className="px-2">
										<h1 className="font-semibold text-sm">{propertyLoaded.name} </h1>
										<p className="text-xs">GHc {propertyLoaded.price}</p>
									</div>
								</div>
							</div>
						))
					) : (
						<h1>No Properties Added Yet</h1>
					)}
				</div>
			)}
		</>
	);
}
