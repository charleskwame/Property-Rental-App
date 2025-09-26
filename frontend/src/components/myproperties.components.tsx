import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./loadingspinner.component";
import {
	TrashIcon,
	CheckCircleIcon,
	XCircleIcon,
	PencilIcon,
	MapPinIcon,
	HomeModernIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { Locations } from "@/lib/cities";
import propertyTypeOptions from "@/propertytypes";
//import {HomeIcon, MapPinIcon} from "@heroicons/react/24/outline";

type UpdateInputs = {
	name?: string;
	location?: string;
	type?: string;
	description?: string;
	price?: string;
};

export default function MyProperties() {
	const [loading, setLoading] = useState<boolean>(false);
	const dialogRef = useRef(null);
	const updateDialogRef = useRef(null);
	const [propertiesLoaded, setPropertiesLoaded] = useState<PropertyInterFace[]>([]);
	const routerToGoToSpecificPropertyPage = useRouter();
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
	const [propertyToBeDeleted, setPropertyToBeDeleted] = useState<PropertyInterFace>();
	const [propertyToBeUpdated, setPropertyToBeUpdated] = useState<PropertyInterFace>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateInputs>();

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
		routerToGoToSpecificPropertyPage.push(`/properties-for-rent/${_id}`);
	};

	const openDeleteDialogFunction = () => {
		setOpenDeleteDialog(true);
		(dialogRef.current as HTMLDialogElement | null)?.showModal();
	};

	const closeDeleteDialogFunction = () => {
		setOpenDeleteDialog(false);
		(dialogRef.current as HTMLDialogElement | null)?.close();
	};

	const deleteProperty = async (event: React.FormEvent, propertyID: string, ownerID: string) => {
		event.preventDefault();

		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		const token = `Bearer ${storedUserData.data.token}`;
		try {
			//console.log(propertyID + `is to be deleted`);
			const request = await axios.delete(
				`${API_URL}user/properties/${ownerID}/${propertyToBeDeleted?._id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				},
			);

			if (request.status === 200) {
				//console.log("Deleted Successfully");
				setOpenUpdateDialog(false);
				toast.success("Property Updated Successfully");
				location.reload();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const openUpdateDialogFunction = () => {
		setOpenUpdateDialog(true);
		(updateDialogRef.current as HTMLDialogElement | null)?.showModal();
	};

	const closeUpdateDialogFunction = () => {
		setOpenUpdateDialog(false);
		(updateDialogRef.current as HTMLDialogElement | null)?.close();
	};

	const handleUpdate = async (updateData: UpdateInputs) => {
		console.log(updateData);
		//event.preventDefault();

		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		const token = `Bearer ${storedUserData.data.token}`;
		//const ownerID = storedUserData.data.userWithoutPassword._id;
		try {
			//console.log(propertyID + `is to be deleted`);

			//console.log(token);
			// console.log(propertyToBeUpdated);
			// return;

			const request = await axios.put(
				`${API_URL}user/properties/update/${propertyToBeUpdated?._id}`,
				updateData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				},
			);

			if (request.status === 200) {
				// console.log("Deleted Successfully");
				setOpenUpdateDialog(false);
				toast.success("Property Updated Successfully");
				location.reload();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			{loading ? (
				<LoadingSpinner message={"Loading Properties"} />
			) : (
				<div
					className={
						propertiesLoaded.length > 0 ? `grid grid-cols-2 lg:grid-cols-5 gap-2 mt-5 px-2` : ""
					}>
					{propertiesLoaded?.length > 0 ? (
						propertiesLoaded.map((propertyLoaded) => (
							<>
								<div key={propertyLoaded._id} className="relative w-fit border-1 rounded-xl">
									{/* <div className="">
                                                                    </div> */}
									{/* <p className="text-xs ">
                                                                        Remove
                                                                    </p> */}
									{/* <HeartIcon
										className="size-8 fill-fuchsia-800 stroke-fuchsia-800 cursor-pointer flex items-center absolute top-1 right-1 gap-1 border-2 border-fuchsia-800 p-1 bg-fuchsia-800/20 text-fuchsia-800 font-semibold rounded-lg hover:bg-fuchsia-800 hover:fill-white hover:stroke-white transtion-all duration-300 ease-in-out"
										onClick={(event) => removePropertyFromFavorites(event, property._id)}
									/> */}
									<div
										className="rounded-xl"
										// onClick={(event) => {
										// 	propertyDetails(event, property._id);
										// }}
									>
										<Image
											className=" border-2 border-gray-100 object-cover rounded-t-xl"
											src={propertyLoaded.images[0]}
											alt={`Image of ${propertyLoaded.name}`}
											//fill
											width={400}
											height={200}
										/>
										<div className="p-1 border rounded-b-xl grid gap-1">
											<h1 className="font-semibold text-sm flex items-center gap-1 text-fuchsia-800">
												<HomeModernIcon className="size-4" />
												{propertyLoaded.name}
											</h1>
											<div className="flex items-center justify-between">
												<p className="text-xs flex items-center gap-1">
													<MapPinIcon className="size-3" />
													{propertyLoaded.location}
												</p>
												<p className="text-xs font-semibold text-fuchsia-800">
													GHc{propertyLoaded.price} <small className="text-black">/month</small>
												</p>
											</div>
										</div>
									</div>
									<button
										className="absolute -top-1 -right-1 bg-fuchsia-800 text-white p-1 rounded-md hover:text-fuchsia-800 hover:bg-white hover:border-fuchsia-800 border-2 border-fuchsia-800 transition-all ease-in-out duration-300 cursor-pointer"
										onClick={() => {
											openUpdateDialogFunction();
											setPropertyToBeUpdated(propertyLoaded);
										}}>
										<PencilIcon className="size-6" />
									</button>

									<button
										className="absolute -top-1 -left-1 bg-red-500 text-white p-1 rounded-md hover:text-red-500 hover:bg-white hover:border-red-500 border-2 border-red-500 transition-all ease-in-out duration-300 cursor-pointer"
										onClick={() => {
											openDeleteDialogFunction();
											setPropertyToBeDeleted(propertyLoaded);
										}}>
										<TrashIcon className="size-6" />
									</button>
								</div>
								{/* <div key={propertyLoaded._id} className="relative w-fit cursor-pointer">
									<div
										className="rounded-3xl"
										onClick={(event) => {
											propertyDetails(event, propertyLoaded._id);
										}}>
										<Image
											className="rounded-3xl border-2 border-gray-100 aspect-square"
											src={propertyLoaded.images[0]}
											alt={`Image of ${propertyLoaded.name}`}
											width={200}
											height={200}
										/>
										<div className="px-2">
											<h1 className="font-semibold text-sm">{propertyLoaded.name} </h1>
											<p className="text-xs">GHc {propertyLoaded.price}</p>
										</div>
									</div>

									<button
										className="absolute bottom-10 right-0 bg-fuchsia-800 text-white p-1 rounded-md hover:text-fuchsia-800 hover:bg-white hover:border-fuchsia-800 border-2 border-fuchsia-800 transition-all ease-in-out duration-300 cursor-pointer"
										onClick={() => {
											openUpdateDialogFunction();
											setPropertyToBeUpdated(propertyLoaded);
										}}>
										<PencilIcon className="size-6" />
									</button>

									<button
										className="absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-md hover:text-red-500 hover:bg-white hover:border-red-500 border-2 border-red-500 transition-all ease-in-out duration-300 cursor-pointer"
										onClick={() => {
											openDeleteDialogFunction();
											setPropertyToBeDeleted(propertyLoaded);
										}}>
										<TrashIcon className="size-6" />
									</button>
								</div> */}
								{/* Delete dialog */}
								<dialog
									ref={dialogRef}
									open={openDeleteDialog}
									className="lg:max-w-fit mx-auto rounded-2xl backdrop:bg-fuchsia-800/15 animate-fade w-[90%] border border-fuchsia-800/10 p-4">
									<form className="grid gap-2">
										<label
											htmlFor=""
											className="text-fuchsia-800 text-sm text-center font-semibold flex items-center justify-center gap-2">
											<TrashIcon className="size-6" />
											Delete Property {propertyToBeDeleted?.name}?
										</label>
										<div className="flex items-center justify-center gap-2">
											<button
												type="button"
												onClick={() => closeDeleteDialogFunction()}
												className="border-2 bg-fuchsia-800/20 px-5 py-1 text-fuchsia-800 hover:bg-fuchsia-800 hover:text-white rounded-md transition-all ease-in-out duration-300 flex items-center gap-2 border-fuchsia-800 cursor-pointer text-sm font-semibold">
												Cancel
												<XCircleIcon className="size-6" />
											</button>
											<button
												onClick={(event) =>
													deleteProperty(event, propertyToBeDeleted!._id, propertyToBeDeleted!.owner)
												}
												className="border-2 bg-red-500/20 px-5 py-1 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all ease-in-out duration-300 flex items-center gap-2 border-red-500 cursor-pointer text-sm font-semibold">
												Delete
												<CheckCircleIcon className="size-6" />
											</button>
										</div>
										<p className="text-xs text-red-500 font-bold text-center">This action cannot be undone</p>
									</form>
								</dialog>
								{/* update property */}
								<dialog
									ref={updateDialogRef}
									open={openUpdateDialog}
									className="lg:max-w-1/3 rounded-2xl backdrop:bg-fuchsia-800/15 animate-fade w-[90%]">
									<form
										action=""
										className="grid text-gray-500 p-3 gap-1"
										onSubmit={handleSubmit(handleUpdate)}>
										<h2 className="text-lg font-bold mb-2 text-center text-fuchsia-800">
											Update property details
										</h2>
										<div className="grid">
											<label htmlFor="name" className="text-xs">
												Property Name
												{errors.name && <span className="text-red-500 text-xs"> ({errors.name.message}) </span>}
											</label>
											<input
												type="text"
												defaultValue={propertyLoaded?.name}
												className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
												{...register("name", {
													required: { value: true, message: "Name is required" },
													pattern: { value: /^[a-zA-Z\s]+$/, message: "Only characters are allowed" },
													minLength: { value: 3, message: "Minimum 3 characters" },
													maxLength: { value: 50, message: "Maximum 50 characters" },
												})}
											/>
										</div>
										<div className="grid">
											<label htmlFor="name" className="text-xs">
												Property Type
												{errors.type && <span className="text-red-500 text-xs"> ({errors.type.message}) </span>}
											</label>
											<select
												id="propertyType"
												defaultValue={propertyLoaded?.type}
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
										<div className="grid">
											<label htmlFor="description" className="text-xs">
												Property Description
												{errors.description && (
													<span className="text-red-500 text-xs"> ({errors.description.message}) </span>
												)}
											</label>
											<textarea
												className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800 resize-none"
												defaultValue={propertyLoaded?.description}
												{...register("description", {
													required: { value: true, message: "Description is required" },
												})}></textarea>
										</div>
										<div className="grid">
											<label htmlFor="price" className="text-xs">
												Property Price
												{errors.price && (
													<span className="text-red-500 text-xs"> ({errors.price.message}) </span>
												)}
											</label>
											<input
												type="text"
												className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
												defaultValue={propertyLoaded?.price}
												{...register("price", {
													required: { value: true, message: "Price is required" },
													pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Numbers only" },
													minLength: { value: 1, message: "Minimum 1 characters" },
													maxLength: { value: 10, message: "Maximum 10 characters" },
												})}
											/>
										</div>
										<div className="flex items-center justify-center gap-2 mt-2">
											<button
												type="button"
												onClick={() => closeUpdateDialogFunction()}
												className="border-2 bg-fuchsia-800/20 px-5 py-1 text-fuchsia-800 hover:bg-fuchsia-800 hover:text-white rounded-md transition-all ease-in-out duration-300 flex items-center gap-2 border-fuchsia-800 cursor-pointer text-sm font-semibold w-full">
												Cancel Update
												<XCircleIcon className="size-6" />
											</button>
											<button
												type="submit"
												className="border-2 bg-red-500/20 px-5 py-1 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all ease-in-out duration-300 flex items-center gap-2 border-red-500 cursor-pointer text-sm font-semibold w-full">
												Update Details
												<CheckCircleIcon className="size-6" />
											</button>
										</div>
									</form>
								</dialog>
							</>
						))
					) : (
						<h1 className="text-center text-xl font-semibold text-fuchsia-800 mt-10">
							No properties added yet
						</h1>
					)}
				</div>
			)}
		</>
	);
}

{
	/* <input type="text" value={propertyLoaded?.location} /> */
}
{
	/* 
										<div className="lg:w-1/2">
											<label htmlFor="location" className="text-xs">
												Property Location
												{errors.location && (
													<span className="text-red-500 text-xs"> ({errors.location.message}) </span>
												)}
											</label>
											<select
												defaultValue={propertyLoaded?.location}
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
										</div> */
}
{
	/* <input type="text" value={propertyLoaded?.type} /> */
}
