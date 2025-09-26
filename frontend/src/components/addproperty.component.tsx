"use client";
import { useEffect, useState } from "react";
import axios from "axios";
//import { API_URL, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_URL } from "../../config/env";
import { CldUploadWidget } from "next-cloudinary";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, SubmitHandler, set } from "react-hook-form";
import propertyTypeOptions from "@/propertytypes";
import { toast } from "react-toastify";
import { Locations } from "@/lib/cities";

type PropertyInputs = {
	name?: string;
	location?: string;
	type?: string | undefined;
	description?: string;
	images?: string[];
	price?: string;
	owner?: string;
};
export default function AddProperty() {
	//const routerToGoBackToLogIn = useRouter();
	// const [propertyName, setPropertyName] = useState<string>("");
	// const [propertyLocation, setPropertyLocation] = useState<string>("");
	// const [propertyType, setPropertyType] = useState<string>("");
	// const [propertyDescription, setPropertyDescription] = useState<string>("");
	const [propertyImages, setPropertyImages] = useState<File[]>([]);
	// const [propertyImageLinks, setPropertyImageLinks] = useState<string[]>([]);
	// const [propertyPrice, setPropertyPrice] = useState<string>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PropertyInputs>();

	const addProperty = async (propertyData: PropertyInputs) => {
		// console.log(propertyData);
		// return;
		const uploadedImages = await uploadFilesToCloudinary(); // ← now gets the result directly
		propertyData.images = uploadedImages;

		propertyData.owner = JSON.parse(`${sessionStorage.getItem("User")}`).data.userWithoutPassword._id;
		//console.log("Final property data:", propertyData);

		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

		//console.log(propertyData);

		try {
			const token = `Bearer ${storedUserData.data.token}`;
			console.log(token);
			const request = await axios.post(`${API_URL}user/add-properties`, propertyData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			toast.info("Adding property");
			//console.log(propertyImageLink);
			if (request.data.status === "Success") {
				toast.success("Property Added");
				location.reload();
				// console.log("Property Added");
				// console.log(request.data);
			} else {
				toast.error("Failed to add property");
				location.reload();
				// console.log("Failed to add property");
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to add property");
			location.reload();
		}
	};

	const uploadFilesToCloudinary = async (): Promise<string[]> => {
		if (propertyImages.length === 0) return [];

		const uploadedUrls: string[] = [];

		for (const image of propertyImages) {
			const imageData = new FormData();
			imageData.append("file", image);
			imageData.append("upload_preset", "rentalpropertyupload");

			const response = await axios.post(
				"https://api.cloudinary.com/v1_1/dmiy3wi6r/image/upload",
				imageData,
			);
			toast.info("Uploading images");
			if (response.status === 200) {
				uploadedUrls.push(response.data.secure_url);
				toast.success("Images uploaded successfully");
			} else {
				toast.error("Failed to upload images");
				console.error("Failed to upload images:", response.data);
			}
		}

		return uploadedUrls;
	};

	const loadImages = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

		setPropertyImages(imageFiles);
	};

	const numberofFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (event.target.files && event.target.files.length > 4) {
			toast.error("Maximum 4 files allowed, Please try again");
			// alert("Maximum 4 files allowed, Please try again");
			event.target.value = "";
			setPropertyImages([]);
		}
	};

	const fileSizeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		for (const file of event.target.files!) {
			if (file.size > 1 * 1024 * 1024) {
				// alert("One or More files filesize exceeds 1MB");
				toast.error("One or More files filesize exceeds 1MB");
				event.target.value = "";
				setPropertyImages([]);
				return;
			}
		}
	};

	return (
		<>
			<form action="" onSubmit={handleSubmit(addProperty)} className="text-gray-500 p-3">
				<div>
					<h2 className="text-lg font-bold mb-2 text-center text-fuchsia-800">Add new property</h2>
					<div className="lg:flex items-center gap-1">
						<div className="lg:w-1/2">
							<label htmlFor="name" className="text-xs">
								Property Name
								{errors.name && <span className="text-red-500 text-xs"> ({errors.name.message}) </span>}
							</label>
							<input
								id="name"
								className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
								type="text"
								placeholder="Property Name"
								{...register("name", {
									required: { value: true, message: "Name is required" },
									pattern: { value: /^[a-zA-Z\s]+$/, message: "Only characters are allowed" },
									minLength: { value: 3, message: "Minimum 3 characters" },
									maxLength: { value: 50, message: "Maximum 50 characters" },
								})}
							/>
						</div>

						<div className="lg:w-1/2">
							<label htmlFor="location" className="text-xs">
								Property Location
								{errors.location && (
									<span className="text-red-500 text-xs"> ({errors.location.message}) </span>
								)}
							</label>
							<select
								className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800 scroll-smooth"
								{...register("location", {
									required: { value: true, message: "Location is required" },
								})}>
								<option value="">Select Location</option>
								{Locations.map((location) => (
									<optgroup
										key={location.region}
										label={`${location.region}` + " Region"}
										className="bg-fuchsia-800/5">
										{location.cities.map((city) => (
											<option key={city} value={city}>
												{city}
											</option>
										))}
									</optgroup>
								))}
							</select>
						</div>
					</div>
					<div className="lg:flex items-center gap-1">
						<div className="lg:w-1/2">
							<label htmlFor="name" className="text-xs">
								Property Type
								{errors.type && <span className="text-red-500 text-xs"> ({errors.type.message}) </span>}
							</label>
							<select
								id="propertyType"
								className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800 scroll-smooth"
								{...register("type", {
									required: { value: true, message: "Type is required" },
								})}>
								<option value="">Select property type</option>
								{propertyTypeOptions.map((propertyOption) => {
									return (
										<option key={propertyOption.label} value={propertyOption.value}>
											{propertyOption.label}
										</option>
									);
								})}
							</select>
						</div>

						<div className="lg:w-1/2">
							<label htmlFor="price" className="text-xs">
								Property Price
								{errors.price && <span className="text-red-500 text-xs"> ({errors.price.message}) </span>}
							</label>
							<input
								id="price"
								className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
								type="text"
								placeholder="000"
								{...register("price", {
									required: { value: true, message: "Price is required" },
									pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Numbers only" },
									minLength: { value: 1, message: "Minimum 1 characters" },
									maxLength: { value: 10, message: "Maximum 10 characters" },
								})}
							/>
						</div>
					</div>

					<label htmlFor="description" className="text-xs mt-2">
						Property Description
						{errors.description && (
							<span className="text-red-500 text-xs"> ({errors.description.message}) </span>
						)}
					</label>
					<textarea
						placeholder="Describe your property"
						className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800 resize-none mb-1"
						{...register("description", {
							required: { value: true, message: "Description is required" },
						})}></textarea>

					<div className="">
						<label htmlFor="images" className="text-xs">
							Add Property Images (max number: 4, max size: 1MB)
							{errors.images && <span className="text-red-500 text-xs"> ({errors.images.message}) </span>}
						</label>
						<input
							className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800 resize-none"
							type="file"
							multiple
							accept="image/*"
							{...register("images", {
								required: "At least one image is required",
								validate: {
									isImage: (value) => {
										if (!value || typeof value === "string") return "Only image files are allowed";

										const files = Array.from(value as unknown as FileList);
										const allImages = files.every((file) => file.type.startsWith("image/"));

										return allImages || "Only image files are allowed";
									},
								},
							})}
							onChange={(event) => {
								numberofFilesSelected(event);
								fileSizeCheck(event);
								loadImages(event);
							}}
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						className="w-full bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 border-fuchsia-800 transition-all py-2 rounded text-white cursor-pointer text-xs mt-2 border-2">
						Add Property
					</button>
				</div>
			</form>
		</>
	);
}
