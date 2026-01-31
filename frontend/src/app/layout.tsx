import type { Metadata } from "next";
import "./globals.css";
import Toast from "@/components/toast.component";

export const metadata: Metadata = {
	title: "Property Rental App (MVP for demonstration)",
	description: "An mvp of a property rental app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="bg-custom-white-50">
			<body>
				{children}
				<Toast />
			</body>
		</html>
	);
}
