export interface User {
	_id: string;
	name: string;
	email: string;
	password: string;
	phonenumber: string;
	usertype: string;
	isVerified: boolean;
	likedproperties: string[];
	propertiesowned: string[];
}
