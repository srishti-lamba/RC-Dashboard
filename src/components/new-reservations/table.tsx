import { useEffect, useMemo, useRef, useState } from "react";
import { NewReservationsType } from "./process-file";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
  MRT_TableInstance,
} from 'material-react-table';

interface TableProps {
    data : NewReservationsType[];
}

function Table({data} : TableProps) {

    const table = useRef<MRT_TableInstance<NewReservationsType>>(undefined)

    // ---------------
    // --- Columns ---
    // ---------------
    const columnHelper = createMRTColumnHelper<NewReservationsType>();

    const columns = useMemo(() => [
        // === Confirmation Number ===
        columnHelper.accessor((row : NewReservationsType) => Number(row.confirmationNumber), 
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