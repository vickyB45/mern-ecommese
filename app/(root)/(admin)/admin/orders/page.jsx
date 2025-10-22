"use client";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
import DataTableWraper from "@/components/Aplication/admin/DataTableWraper";
import DeleteAction from "@/components/Aplication/admin/DeleteAction";
import ViewAction from "@/components/Aplication/admin/ViewAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_ORDER_COLUMN } from "@/lib/Column";
import { columnConfig } from "@/lib/helperFunctions";
import {
  ADMIN_COUPON_ADD,
  ADMIN_DASHBOARD,
  ADMIN_ORDER_DETAILS,
  ADMIN_ORDER_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPannelRoute";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
      { href: ADMIN_DASHBOARD, label: "Home" },
       { href: ADMIN_ORDER_SHOW, label: "Orders" },
    
];


const ShowOrder = () => {
  const columns = useMemo(() => columnConfig(DT_ORDER_COLUMN), []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <ViewAction href={ADMIN_ORDER_DETAILS(row.original.orderId)} key="view" />,
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="gap-0">
        <CardHeader className="border-b pb-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Show Orders</h3>
            <Button className="cursor-pointer flex items-center gap-1">
              <FiPlus />
              <Link href={ADMIN_COUPON_ADD}>New Coupon</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWraper
            queryKey="orders-data"
            fetchUrl="/api/orders"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/orders/export"
            deleteEndpoint='/api/orders/delete'
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=orders`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowOrder;
