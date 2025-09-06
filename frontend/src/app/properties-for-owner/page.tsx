"use client";

import AddProperty from "@/components/addproperty.component";
import MyProperties from "@/components/myproperties.components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PropertiesForOwner() {
	const routerToGoBackToLogIn = useRouter();

	useEffect(() => {
		const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);
		if (storedOwnerData === null) {
			routerToGoBackToLogIn.push("/login-owner");
		}
	}, []);
	return (
		<>
			<AddProperty />
			<MyProperties />
		</>
	);
}
