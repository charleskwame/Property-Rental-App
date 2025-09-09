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
			const storedOwnerData = JSON.parse(`${sessionStorage.getItem("Owner")}`);
			const token = `Bearer ${storedOwnerData.data.token}`;
			const ownerID = storedOwnerData.data.ownerWithoutPassword._id;
			// console.log(token);
			// console.log(_id);
			try {
				const request = await axios.get(`${API_URL}owners/properties/${ownerID}/${propertyID}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				setProperty(request.data.message);
				//console.log(request.data.message);
				//sessionStorage.setItem("PropertyInViewing", JSON.stringify(request.data.message));
			} catch (error) {
				console.log(error);
			}
			//routerToGoToSpecificPropertyPage.push(`/properties-for-rent/${_id}`);
		};

		propertyDetails(`${params.property}`);
	}, []);
	//console.log(params);
	return (
		<>
			{property !== null ? (
				<div key={property?._id}>
					<h1>{property?.name}</h1>
					<h1>{property?.description}</h1>
					<h1>{property?.type}</h1>
					<h1>{property?.location}</h1>
					{property?.images && property.images.trim() !== "" && (
						<Image src={property.images} alt={`Image of ${property.name}`} width={300} height={300} />
					)}
					{/* <Image src={property?.images} alt={`Image of ${property?.name}`} width={300} height={300} /> */}
				</div>
			) : (
				<h1>Property Not Found</h1>
			)}
		</>
	);
}
