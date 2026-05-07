import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DuplicateType, ReservationsType } from "../../utils/interfaces";
import {  reservationAttributeToDisplayNames as attrToDis, dbNames } from "../../utils/constants";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_TableInstance,
} from 'material-react-table';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Date as DateExcel } from "read-excel-file/browser";
import { DatabaseContext, Dictionary } from "../../utils/context";

interface TableProps {
    timestamp : Date|undefined;
}

function Table({timestamp} : TableProps) {

    const table = useRef<MRT_TableInstance<DuplicateType>>(undefined);
    const [data, setData] = useState<DuplicateType[]>([]);
    const database = useContext(DatabaseContext).database!;

    useEffect(() => {
        async function getData() {
            let result = await database.current?.getAllValues(dbNames.ALL_RESERVATIONS)
            if (result === undefined) {
                setData([]);
                return;
            }

            let newData : DuplicateType[] = []
            let firstNames : Record<string, ReservationsType[]> = {};
            let lastNames : Record<string, ReservationsType[]> = {};
            let bothNames : Record<string, ReservationsType[]> = {};

            result.forEach( (reservation : ReservationsType) => {
                let fName = reservation.firstName;
                let lName = reservation.lastName;
                let bName = lName + ", " + fName;

                let hasBName = (bName in bothNames);
                let hasFName = (fName in firstNames);
                let hasLName = (lName in lastNames);

                // If already in both name
                if (hasBName) {
                    bothNames[bName].push(reservation);
                    return;
                }
                bothNames[bName] = [reservation]
                // If has both first and last name
                // If only has first name
                // If only has last name
            } )

            Object.values(bothNames).forEach( (reservations : ReservationsType[]) => {
                if (reservations.length == 1)
                    return
                let allCon : number[] = reservations.map(r=>r.confirmationNumber)
                let allArr : number[] = reservations.map(r=>r.arrivalDate.getUTCSeconds())
                let allDep : number[] = reservations.map(r=>r.departureDate.getUTCSeconds())

                let dup : DuplicateType = {
                    confirmationNumber: allCon,
                    reservations : reservations.length,
                    firstName: reservations[0].firstName,
                    lastName: reservations[0].lastName,
                    arrivalDate: new Date(Math.min(...allArr)),
                    departureDate: new Date(Math.max(...allDep))
                }
                // console.log(reservations)
                // console.log(dup)
                newData.push(dup)
            } ) 
        
            setData(newData)

        }
        getData();
    }, [timestamp])

    // ---------------
    // --- Columns ---
    // ---------------
    const columnHelper = createMRTColumnHelper<DuplicateType>();

    const columns = useMemo(() => {
        let result : any[] = [];

        const getNumbers = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor(  (row : DuplicateType) =>  Number(row[attr as keyof DuplicateType]),  { 
                    id: attr, 
                    header: attrToDis[attr as keyof ReservationsType],
                    enableColumnFilterModes: false,
                } ))
            );
        };

        const getNumbers_filterAll = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor(  (row : DuplicateType) =>  Number(row[attr as keyof DuplicateType]),  { 
                    id: attr, 
                    header: attrToDis[attr as keyof ReservationsType],
                    enableColumnFilterModes: true,
                } ))
            );
        };

        const getNumbers_filterSome = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor(  (row : DuplicateType) =>  Number(row[attr as keyof DuplicateType]),  { 
                    id: attr, 
                    header: attrToDis[attr as keyof ReservationsType],
                    columnFilterModeOptions: ['equals', 'notEquals', 'between', 'betweenInclusive', 'greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo', 'empty', 'notEmpty'],
                    enableColumnFilterModes: true,
                } ))
            );
        };

        const getNumbers_reservations_filterSome = () => {
            
                result.push(columnHelper.accessor(  (row : DuplicateType) =>  Number(row.confirmationNumber.length),  { 
                    id: "reservations", 
                    header: "Reservations",
                    columnFilterModeOptions: ['equals', 'notEquals', 'between', 'betweenInclusive', 'greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo', 'empty', 'notEmpty'],
                    enableColumnFilterModes: true,
                } ))
        };

        const getNumbers_null_filterSome = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor( (row : DuplicateType) => Number(row[attr as keyof DuplicateType]), { 
                    id: attr, 
                    header: attrToDis[attr as keyof ReservationsType],
                    Cell: ({ cell }) => cell.getValue() === 0 ? "" : cell.getValue().toString(),
                    columnFilterModeOptions: ['equals', 'notEquals', 'between', 'betweenInclusive', 'greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo', 'empty', 'notEmpty'],
                    enableColumnFilterModes: true,
                } ) )
            );
        };

        const getNumbers_currency_filter = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor( (row : DuplicateType) => Number(row[attr as keyof DuplicateType]), { 
                    id: attr, 
                    header: attrToDis[attr as keyof ReservationsType],
                    Cell: ({ cell }) => `$${cell.getValue().toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                    enableColumnFilterModes: true,
                } ) )
            );
        };

        const getStrings = (attributes : string[]) => {
            attributes.forEach( (attr) => 
                result.push(columnHelper.accessor(attr as any, {
                    header: attrToDis[attr as keyof ReservationsType],
                    enableColumnFilterModes: false,
                } ) )
            );
        };

        const getStrings_filter = (attributes : string[]) => {
            attributes.forEach( (attr) => 
                result.push(columnHelper.accessor(attr as any, {
                    header: attrToDis[attr as keyof ReservationsType],
                    columnFilterModeOptions: ['fuzzy', 'contains', 'startsWith', 'endsWith'],
                    enableColumnFilterModes: true,
                } ) )
            );
        };

        const getStrings_filterSelect = (attributes : string[]) => {
            attributes.forEach( (attr) => 
                result.push(columnHelper.accessor(
                    attr as any, 
                    { 
                        header: attrToDis[attr as keyof ReservationsType], 
                        filterVariant: 'multi-select',
                        enableColumnFilterModes: false,
                    } 
                ) )
            );
        };

        const getDates = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor( 
                    (row : DuplicateType) => 
                        new Date((row[attr as keyof DuplicateType] as unknown as DateExcel).toString()), 
                        { 
                            id: attr, 
                            header: attrToDis[attr as keyof ReservationsType],
                            filterVariant: 'date-range',
                            filterFn: (row, id, filterValue) => {
                                const [start, end] = filterValue;
                                const startDate = new Date(start);
                                const endDate = new Date(end);
                                const rowValue = new Date(row.getValue(id));
                                if (!start && !end) return true;
                                if (start && !end) return rowValue.toDateString() == startDate.toDateString();
                                if (!start && end) return rowValue <= endDate;
                                return rowValue >= startDate && rowValue <= endDate;
                            },
                            Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
                            enableColumnFilterModes: false,
                        }
                ))
            );
        };

        getNumbers_reservations_filterSome();
        getStrings_filter(["firstName", "lastName"]);
        getDates(["arrivalDate", "departureDate"]);

        return result;
    },[]);

// -------------
// --- Table ---
// -------------

table.current = useMaterialReactTable({
    columns,
    data,
    enablePagination: false,
    enableBottomToolbar: false,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    initialState: { density: 'compact' },
    positionToolbarAlertBanner: 'none',
    enableColumnFilterModes: true,
    defaultColumn: {
        size: 100
    },
  });

    

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table.current} />
        </LocalizationProvider>
    )
}

export default Table;