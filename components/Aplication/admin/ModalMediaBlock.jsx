import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import React from "react";

const ModalMediaBlock = ({
  media,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {

   const handleCheck = () => {
  let newSelectedMedia = [];

  // ye check karega media already selected hai ya nahi
  const isSelected = selectedMedia.find((m) => m._id === media._id);

  if (isMultiple) {
    // ✅ multiple selection mode
    if (isSelected) {
      // agar selected hai to remove karo
      newSelectedMedia = selectedMedia.filter((m) => m._id !== media._id);
    } else {
      // agar selected nahi hai to add karo
      newSelectedMedia = [
        ...selectedMedia,
        { _id: media._id, url: media.secure_url },
      ];
    }
    setSelectedMedia(newSelectedMedia);
  } else {
    // ✅ single selection mode
    setSelectedMedia([{ _id: media._id, url: media.secure_url }]);
  }
};



  return (
    <label
      className="border-gray-200 dark:bg-gray-800 relative group rounded overflow-hidden"
      htmlFor={media._id}
    >
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          id={media._id}
          checked={
            selectedMedia.find((m) => m._id === media._id) ? true : false
          }
          onCheckedChange={handleCheck}
        />
      </div>
      <div className="size-full relative">
        <Image
          src={media.secure_url}
          alt={media.alt || ""}
          width={400}
          height={400}
          className="object-cover md:h-[150px] h-[100px]"
        />
      </div>
    </label>
  );
};

export default ModalMediaBlock;
