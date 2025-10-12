"use client";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
import DataTableWraper from "@/components/Aplication/admin/DataTableWraper";
import DeleteAction from "@/components/Aplication/admin/DeleteAction";
import EditAction from "@/components/Aplication/admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CATEGORY_COLUMN } from "@/lib/Column";
import { columnConfig } from "@/lib/helperFunctions";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_EDIT,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPannelRoute";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: '', label: "Category" },
];

const ShowCategory = () => {
  const columns = useMemo(() => columnConfig(DT_CATEGORY_COLUMN), []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <EditAction href={ADMIN_CATEGORY_EDIT(row.original._id)} key="edit" />,
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="gap-0">
        <CardHeader className="border-b pb-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Show Category</h3>
            <Button className="cursor-pointer flex items-center gap-1">
              <FiPlus />
              <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWraper
            queryKey="category-data"
            fetchUrl="/api/category"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/category/export"
            deleteEndpoint='/api/category/delete'
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCategory;
