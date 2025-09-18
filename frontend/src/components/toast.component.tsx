import { toast, ToastContainer } from "react-toastify";

type ToastProps = {
	type: "success" | "error" | "info" | "warn" | "default";
	message: string;
};

export default function Toast() {
	return (
		<ToastContainer
			position="top-center"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick={true}
			rtl={false}
			pauseOnFocusLoss
			draggable
			className={`text-xs font-semibold`}
		/>
	);
}
