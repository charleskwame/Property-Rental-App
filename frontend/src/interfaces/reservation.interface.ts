export interface ReservationsLoaded {
	_id: string;
	madeBy: { clientID: string; clientName: string };
	date: string;
	propertyToView: { propertyID: string; propertyName: string };
	propertyOwner: { propertyOwnerID: string; propertyOwnerName: string };
	status: string;
	time: string;
}
