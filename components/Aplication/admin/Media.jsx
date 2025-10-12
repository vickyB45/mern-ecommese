import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { ADMIN_MEDIA_EDIT } from "@/routes/AdminPannelRoute";
import Link from "next/link";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosLink } from "react-icons/io";
import { LuTrash } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";

const Media = ({
  media,
  handleDelete,
  deleteType,
  selectedMedia,
  setSelectedMedia,
}) => {
  const handleChecked = () => {
    let newSelectedMedia = [];
    if (selectedMedia.includes(media._id)) {
      newSelectedMedia = selectedMedia.filter((id) => id !== media._id);
    } else {
      newSelectedMedia = [...selectedMedia, media._id];
    }
    setSelectedMedia(newSelectedMedia);
  };

  const handleCopyLink = async (url) => {
    if (!url) {
      showToast({ message: "No URL to copy", type: "error" });
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast({ message: "Link Copied to Clipboard", type: "success" });
    } catch (err) {
      showToast({ message: "Failed to copy link", type: "error" });
      console.error("Clipboard error:", err);
    }
  };

  return (
    <div className="border-gray-200 border dark:border-gray-800 relative group rounded overflow-hidden">
      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-20 cursor-pointer">
        <Checkbox
          checked={selectedMedia.includes(media._id)}
          onCheckedChange={handleChecked}
        />
      </div>

      {/* Dropdown menu */}
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="cursor-pointer w-7 h-7 bg-black/50 flex justify-center items-center text-white rounded-full">
              <BsThreeDotsVertical />
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {deleteType === "SD" && (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                    <MdOutlineEdit /> Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleCopyLink(media?.secure_url)}
                  className="cursor-pointer"
                >
                  <IoIosLink /> Copy Link
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              onClick={() => handleDelete && handleDelete([media._id], deleteType)}
              className="cursor-pointer"
            >
              <LuTrash className="text-red-500" />
              {deleteType === "SD" ? "Move Into Trash" : "Delete Permanently"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hover overlay */}
      <div className="w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/20"></div>

      {/* Media image */}
      <div>
        <img
          src={media?.secure_url}
          alt={media.alt || "image"}
          height={300}
          width={300}
          className="object-cover w-full sm:h-[200px] h-[150px]"
        />
      </div>
    </div>
  );
};

export default Media;
