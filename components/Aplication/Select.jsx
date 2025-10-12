'use client'
import * as React from "react";
import { useState } from "react";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

function Select({
   options = [], // ✅ Default empty array to avoid undefined.map error
   selected = [], // ✅ Default value (empty array)
   setSelected = () => {},
   placeholder = "Select options",
   isMulti = false,
}) {
   const [open, setOpen] = useState(false);

   const handleSelect = (option) => {
       if (isMulti) {
           if (selected.includes(option.value)) {
               setSelected(selected.filter((s) => s !== option.value));
           } else {
               setSelected([...selected, option.value]);
           }
       } else {
           setSelected(option.value);
           setOpen(false);
       }
   };

   const handleRemove = (value) => {
       if (Array.isArray(selected)) {
           setSelected(selected.filter((s) => s !== value));
       } else {
           setSelected(null);
       }
   };

   const handleClearAll = () => {
       setSelected(isMulti ? [] : null);
   };

   return (
       <Popover open={open} onOpenChange={setOpen}>
           <PopoverTrigger className="w-full" asChild>
               <Button
                   variant="outline"
                   role="combobox"
                   aria-expanded={open}
                   className="justify-between dark:bg-card"
               >
                   <div>
                       {isMulti ? (
                           selected.length > 0 ? (
                               selected.map((value) => {
                                   const option = options.find((o) => o.value === value);
                                   return (
                                       <Badge key={value} className="me-2">
                                           {option?.label || value}
                                           <span
                                               onClick={(e) => {
                                                   e.stopPropagation();
                                                   handleRemove(value);
                                               }}
                                           >
                                               <XIcon className="ml-2 h-4 w-4 cursor-pointer" />
                                           </span>
                                       </Badge>
                                   );
                               })
                           ) : (
                               placeholder
                           )
                       ) : (
                           options.find((o) => o.value === selected)?.label || placeholder
                       )}
                   </div>

                   <div className="flex items-center gap-2">
                       {((isMulti && selected.length > 0) ||
                           (!isMulti && selected)) && (
                           <span
                               onClick={(e) => {
                                   e.stopPropagation();
                                   handleClearAll();
                               }}
                           >
                               <XIcon className="h-4 w-4 shrink-0 opacity-50" />
                           </span>
                       )}
                       <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                   </div>
               </Button>
           </PopoverTrigger>
           <PopoverContent align="start" className="p-0">
               <Command>
                   <CommandList>
                       <CommandInput placeholder="Search options..." />
                       <CommandEmpty>No options found.</CommandEmpty>
                       <CommandGroup>
                           {options.length > 0 &&
                               options.map((option) => (
                                   <CommandItem
                                       key={option.value}
                                       value={option.label}
                                       onSelect={() => handleSelect(option)}
                                   >
                                       {option.label}
                                       <CheckIcon
                                           className={cn(
                                               "ml-auto h-4 w-4",
                                               (isMulti
                                                   ? selected.includes(option.value)
                                                   : selected === option.value)
                                                   ? "opacity-100"
                                                   : "opacity-0"
                                           )}
                                       />
                                   </CommandItem>
                               ))}
                       </CommandGroup>
                   </CommandList>
               </Command>
           </PopoverContent>
       </Popover>
   );
}

export default Select;
