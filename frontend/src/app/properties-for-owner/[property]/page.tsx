"use client";

export const runtime = "edge";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PropertyInterFace } from "@/interfaces/property.interface";
import axios from "axios";
import { API_URL } from "@/config";
import Image from "next/image";

export default function SpecificProperty() {
	const params = useParams();
	const [property, setProperty] = useState<PropertyInterFace>();

	useEffect(() => {
		const propertyDetails = async (propertyID: string) => {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
			const token = `Bearer ${storedUserData.data.token}`;
			const ownerID = storedUserData.data.userWithoutPassword._id;

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
				</div>
			) : (
				<h1 className="text-center text-xs lg:text-lg font-semibold text-fuchsia-800 mt-10">
					Property Not Found
				</h1>
			)}
		</>
	);
}
