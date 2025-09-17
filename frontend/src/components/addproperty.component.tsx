"use client";
import { useEffect, useState } from "react";
import axios from "axios";
//import { API_URL, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_URL } from "../../config/env";
import { CldUploadWidget } from "next-cloudinary";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddProperty() {
	//const routerToGoBackToLogIn = useRouter();
	const [propertyName, setPropertyName] = useState<string>("");
	const [propertyLocation, setPropertyLocation] = useState<string>("");
	const [propertyType, setPropertyType] = useState<string>("");
	const [propertyDescription, setPropertyDescription] = useState<string>("");
	const [propertyImage, setPropertyImage] = useState<File | undefined>(undefined);
	const [propertyImageLink, setPropertyImageLink] = useState<string>("");
	const [propertyPrice, setPropertyPrice] = useState<string>();

	const addProperty = async (event: React.FormEvent) => {
		console.log(propertyPrice);
		event.preventDefault();

		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		const propertyData = {
			name: propertyName,
			location: propertyLocation,
			type: propertyType,
			description: propertyDescription,
			images: propertyImageLink,
			price: propertyPrice,
			owner: storedUserData.data.userWithoutPassword._id,
		};

		try {
			loadFile(event);
			const token = `Bearer ${storedUserData.data.token}`;
			console.log(token);
			const request = await axios.post(`${API_URL}user/add-properties`, propertyData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			//console.log(propertyImageLink);
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
			if (request.status === 200) {
				console.log("Image Uploaded");
				setPropertyImageLink(request.data.secure_url);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<form action="" onSubmit={(event) => addProperty(event)} className="text-gray-500 p-4">
				<div>
					<h2 className="text-xl font-bold mb-2 text-center text-fuchsia-800">Add new property</h2>
					<div className="lg:flex items-center gap-1">
						<input
							id="name"
							className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
							type="text"
							placeholder="Property Name"
							required
							value={propertyName}
							onChange={(event) => setPropertyName(event?.target.value)}
						/>

						<input
							id="name"
							className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
							type="text"
							placeholder="Location of property"
							required
							value={propertyLocation}
							onChange={(event) => setPropertyLocation(event?.target.value)}
						/>
					</div>
					<div className="lg:flex items-center gap-1">
						<input
							id="name"
							className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
							type="text"
							placeholder="Type of property"
							required
							value={propertyType}
							onChange={(event) => setPropertyType(event?.target.value)}
						/>

						<input
							id="name"
							className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
							type="text"
							placeholder="000.00"
							required
							value={propertyPrice}
							onChange={(event) => setPropertyPrice(event?.target.value)}
						/>
					</div>

					<textarea
						name="description"
						placeholder="Describe your property"
						className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800 resize-none mb-1"
						value={propertyDescription}
						onChange={(event) => setPropertyDescription(event?.target.value)}
					></textarea>

					<input
						className="w-full border mb-2 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
						placeholder="Add Image"
						type="file"
						accept={`image/*`}
						onChange={(event) => {
							setPropertyImage(event.target.files?.[0]);
						}}
					/>
				</div>

				<div>
					<button
						type="submit"
						className="w-full bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border transition-all py-2.5 rounded text-white cursor-pointer"
					>
						Add Property
					</button>
				</div>
			</form>
		</>
	);
}
