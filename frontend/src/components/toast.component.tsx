import { toast, ToastContainer } from "react-toastify";

type ToastProps = {
	type: "success" | "error" | "info" | "warn" | "default";
	message: string;
};

export default function Toast() {
	return (
		<ToastContainer
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick={true}
			limit={1}
			rtl={false}
			pauseOnFocusLoss
			draggable
			className={`text-xs font-semibold`}
		/>
	);
}
