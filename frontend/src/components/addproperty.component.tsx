"use client";
import { useState } from "react";
import axios from "axios";
//import { API_URL, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_URL } from "../../config/env";
import { CldUploadWidget } from "next-cloudinary";
import { API_URL } from "@/config";

export default function AddProperty() {
	const [propertyName, setPropertyName] = useState<string>("");
	const [propertyLocation, setPropertyLocation] = useState<string>("");
	const [propertyType, setPropertyType] = useState<string>("");
	const [propertyDescription, setPropertyDescription] = useState<string>("");
	const [propertyImage, setPropertyImage] = useState<File | undefined>(undefined);
	const [propertyImageLink, setPropertyImageLink] = useState<string>("");

	const addProperty = async (event: React.FormEvent) => {
		event.preventDefault();

		const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);

		const token = `Bearer ${storedOwnerData.data.token}`;

		const propertyData = {
			name: propertyName,
			location: propertyLocation,
			type: propertyType,
			description: propertyDescription,
			images: propertyImageLink,
			owner: storedOwnerData.data.ownerWithoutPassword._id,
		};

		try {
			const request = await axios.post(`${API_URL}owners/add-properties`, propertyData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			console.log(propertyImageLink);
			loadFile(event);
			if (request.data.status === "Success") {
				console.log("Property Added");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const loadFile = async (event: React.FormEvent) => {
		event.preventDefault();
		const imageData = new FormData();

		imageData.append("file", propertyImage!);
		imageData.append("upload_preset", "rentalpropertyupload");
		try {
			const request = await axios.post(
				"https://api.cloudinary.com/v1_1/dmiy3wi6r/image/upload",
				imageData,
			);
			setPropertyImageLink(request.data.secure_url);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<h1>Add new properties</h1>
			<form action="" onSubmit={(event) => addProperty(event)}>
				<label htmlFor="">name</label>
				<input
					type="text"
					value={propertyName}
					onChange={(event) => setPropertyName(event.target.value)}
				/>
				<label htmlFor="">location</label>
				<input
					type="text"
					value={propertyLocation}
					onChange={(event) => setPropertyLocation(event.target.value)}
				/>
				<label htmlFor="">type</label>
				<input
					type="text"
					value={propertyType}
					onChange={(event) => setPropertyType(event.target.value)}
				/>
				<label htmlFor="">description</label>
				<input
					type="text"
					value={propertyDescription}
					onChange={(event) => setPropertyDescription(event.target.value)}
				/>
				<label htmlFor="">image</label>
				<input
					type="file"
					accept={`.png,.jpeg`}
					onChange={(event) => {
						setPropertyImage(event.target.files?.[0]);
					}}
				/>
				<img src={propertyImage} alt="" />

				<button onClick={(event) => loadFile(event)}>Add Image</button>
				<button>Add Property</button>
			</form>
		</>
	);
}
