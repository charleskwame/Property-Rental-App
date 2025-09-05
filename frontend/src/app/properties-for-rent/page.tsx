"use client";

import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PropertiesForRent() {
	const routerToGoBackToLogIn = useRouter();

	const [propertiesFetched, setPropertiesFetched] = useState<PropertyInterFace[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		const getProperties = async () => {
			const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);

			if (storedRenterData === null) {
				routerToGoBackToLogIn.push("/login-renter");
			}

			try {
				const token = `Bearer ${storedRenterData.data.token}`;
				const request = await axios.get(`${API_URL}renters/properties`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});

				if (request.data.status === "Success") {
					setLoading(!loading);
					setPropertiesFetched(request.data.message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		getProperties();
	}, []);

	return (
		<>
			{!loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					{propertiesFetched?.length > 0 ? (
						propertiesFetched.map((property) => (
							<div key={property._id}>
								<h1>{property.name}</h1>
								<Image src={property.images} alt={`Image of ${property.name}`} width={200} height={200} />
							</div>
						))
					) : (
						<h1>No properties found</h1>
					)}
				</div>
			)}
		</>
	);
}
