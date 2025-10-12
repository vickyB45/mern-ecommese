import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LatestOrder = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order Id</TableHead>
            <TableHead>Payment Id</TableHead>
            <TableHead>Payment Method </TableHead>
            <TableHead>Total Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {Array.from({length : 20}).map((_,i)=>(
          <TableRow key={i}>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>23</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell className="text-right">₹25990.00</TableCell>
          </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestOrder;
