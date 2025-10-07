// app/error.tsx
"use client";
export const runtime = "edge";

import { useEffect } from "react";

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error("Error captured by app/error.tsx:", error);
	}, [error]);

	return (
		<html>
			<body style={styles.container}>
				<h2 style={styles.title}>Something went wrong!</h2>
				<p style={styles.message}>{error.message}</p>
				<button style={styles.button} onClick={() => reset()}>
					Try again
				</button>
			</body>
		</html>
	);
}

const styles: { [key: string]: React.CSSProperties } = {
	container: {
		padding: "40px",
		textAlign: "center",
		fontFamily: "sans-serif",
		backgroundColor: "#fefefe",
		color: "#333",
	},
	title: {
		fontSize: "32px",
		marginBottom: "16px",
	},
	message: {
		fontSize: "18px",
		marginBottom: "24px",
	},
	button: {
		backgroundColor: "#0070f3",
		color: "#fff",
		border: "none",
		padding: "12px 20px",
		borderRadius: "6px",
		cursor: "pointer",
		fontSize: "16px",
	},
};
