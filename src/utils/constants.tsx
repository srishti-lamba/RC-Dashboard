import { ReservationAttributeNames } from "./interfaces"

export const reservationRawToDisplayNames : Record<string, string> = {
    "guestnum"   : "Confirmation Number", 
    "guestname"  : "Guest Name", 
    "status"     : "Status", 
    "sharew/ #"  : "Sharewith", 
    "arrivedate" : "Arrival Date", 
    "departdate" : "Departure Date", 
    "Nightsd"    : "Nights Stayed", 
    "ratesched"  : "Rate Code", 
    "roomrate"   : "Room Rate", 
    "accomcode"  : "Room Type", 
    "datecreate" : "Date Created", 
    "marketseg"  : "Market Segment", 
    "guesttype"  : "Guest Type", 
    "source"     : "Source", 
    "Revenue"    : "Revenue"
}
let resRawToDis = reservationRawToDisplayNames;

export const reservationAttributeToRawNames : ReservationAttributeNames = {
    confirmationNumber: "guestnum",
    firstName:          "guestname",
    lastName:           "guestname",
    status:             "status",
    shareWith:          "sharew/ #",
    arrivalDate:        "arrivedate",
    departureDate:      "departdate",
    nightsStayed:       "Nightsd",
    rateCode:           "ratesched",
    roomRate:           "roomrate",
    roomType:           "accomcode",
    dateCreated:        "datecreate",
    marketSegment:      "marketseg",
    guestType:          "guesttype",
    source:             "source",
    revenue:            "Revenue"
}
let resAttrToRaw = reservationAttributeToRawNames;

export const reservationAttributeToDisplayNames : ReservationAttributeNames = {
    confirmationNumber: resRawToDis[resAttrToRaw.confirmationNumber],
    firstName:          "First Name",
    lastName:           "Last Name",
    status:             resRawToDis[resAttrToRaw.status],
    shareWith:          resRawToDis[resAttrToRaw.shareWith],
    arrivalDate:        resRawToDis[resAttrToRaw.arrivalDate],
    departureDate:      resRawToDis[resAttrToRaw.departureDate],
    nightsStayed:       resRawToDis[resAttrToRaw.nightsStayed],
    rateCode:           resRawToDis[resAttrToRaw.rateCode],
    roomRate:           resRawToDis[resAttrToRaw.roomRate],
    roomType:           resRawToDis[resAttrToRaw.roomType],
    dateCreated:        resRawToDis[resAttrToRaw.dateCreated],
    marketSegment:      resRawToDis[resAttrToRaw.marketSegment],
    guestType:          resRawToDis[resAttrToRaw.guestType],
    source:             resRawToDis[resAttrToRaw.source],
    revenue:            resRawToDis[resAttrToRaw.revenue]
}
const resAttrToDis = reservationAttributeToDisplayNames;