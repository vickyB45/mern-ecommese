import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortingFilter } from "@/lib/utils";
import { IoFilter } from "react-icons/io5";

const Sorting = ({
  limit,
  setLimit,
  sorting,
  setSorting,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2 p-4 bg-gray-50">
      <button  className="px-4 flex justify-between gap-2 text-sm cursor-pointer rounded lg:hidden items-center py-2 bg-primary text-white" type="button" onClick={()=>setIsMobileFilterOpen(!isMobileFilterOpen)}>
        <IoFilter /> Filter
      </button>
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
      <Select value={sorting} onValueChange = {(value)=>setSorting(value)}>
        <SelectTrigger className="md:w-[180px] bg-white">
          <SelectValue placeholder="Default Sorting" />
        </SelectTrigger>
        <SelectContent>
          {sortingFilter.map((option)=>(
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sorting;
