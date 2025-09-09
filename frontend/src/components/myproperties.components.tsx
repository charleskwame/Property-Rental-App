import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MyProperties() {
	const [loading, setLoading] = useState<boolean>(false);
	const [propertiesLoaded, setPropertiesLoaded] = useState<PropertyInterFace[]>([]);
	const routerToGoToSpecificPropertyPage = useRouter();
	useEffect(() => {
		if (localStorage.getItem("Owner") !== null) {
			const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);
			const token = `Bearer ${storedOwnerData.data.token}`;

			const userID = storedOwnerData.data.ownerWithoutPassword._id;
			const getMyProperties = async () => {
				try {
					const request = await axios.get(`${API_URL}owners/properties/${userID}`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: token,
						},
					});
					if (request.data.status === "Success") {
						setLoading(!loading);
						setPropertiesLoaded(request.data.message);
					}
					//console.log(request);
				} catch (error) {
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
			{loading === false ? (
				<h1>Loading...</h1>
			) : (
				<div>
					{propertiesLoaded?.length > 0 ? (
						propertiesLoaded.map((propertyLoaded) => (
							<div
								key={propertyLoaded._id}
								onClick={(event) => propertyDetails(event, propertyLoaded._id)}
							>
								<h1>{propertyLoaded.name}</h1>
								<Image
									src={propertyLoaded.images}
									width={300}
									height={300}
									alt={`Picture of ${propertyLoaded.name}`}
								/>
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
