"use client";

import AddProperty from "@/components/addproperty.component";
import MyProperties from "@/components/myproperties.components";
import NavBar from "@/components/navbar.component";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

export default function PropertiesForOwner() {
	const routerToGoBackToLogIn = useRouter();
	const dialogRef = useRef(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		if (storedUserData === null) {
			routerToGoBackToLogIn.push("/login");
		}
	}, []);

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

			<button
				onClick={() => handleClickOpen()}
				className="bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border transition-all py-1.5 rounded text-white cursor-pointer mx-auto block mt-3 px-5"
			>
				Add Property
			</button>

			<dialog
				ref={dialogRef}
				open={dialogOpen}
				className="lg:max-w-1/2 rounded-2xl backdrop:bg-fuchsia-800/15 animate-fade w-[90%]"
			>
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
