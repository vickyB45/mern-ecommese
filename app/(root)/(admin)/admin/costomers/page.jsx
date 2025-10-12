"use client";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
import DataTableWraper from "@/components/Aplication/admin/DataTableWraper";
import DeleteAction from "@/components/Aplication/admin/DeleteAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {  DT_COSTOMERS_COLUMN } from "@/lib/Column";
import { columnConfig } from "@/lib/helperFunctions";
import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPannelRoute";
import React, { useCallback, useMemo } from "react";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: '', label: "Costomers" },
];

const ShowCostomer = () => {
  const columns = useMemo(() => columnConfig(DT_COSTOMERS_COLUMN), []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
        
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="gap-0">
        <CardHeader className="border-b pb-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Costomers</h3>
           
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWraper
            queryKey="costomers-data"
            fetchUrl="/api/costomers"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/costomers/export"
            deleteEndpoint='/api/costomers/delete'
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=costomers`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCostomer;
