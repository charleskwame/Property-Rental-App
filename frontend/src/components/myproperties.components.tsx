import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./loadingspinner.component";
import { TrashIcon, CheckCircleIcon, XCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

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
			const request = await axios.delete(`${API_URL}user/properties/${ownerID}/${propertyID}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});

			if (request.status === 200) {
				console.log("Deleted Successfully");
				setOpenDeleteDialog(false);
				toast.success("Property Deleted Successfully");
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
	return (
		<>
			{loading ? (
				<LoadingSpinner message={"Loading Properties"} />
			) : (
				<div
					className={
						propertiesLoaded.length > 0 ? `grid grid-cols-2 lg:grid-cols-6 gap-2 mt-5 px-2` : ""
					}>
					{propertiesLoaded?.length > 0 ? (
						propertiesLoaded.map((propertyLoaded) => (
							<>
								<div key={propertyLoaded._id} className="relative w-fit">
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
										className="absolute bottom-10 right-0 bg-red-500 text-white p-1 rounded-md hover:text-red-500 hover:bg-white hover:border-red-500 border border-red-500 transition-all ease-in-out duration-300 cursor-pointer"
										onClick={() => {
											openUpdateDialogFunction();
											setPropertyToBeUpdated(propertyLoaded);
										}}>
										<PencilIcon className="size-6" />
									</button>

									<button
										className="absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-md hover:text-red-500 hover:bg-white hover:border-red-500 border border-red-500 transition-all ease-in-out duration-300 cursor-pointer"
										onClick={() => {
											openDeleteDialogFunction();
											setPropertyToBeDeleted(propertyLoaded);
										}}>
										<TrashIcon className="size-6" />
									</button>
								</div>
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
								<dialog ref={updateDialogRef} open={openUpdateDialog}>
									<form action="">
										<label htmlFor="">Update property details</label>
										<input type="text" value={propertyLoaded?.name} />
										<input type="text" value={propertyLoaded?.location} />
										<input type="text" value={propertyLoaded?.price} />
										<input type="text" value={propertyLoaded?.type} />
										<input type="text" />
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
