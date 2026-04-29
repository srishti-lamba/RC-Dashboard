export interface ReservationsType {
    confirmationNumber : number;
    firstName : string;
    lastName : string;
    status : string;
    shareWith : number|null;
    arrivalDate : Date;
    departureDate : Date;
    nightsStayed : number;
    rateCode: string;
    roomRate: number;
    roomType: string;
    dateCreated : Date;
    marketSegment : string;
    guestType : string;
    source : string;
    revenue : number; 
}

export interface ReservationAttributeNames {
    confirmationNumber : string;
    firstName : string;
    lastName : string;
    status : string;
    shareWith : string;
    arrivalDate : string;
    departureDate : string;
    nightsStayed : string;
    rateCode: string;
    roomRate: string;
    roomType: string;
    dateCreated : string;
    marketSegment : string;
    guestType : string;
    source : string;
    revenue : string; 
}