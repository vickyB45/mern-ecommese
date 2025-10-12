"use client";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { FiPlus } from "react-icons/fi";

const UploadMedia = ({ isMultiple = true, queryClient }) => {

  const handleOnError = (error) => {
    showToast({ type: "error", message: error.statusText })
  };
const handleOnQueuesEnd = async (result) => {
  const files = result?.info?.files;
  const uploadedFiles = files
  .filter(file => file.uploadInfo)
  .map(file => ({
    asset_id: file.uploadInfo.asset_id,
    public_id: file.uploadInfo.public_id,
    secure_url: file.uploadInfo.secure_url,
    path: file.uploadInfo.path,
    thumbnail_url: file.uploadInfo.thumbnail_url,
  }));


  if (!uploadedFiles.length) return;

  try {
    const { data: mediaUploadResponse } = await axios.post('/api/media/create', uploadedFiles);
    if (!mediaUploadResponse.success) {
      throw new Error(mediaUploadResponse.message || "Media upload failed");
    }
    queryClient.invalidateQueries(["media-data"]);
    showToast({ type: "success", message: mediaUploadResponse.message || "Media uploaded successfully" });
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Something went wrong!";
    showToast({ type: "error", message: msg });
    console.error("Media upload error:", error);
  }
};



  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-signature"
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onError={handleOnError}
      onQueuesEnd={handleOnQueuesEnd}
      config={{
        cloud:{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        }
      }}
      options={{
        multiple: isMultiple,
        folder: "uploads",
        sources: ["local", "url", "unsplash", "google_drive", "facebook", "instagram"],
      }}
    >
      {({ open }) => (
  <Button type="button" onClick={() => open()}>
   <>
    <FiPlus className="mr-2" />
    Upload an Image
    </>
  </Button>
)}

    </CldUploadWidget>
  );
};

export default UploadMedia;
