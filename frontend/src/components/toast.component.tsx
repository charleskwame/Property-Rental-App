import { ToastContainer } from "react-toastify";

export default function Toast() {
	return (
		<ToastContainer
			autoClose={3000}
			hideProgressBar={false}
			newestOnTop={true}
			closeOnClick={true}
			rtl={false}
			pauseOnFocusLoss={false}
			draggable={true}
			pauseOnHover={true}
			limit={3}
			className="text-xs font-semibold"
			position="top-right"
			theme="light"
		/>
	);
}
