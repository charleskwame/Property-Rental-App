/* eslint-disable @next/next/no-img-element */
"use client";

//import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { PropertyInterFace } from "@/interfaces/property.interface";
import { User } from "@/interfaces/user.interface";
import Image from "next/image";
import NavBar from "@/components/navbar.component";
import { ArrowUpOnSquareIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function SpecificProperty() {
	//const pathName = usePathname();
	const params = useParams();
	const routerToGoToLogIn = useRouter();

	const [property, setProperty] = useState<PropertyInterFace>();
	const [user, setUser] = useState<User>();
	//const routerToGoToSpecificPropertyPage = useRouter();
	//const propertyRouter = useRouter();
	//const { _id } = propertyRouter.query;
	useEffect(() => {
		const propertyDetails = async (_id: string) => {
			//event.preventDefault();
			// const storedRenterData = JSON.parse(`${sessionStorage.getItem("Renter")}`);
			// const token = `Bearer ${storedRenterData.data.token}`;
			// console.log(token);
			// console.log(_id);
			try {
				const request = await axios.get(`${API_URL}user/properties/${_id}`, {
					headers: {
						"Content-Type": "application/json",
						//Authorization: token,
					},
				});
				if (request.status === 200) {
					const requestOwner = await axios.get(`${API_URL}user?ownerID=${request.data.message.owner}`, {
						headers: {
							"Content-Type": "application/json",
						},
					});
					if (requestOwner.status === 200) {
						setProperty(request.data.message);
						//console.log(requestOwner.data.data.userWithoutPassword);
						setUser(requestOwner.data.data.userWithoutPassword);
					}
				}
				//sessionStorage.setItem("PropertyInViewing", JSON.stringify(request.data.message));
			} catch (error) {
				console.log(error);
			}
			//routerToGoToSpecificPropertyPage.push(`/properties-for-rent/${_id}`);
		};

		propertyDetails(`${params.property}`);
	}, []);

	const addPropertyToFavorites = async (event: React.MouseEvent, propertyID: string) => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

			const token = `Bearer ${storedUserData.data.token}`;
			const userID = storedUserData.data.userWithoutPassword._id;

			const formData = {
				userID: userID,
				propertyID: propertyID,
			};

			try {
				const request = await axios.post(`${API_URL}user/properties/add-to-favorites`, formData, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				});
				if (request.status === 200) {
					alert("Property added to favorites");
				}
				sessionStorage.setItem("User", JSON.stringify(request.data));
				//location.reload();
				//console.log(request);
			} catch (error) {
				console.log(error);
			}
		} else {
			routerToGoToLogIn.push("/login");
		}

		// console.log(token);
		// console.log(userID);
	};
	//console.log(params);
	return (
		<>
			<NavBar />

			{property !== null ? (
				<main className="px-2 mt-5 lg:px-40">
					<div className="flex items-center justify-between my-2">
						<h1 className="font-semibold lg:text-xl">{property?.name}</h1>

						<div className="flex items-center justify-between">
							<div
								onClick={() => console.log(location.href)}
								className="cursor-pointer flex items-center gap-1 hover:bg-fuchsia-800/15 hover:text-fuchsia-800 transition-all ease-in-out duration-300 px-2 py-1 rounded-lg"
							>
								<ArrowUpOnSquareIcon className="size-5" />
								<p>Share</p>
							</div>
							<div
								onClick={(event) => addPropertyToFavorites(event, property!._id)}
								className="cursor-pointer flex items-center gap-1 hover:bg-fuchsia-800/15 hover:text-fuchsia-800 transition-all ease-in-out duration-300 px-2 py-1 rounded-lg"
							>
								<HeartIcon className="size-5" />
								<p>Favorite</p>
							</div>
						</div>
					</div>
					<div key={property?._id} className="">
						<div className="flex items-center justify-center">
							{property?.images && property.images.trim() !== "" && (
								<div className="lg:flex items-start justify-center gap-1">
									<div className="lg:w-[60%]">
										<img
											src={property.images}
											alt={`Image of ${property.name}`}
											// fill={true}
											className="rounded-lg lg:rounded-r-none"
										/>
									</div>
									<div className="grid mt-1 lg:mt-0 grid-cols-4 lg:grid-cols-2 gap-1 lg:w-[40%]">
										<img
											src={property.images}
											alt={`Image of ${property.name}`}
											// fill={true}

											className="rounded-l-lg lg:rounded-none"
										/>
										<img
											src={property.images}
											alt={`Image of ${property.name}`}
											// fill={true}

											className="lg:rounded-r-lg rounded-none"
										/>
										<img
											src={property.images}
											alt={`Image of ${property.name}`}
											// fill={true}

											className="rounded-none"
										/>
										<img
											src={property.images}
											alt={`Image of ${property.name}`}
											// fill={true}

											className="rounded-r-lg"
										/>
									</div>
								</div>
							)}
						</div>
						<div className="flex flex-col-reverse  lg:flex-row justify-between mt-2 gap-2 mb-5">
							<div className="bg-custom-white-50 lg:w-[70%] text-gray-500  p-2 py-2 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center justify-between">
										{/* <h1 className="font-semibold">Property Type</h1> */}
										<p className="text-sm text-black/50">Property Type: {property?.type}</p>
									</div>
									<div className="flex items-center justify-between">
										{/* <h1 className="font-semibold">Property Location</h1> */}
										<p className="text-sm text-black/50">Located at {property?.location}</p>
									</div>
								</div>
								<div>
									{/* <h1 className="font-semibold">Description</h1> */}
									<p className="text-sm text-black/50">
										{property?.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
										placeat suscipit similique asperiores blanditiis odio sunt eius? Impedit dolore, dolorum
										sequi doloremque laudantium repudiandae eaque esse quaerat molestiae, dolor voluptate!
										Incidunt perferendis commodi ex perspiciatis ea consequuntur accusantium blanditiis nihil
										deserunt dignissimos, iste nobis magni amet aliquid, quibusdam similique, quasi illum.
										Quibusdam, fuga ex minus ducimus eligendi nobis sed voluptatem! At, laborum sed esse natus
										dolor quidem incidunt porro, necessitatibus eius enim quisquam excepturi vitae maxime
										sequi facere assumenda! Ipsa blanditiis sit modi fugit, enim ea officia iure libero odit.
									</p>
								</div>
							</div>
							<div className="bg-custom-white-50 text-gray-500  p-2 py-2 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10 lg:w-[30%] h-fit">
								<p className="text-lg text-fuchsia-800 lg:text-xl font-bold">
									GHc{property?.price} <span className="text-sm text-black/50">/month</span>
								</p>

								{/* <h1 className="font-semibold">Owner</h1> */}
								<p className="text-sm text-black/50">Posted by {user?.name}</p>

								<button className="w-full mt-3 bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border transition-all py-2.5 rounded text-white cursor-pointer">
									Reserve Viewing
								</button>
							</div>

							{/* <div>
									<h1 className="font-semibold">Contact</h1>
									<p className="text-sm text-black/50">{user?.email}</p>
									<p className="text-sm text-black/50">{user?.phonenumber}</p>
								</div> */}
						</div>
					</div>
				</main>
			) : (
				<h1>Property Not Found</h1>
			)}
		</>
	);
}
