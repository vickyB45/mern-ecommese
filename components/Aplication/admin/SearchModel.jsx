import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Fuse from "fuse.js";
import searchData from "@/lib/search";

const options = {
  keys: ["label", "description", "keywords"],
  threshold: 0.3,
};

const SearchModel = ({ open, setOpen }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  const fuse = new Fuse(searchData, options);

  useEffect(() => {
    if (query.trim() === "") {
      setResult([]);
    }
    const res = fuse.search(query);
    setResult(res?.map((r) => r.item));
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Search</DialogTitle>
          <DialogDescription>
            Instantly find and jump to any admin section. Make your workflow
            smoother and save time!
          </DialogDescription>
        </DialogHeader>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Search..."
        />

        <ul className="mt-3 max-h-40 overflow-auto">
          {!result.length > 0 && !query.length > 0 ? (
            <div className="text-center text-red-500">No Product Found!</div>
          ) : (
            result.map((item, index) => (
              <li key={index}>
                <Link
                  onClick={() => {
                    setOpen(false)
                    setQuery('')
                  }}
                  href={item.url}
                  className="block py-2 px-3 rounded hover:bg-muted"
                >
                  <h4 className="font-medium ">{item.label}</h4>
                  <p className="text-sm">{item.description}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModel;
