"use client";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
import DataTableWraper from "@/components/Aplication/admin/DataTableWraper";
import DeleteAction from "@/components/Aplication/admin/DeleteAction";
import EditAction from "@/components/Aplication/admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_COUPON_COLUMN, DT_PRODUCT_COLUMN } from "@/lib/Column";
import { columnConfig } from "@/lib/helperFunctions";
import {
  ADMIN_COUPON_ADD,
  ADMIN_COUPON_EDIT,
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_EDIT,
  ADMIN_PRODUCT_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPannelRoute";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupon" },
];

const AllProducts = () => {
  const columns = useMemo(() => columnConfig(DT_COUPON_COLUMN), []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <EditAction href={ADMIN_COUPON_EDIT(row.original._id)} key="edit" />,
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="gap-0">
        <CardHeader className="border-b pb-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Show Coupon</h3>
            <Button className="cursor-pointer flex items-center gap-1">
              <FiPlus />
              <Link href={ADMIN_COUPON_ADD}>New Coupon</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWraper
            queryKey="coupon-data"
            fetchUrl="/api/coupon"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/coupon/export"
            deleteEndpoint='/api/coupon/delete'
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=coupon`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AllProducts;
