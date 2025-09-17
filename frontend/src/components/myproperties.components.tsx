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
