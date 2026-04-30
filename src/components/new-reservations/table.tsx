import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ReservationsType } from "../../utils/interfaces";
import {  reservationAttributeToDisplayNames as attrToDis } from "../../utils/constants";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_TableInstance,
} from 'material-react-table';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Date as DateExcel } from "read-excel-file/browser";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";

interface TableProps {
    data : ReservationsType[];
}

function Table({data} : TableProps) {

    const table = useRef<MRT_TableInstance<ReservationsType>>(undefined)

    // ---------------
    // --- Columns ---
    // ---------------
    const columnHelper = createMRTColumnHelper<ReservationsType>();

    const columns = useMemo(() => {
        let result : any[] = [];

        const getNumbers = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor(  (row : ReservationsType) =>  Number(row[attr as keyof ReservationsType]),  { 
                    id: attr, 
                    header: attrToDis[attr as keyof ReservationsType],
                    enableColumnFilterModes: false,
                } ))
            );
        };

        const getNumbers_filterAll = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor(  (row : ReservationsType) =>  Number(row[attr as keyof ReservationsType]),  { 
                    id: attr, 
                    header: attrToDis[attr as keyof ReservationsType],
                    enableColumnFilterModes: true,
                } ))
            );
        };

        const getNumbers_filterSome = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor(  (row : ReservationsType) =>  Number(row[attr as keyof ReservationsType]),  { 
                    id: attr, 
                    header: attrToDis[attr as keyof ReservationsType],
                    columnFilterModeOptions: ['equals', 'notEquals', 'between', 'betweenInclusive', 'greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo', 'empty', 'notEmpty'],
                    enableColumnFilterModes: true,
                } ))
            );
        };

        const getNumbers_null_filterSome = (attributes : string[]) => {
            attributes.forEach( attr => 
                result.push(columnHelper.accessor( (row : ReservationsType) => Number(row[attr as keyof ReservationsType]), { 
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
                result.push(columnHelper.accessor( (row : ReservationsType) => Number(row[attr as keyof ReservationsType]), { 
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
                    (row : ReservationsType) => 
                        new Date((row[attr as keyof ReservationsType] as unknown as DateExcel).toString()), 
                        { 
                            id: attr, 
                            header: attrToDis[attr as keyof ReservationsType], 
                            // filterVariant: 'date',
                            // filterFn: 'betweenInclusive',
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
                            // sortingFn: 'date',
                            Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
                            enableColumnFilterModes: false,
                        }
                ))
            );
        };

        getNumbers_filterAll(["confirmationNumber"]);
        getStrings_filter(["firstName", "lastName"]);
        getStrings_filterSelect(["status"]);
        getNumbers_null_filterSome(["shareWith"]);
        getDates(["arrivalDate", "departureDate"]);
        getNumbers_filterSome(["nightsStayed"]);
        getStrings_filter(["rateCode"]);
        getNumbers_currency_filter(["roomRate"]);
        getStrings_filterSelect(["roomType"]);
        getDates(["dateCreated"]);
        getStrings_filter(["marketSegment"]);
        getStrings_filterSelect(["guestType"]);
        getStrings_filter(["source"]);
        getNumbers_currency_filter(["revenue"]);

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
    // layoutMode: 'grid-no-grow',
    enableFacetedValues: true,
    initialState: { density: 'compact' },
    positionToolbarAlertBanner: 'none',
    enableColumnFilterModes: true,
    muiTableProps: {
        // size: "small",
    },
    defaultColumn: {
        size: 100
    },
    // columnFilterDisplayMode: 'popover',
    // filterFns: {
    //   customFilterFn: (row, id, filterValue) => {
    //     return row.getValue(id) === filterValue;
    //   },
    // },
  });

    

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table.current} />
        </LocalizationProvider>
    )
}

export default Table;