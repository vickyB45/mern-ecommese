import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Sorting = ({
  limit,
  setLimit,
  sorting,
  setSorting,
  mobileFilterOpen,
  setMoileFilterOpen,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2 p-4 bg-gray-50">
      <ul className="flex gap-2 items-center">
        <li className="font-semibold mr-3 ">Show</li>
        {[9, 12, 18, 24].map((limitNumber) => (
          <li key={limitNumber}>
            <button
              onClick={() => setLimit(limitNumber)}
              className={`w-8 h-8 flex justify-center items-center rounded-full gap-2 text-sm cursor-pointer ${
                limitNumber === limit ? "bg-primary text-white" : ""
              }`}
              type="button"
            >
              {limitNumber}
            </button>
          </li>
        ))}
      </ul>
      <Select>
        <SelectTrigger className="md:w-[180px] bg-white">
          <SelectValue placeholder="Default Sorting" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sorting;
