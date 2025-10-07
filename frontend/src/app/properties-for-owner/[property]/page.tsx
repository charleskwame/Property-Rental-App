"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PropertyInterFace } from "@/interfaces/property.interface";
import axios from "axios";
import { API_URL } from "@/config";
import Image from "next/image";

export default function SpecificProperty() {
	const params = useParams();
	const [property, setProperty] = useState<PropertyInterFace>();
	//const propertyRouter = useRouter();
	//const { _id } = propertyRouter.query;
	useEffect(() => {
		const propertyDetails = async (propertyID: string) => {
			//event.preventDefault();
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
			const token = `Bearer ${storedUserData.data.token}`;
			const ownerID = storedUserData.data.userWithoutPassword._id;
			// console.log(token);
			// console.log(_id);
			try {
				const request = await axios.get(`${API_URL}user/properties/${ownerID}/${propertyID}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				setProperty(request.data.message);
			} catch (error) {
				console.log(error);
			}
		};

		propertyDetails(`${params.property}`);
	}, [params.property]);
	//console.log(params);
	return (
		<>
			{property !== null ? (
				<div key={property?._id}>
					<h1>{property?.name}</h1>
					<h1>{property?.description}</h1>
					<h1>{property?.type}</h1>
					<h1>{property?.location}</h1>
					{property?.images && (
						<Image src={property.images[0]} alt={`Image of ${property.name}`} width={300} height={300} />
					)}
					{/* <Image src={property?.images} alt={`Image of ${property?.name}`} width={300} height={300} /> */}
				</div>
			) : (
				<h1>Property Not Found</h1>
			)}
		</>
	);
}
