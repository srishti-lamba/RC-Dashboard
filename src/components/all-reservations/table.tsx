import { useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_TableInstance,
} from 'material-react-table';
import { ReservationsType } from "../../utils/interfaces";

interface TableProps {
    data : ReservationsType[];
}

function Table({data} : TableProps) {

    const table = useRef<MRT_TableInstance<ReservationsType>>(undefined)

    // ---------------
    // --- Columns ---
    // ---------------
    const columnHelper = createMRTColumnHelper<ReservationsType>();

    const columns = useMemo(() => [
        // === Confirmation Number ===
        columnHelper.accessor((row : ReservationsType) => Number(row.confirmationNumber), 
        {
            id: "confirmationNumber", 
            header: "Confirmation Number"
        }),
        // === First Name ===
        columnHelper.accessor('firstName', { header: 'First Name', }),
        // === Last Name ===
        columnHelper.accessor('lastName',  { header: 'Last Name', }),
    ],[]);

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
    layoutMode: 'grid-no-grow',
    enableFacetedValues: true,
    initialState: { density: 'compact' },
    positionToolbarAlertBanner: 'none',
  });

    

    return (
        <MaterialReactTable table={table.current} />
    )
}

export default Table;