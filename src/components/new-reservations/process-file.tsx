import { Date as ExcelDate, readSheet } from 'read-excel-file/browser'

export interface NewReservationsType {
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

interface DataNamesType {
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

interface ProcessFileProps {
    selectedFile : any,
    setData : any;
}

function ProcessFile({selectedFile, setData} : ProcessFileProps) {

    // const rawToDisplayNames = {
    //     "guestnum" : "Confirmation Number", 
    //     "guestname" : "Guest Name", 
    //     "status" : "Status", 
    //     "sharew/ #" : "Sharewith", 
    //     "arrivedate" : "Arrival Date", 
    //     "departdate" : "Departure Date", 
    //     "Nightsd" : "Nights Stayed", 
    //     "ratesched" : "Rate Code", 
    //     "roomrate" : "Room Rate", 
    //     "accomcode" : "Room Type", 
    //     "datecreate" : "Date Created", 
    //     "marketseg" : "Market Segment", 
    //     "guesttype" : "Guest Type", 
    //     "source" : "Source", 
    //     "Revenue" : "Revenue"
    // }

    const attributeToRawNames : DataNamesType = {
        confirmationNumber: "guestnum",
        firstName: "guestname",
        lastName: "guestname",
        status: "status",
        shareWith: "sharew/ #",
        arrivalDate: "arrivedate",
        departureDate: "departdate",
        nightsStayed: "Nightsd",
        rateCode: "ratesched",
        roomRate: "roomrate",
        roomType: "accomcode",
        dateCreated: "datecreate",
        marketSegment: "marketseg",
        guestType: "guesttype",
        source: "source",
        revenue: "Revenue"
    }

    async function onProcessFile(event : any) {
		let arrayData = await readSheet(selectedFile);

        // -------------------
        // --- Get Headers ---
        // -------------------
        let header : Record<string, number> = {}
        for (var rowIndex = 0; rowIndex < arrayData.length ; rowIndex++) {
            let hasGuestNum = arrayData[rowIndex].includes("guestnum");
            
            if (!hasGuestNum)
                continue;

            for (let colIndex = 0; colIndex < arrayData[rowIndex].length; colIndex ++) {
                header[ arrayData[rowIndex][colIndex] as string ] = colIndex;
            }

            rowIndex += 1;
            break;
        }

        // -----------------
        // --- Fill Data ---
        // -----------------
        var data : NewReservationsType[] = []
        for (rowIndex; rowIndex < arrayData.length ; rowIndex++) {
            let rowArr = arrayData[rowIndex];

            // If dummy row, skip
            if (rowArr[header[attributeToRawNames.confirmationNumber]] == "G")
                continue

            let dummyDate = new Date(1999, 0, 1);
            let rowObj : NewReservationsType = {
                confirmationNumber: 0, firstName: "", lastName: "",
                status: "", shareWith: null, nightsStayed: 0,
                arrivalDate: dummyDate, departureDate: dummyDate, dateCreated: dummyDate, 
                rateCode: "", roomRate: 0, roomType: "",
                marketSegment: "", guestType: "", source: "", revenue: 0
            }

            const getString = (rawName : string) => {
                if (header[rawName] !== undefined)
                    return rowArr[header[rawName]] as string;
                return ""
            }
            const getNumber = (rawName : string) => {
                if (header[rawName] !== undefined)
                    return rowArr[header[rawName]] as number;
                return 0
            }
            const getDate = (rawName : string) => {
                if (header[rawName] !== undefined)
                    return new Date((rowArr[header[rawName]] as ExcelDate).toString());
                return dummyDate
            }

            // Confirmation Number
            rowObj.confirmationNumber = getNumber(attributeToRawNames.confirmationNumber);

            // Name
            if (header[attributeToRawNames.firstName] !== undefined) {
                let name = rowArr[header[attributeToRawNames.firstName]];
                if (typeof name !== 'string')
                    continue;
                
                name = name.replace(
                    /\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() +
                            txt.slice(1).toLowerCase();
                        });
                let nameSplit = name.split(", ")
                if (nameSplit.length >= 0)
                    rowObj.lastName = nameSplit[0]
                if (nameSplit.length >= 1)
                    rowObj.firstName = nameSplit[1]
            }

            rowObj.status = getString(attributeToRawNames.status);
            rowObj.shareWith = getNumber(attributeToRawNames.shareWith);
            rowObj.arrivalDate = getDate(attributeToRawNames.arrivalDate);
            rowObj.departureDate = getDate(attributeToRawNames.departureDate);
            rowObj.nightsStayed = getNumber(attributeToRawNames.nightsStayed);
            rowObj.rateCode = getString(attributeToRawNames.rateCode);
            rowObj.roomRate = getNumber(attributeToRawNames.roomRate);
            rowObj.roomType = getString(attributeToRawNames.roomType);
            rowObj.dateCreated = getDate(attributeToRawNames.dateCreated);
            rowObj.marketSegment = getString(attributeToRawNames.marketSegment);
            rowObj.guestType = getString(attributeToRawNames.guestType);
            rowObj.source = getString(attributeToRawNames.source);
            rowObj.revenue = getNumber(attributeToRawNames.revenue);

            data.push(rowObj);
        }

        setData(data);
	};

    return (
        <div>
            <button
                onClick={onProcessFile}
            >
                Process File
            </button>
        </div>
    )

}

export default ProcessFile;