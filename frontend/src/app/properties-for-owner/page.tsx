"use client";

import AddProperty from "@/components/addproperty.component";
import MyProperties from "@/components/myproperties.components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PropertiesForOwner() {
	const routerToGoBackToLogIn = useRouter();

	useEffect(() => {
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		if (storedUserData === null) {
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
