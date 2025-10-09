import { ToastContainer } from "react-toastify";

// type ToastProps = {
// 	type: "success" | "error" | "info" | "warn" | "default";
// 	message: string;
// };

export default function Toast() {
	return (
		<ToastContainer
			autoClose={1000}
			hideProgressBar={true}
			newestOnTop={false}
			closeOnClick={true}
			limit={2}
			rtl={false}
			pauseOnFocusLoss
			draggable
			className={`text-xs font-semibold`}
			position="top-center"
		/>
	);
}
