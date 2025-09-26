export default function ImageGallerySkeletonLoader() {
	return (
		<div className="lg:flex items-start justify-center gap-1 animate-pulse w-full">
			{/* Main image skeleton */}
			<div className="lg:w-[60%]">
				<div className="rounded-lg bg-gray-300 w-full h-72"></div>
			</div>

			{/* Thumbnail skeletons */}
			<div className="grid mt-1 lg:mt-0 grid-cols-4 lg:grid-cols-2 gap-1 lg:w-[40%]">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className="rounded-lg bg-gray-300 w-full h-16 lg:h-20"></div>
				))}
			</div>
		</div>
	);
}
