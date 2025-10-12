import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig } from "export-to-csv";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import axios from "axios";

const DataTable = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globleFilter, setGlobleFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [rowSelection, setRowselection] = useState({});

  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);
  console.log(queryKey)

  const handleDelete = (selectedMedia, deleteType) => {
    const c = confirm(
      deleteType === "PD"
        ? "Are you sure? This media will be deleted permanently."
        : "Are you sure? You want to move data into trash"
    );
    if (c) {
      deleteMutation.mutate({ ids: selectedMedia, deleteType });
      setRowselection({});
    }
  };

  const handleExport = async (selectedRows) => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename: "csvData",
      });
      let csv;
      if (Object.keys(rowSelection).length > 0) {
        const rowData = selectedRows.map((row) => row.original);
        csv = generateCsv(csvConfig)(rowData);
      } else {
        const { data: response } = await axios.get(exportEndpoint);
        if (!response.success) throw new Error(response.message);
        csv = generateCsv(csvConfig)(response.data || []);
      }
      download(csvConfig)(csv);
    } catch (error) {
      console.log(error.message);
      showToast({ type: "error", message: "No Data Available"});
    } finally {
      setExportLoading(false);
    }
  };

  // Data fetching
  const queryResult = useQuery({
    queryKey: [queryKey, { columnFilters, globleFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);

      // ✅ FIX start / size
      url.searchParams.set("start", pagination.pageIndex * pagination.pageSize);
      url.searchParams.set("size", pagination.pageSize);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globleFilter", globleFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      url.searchParams.set("deleteType", deleteType);

      const { data: response } = await axios.get(url.href);
      return response;
    },
    placeholderData: keepPreviousData,
  });

  const data = queryResult?.data?.data || [];
  const meta = queryResult?.data?.meta || {};

  const table = useMaterialReactTable({
    columns: columnsConfig,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: queryResult.isError
      ? { color: "error", children: "Error Loading Data" }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobleFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta.totalRowCount || 0,
    onRowSelectionChange: setRowselection,
    state: {
      columnFilters,
      globleFilter,
      isLoading: queryResult.isLoading,
      pagination,
      showAlertBanner: queryResult.isError,
      showProgressBars: queryResult.isRefetching,
      sorting,
      rowSelection,
    },
    getRowId: (originalRow) => originalRow._id,
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {deleteType === "SD" && (
          <Tooltip title="Delete All">
            <IconButton
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        {deleteType === "PD" && (
          <>
            <Tooltip title="Restore Data">
              <IconButton
                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                onClick={() => handleDelete(Object.keys(rowSelection), "RSD")}
              >
                <RestoreFromTrashIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Permanently Delete Data">
              <IconButton
                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) => createAction(row, deleteType, handleDelete),
    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip>
        <Button className="cursor-pointer" type="button" onClick={() => handleExport(table.getSelectedRowModel().rows)} loading={exportLoading}>
          <ReplyAllIcon className="mr-2 text-4" /> Export
        </Button>
      </Tooltip>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default DataTable;
