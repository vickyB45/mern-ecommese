import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IoStar } from "react-icons/io5";

const LatestReview = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Rating</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              {/* ✅ Avatar + Product name in single column */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/assets/images/img-placeholder.webp" />
                  </Avatar>
                  <span className="font-medium text-sm">
                    Lorem ipsum dolor sit.
                  </span>
                </div>
              </TableCell>

              {/* ✅ Rating aligned to right */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <IoStar key={j} className="text-yellow-400" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestReview;
