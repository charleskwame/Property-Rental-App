"use client";

import AddProperty from "@/components/addproperty.component";
import MyProperties from "@/components/myproperties.components";
import NavBar from "@/components/navbar.component";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function PropertiesForOwner() {
	const routerToGoBackToLogIn = useRouter();
	const dialogRef = useRef(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		if (storedUserData === null) {
			routerToGoBackToLogIn.push("/login");
		}
	}, [routerToGoBackToLogIn]);

	const handleClickOpen = () => {
		setDialogOpen(true);
		(dialogRef.current as HTMLDialogElement | null)?.showModal();
	};

	const handleClose = () => {
		setDialogOpen(false);
		(dialogRef.current as HTMLDialogElement | null)?.close();
	};

	return (
		<>
			<NavBar />

			<div className="flex gap-2 mt-3 justify-center">
				<button
					onClick={() => handleClickOpen()}
					className="bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 border-fuchsia-800 border-2 transition-all py-0.5 rounded text-white cursor-pointer flex items-center px-3 gap-1 text-sm w-fit">
					<span>List property</span>
					<PlusCircleIcon className="size-4" />
				</button>

				<Link href={"/reservations-for-owner"}>
					<button className="bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 border-fuchsia-800 border-2 transition-all py-0.5 rounded text-white cursor-pointer flex items-center px-3 gap-1 text-sm w-fit">
						<span>Manage Reservations</span>
						<Edit2 className="size-4" />
					</button>
				</Link>
			</div>

			<dialog
				ref={dialogRef}
				open={dialogOpen}
				className="lg:max-w-1/2 rounded-2xl backdrop:bg-fuchsia-800/15 animate-fade w-[90%]">
				<XCircleIcon
					className="size-8 absolute top-0 right-0 text-orange-400 hover:text-red-500 cursor-pointer transition-all ease-in-out duration-300"
					onClick={() => {
						handleClose();
					}}
				/>
				<AddProperty />
			</dialog>
			<MyProperties />
		</>
	);
}
