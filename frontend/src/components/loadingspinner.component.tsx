type LoadingMessage = {
	message: string;
};

export default function LoadingSpinner({ message }: LoadingMessage) {
	return (
		<>
			<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center flex-col justify-center">
				<div
					className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-fuchsia-800 motion-reduce:animate-[spin_1.5s_linear_infinite]"
					role="status"></div>
				<span className="text-fuchsia-800 font-semibold text-sm">{message}</span>
			</div>
		</>
	);
}
