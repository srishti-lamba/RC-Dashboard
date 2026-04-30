import { Date as ExcelDate, readSheet } from 'read-excel-file/browser'
import { ReservationsType } from '../../utils/interfaces';
import { reservationAttributeToRawNames as attrToRaw } from '../../utils/constants';
import Database from '../../utils/database';

interface ProcessFileProps {
    selectedFile : any,
    setData : any;
}

function ProcessFile({selectedFile, setData} : ProcessFileProps) {

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
        var data : ReservationsType[] = []
        for (rowIndex; rowIndex < arrayData.length ; rowIndex++) {
            let rowArr = arrayData[rowIndex];

            // If dummy row, skip
            if (rowArr[header[attrToRaw.confirmationNumber]] == "G")
                continue

            let dummyDate = new Date(1999, 0, 1);
            let rowObj : ReservationsType = {
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
                {
                    let newDate = new Date((rowArr[header[rawName]] as ExcelDate).toString())
                    newDate.setHours(0, 0, 0, 0)
                    return newDate;
                }
                return dummyDate
            }

            // Confirmation Number
            rowObj.confirmationNumber = getNumber(attrToRaw.confirmationNumber);

            // Name
            if (header[attrToRaw.firstName] !== undefined) {
                let name = rowArr[header[attrToRaw.firstName]];
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

            rowObj.status        = getString(attrToRaw.status);
            rowObj.shareWith     = getNumber(attrToRaw.shareWith);
            rowObj.arrivalDate   = getDate  (attrToRaw.arrivalDate);
            rowObj.departureDate = getDate  (attrToRaw.departureDate);
            rowObj.nightsStayed  = getNumber(attrToRaw.nightsStayed);
            rowObj.rateCode      = getString(attrToRaw.rateCode);
            rowObj.roomRate      = getNumber(attrToRaw.roomRate);
            rowObj.roomType      = getString(attrToRaw.roomType);
            rowObj.dateCreated   = getDate  (attrToRaw.dateCreated);
            rowObj.marketSegment = getString(attrToRaw.marketSegment);
            rowObj.guestType     = getString(attrToRaw.guestType);
            rowObj.source        = getString(attrToRaw.source);
            rowObj.revenue       = getNumber(attrToRaw.revenue);

            data.push(rowObj);
        }

        setData(data);

        // -----------------------
        // --- Update Database ---
        // -----------------------

        const db = new Database('rc-dashboard');
        await db.createObjectStore_newReservations();
        await db.putBulkValue_reservations('newReservations', data);
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