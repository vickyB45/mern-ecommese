"use client";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
import DataTableWraper from "@/components/Aplication/admin/DataTableWraper";
import DeleteAction from "@/components/Aplication/admin/DeleteAction";
import EditAction from "@/components/Aplication/admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_PRODUCT_VARIANT_COLUMN } from "@/lib/Column";
import { columnConfig } from "@/lib/helperFunctions";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_EDIT,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPannelRoute";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variant" },
];

const AllProductsVariant = () => {
  
  const columns = useMemo(() => columnConfig(DT_PRODUCT_VARIANT_COLUMN), []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <EditAction href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)} key="edit" />,
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="gap-0">
        <CardHeader className="border-b pb-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Show Product Variant</h3>
            <Button className="cursor-pointer flex items-center gap-1">
              <FiPlus />
              <Link href={ADMIN_PRODUCT_VARIANT_ADD}>New Variant</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWraper
            queryKey="product-variant-data"
            fetchUrl="/api/product-variant"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/product-variant/export"
            deleteEndpoint='/api/product-variant/delete'
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=product-variant`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AllProductsVariant;
