import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import React, { useState } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import ModalMediaBlock from "./ModalMediaBlock";
import { showToast } from "@/lib/showToast";
import { Loader2 } from "lucide-react";

const MediaModel = ({
  open,
  setOpen,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {
  const [previoslySeleted, setPrevioslySeleted] = useState([]);

  const fetchMedia = async (page) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=18&&deleteType=SD`,
      { withCredentials: true }
    );
    return response;
  };

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["MediaModal"],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });

  // Close dialog
  const handleClose = () => {
    setSelectedMedia(previoslySeleted);
    setOpen(false);
  };

  // Clear selected media
  const handleClear = () => {
    setSelectedMedia([]);
    setPrevioslySeleted([]);
    showToast({ type: "success", message: "Media Selection Cleared" });
  };

  // Select media (implement your logic)
  const handleSelect = () => {
    if (selectedMedia.length <= 0) {
      return showToast({ type: "error", message: "Please select a media" });
    }
    setPrevioslySeleted(selectedMedia);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()} // ✅ fixed typo
        className="sm:max-w-[80%] h-screen px-0 py-10 bg-transparent shadow-none border-0"
      >
        <div className="h-[90vh] bg-white dark:bg-zinc-900 p-0 rounded shadow flex flex-col">
          {/* Header */}
          <DialogHeader className="h-12 border-b-2 flex items-center px-4">
            <DialogTitle className="text-xl font-medium">
              Media Selection
            </DialogTitle>
          </DialogHeader>

          {/* Body */}
          <div className="h-[calc(100%-80px)] overflow-auto py-2">
            {isPending ? (
              <div className="h-full flex justify-center items-center">
                <Image
                  src="/assets/images/loading.svg"
                  alt="loading"
                  height={80}
                  width={80}
                />
              </div>
            ) : isError ? (
              <div className="h-full flex justify-center items-center text-red-500">
                <span>{error.message}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 ">
                  {data?.pages?.map((page, index) => (
                    <React.Fragment key={index}>
                      {page?.mediaData?.map((media) => (
                        <ModalMediaBlock
                          key={media._id}
                          media={media}
                          selectedMedia={selectedMedia}
                          setSelectedMedia={setSelectedMedia}
                          isMultiple={isMultiple}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </div>

                {hasNextPage ? (
                  <div className="flex justify-center py-5">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetching} // prevent multiple clicks
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-500 border cursor-pointer hover:bg-purple-600 disabled:opacity-60"
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-black py-5 dark:text-white text-center">
                    Nothing more to load.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="h-16 pt-3 border-t-2 flex justify-between px-4 items-center">
            <Button
              className="cursor-pointer"
              type="button"
              variant="destructive"
              onClick={handleClear}
            >
              Clear All
            </Button>

            <div className="flex gap-4">
              <Button
                className="cursor-pointer"
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </Button>

              <Button
                className="cursor-pointer"
                type="button"
                onClick={handleSelect}
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModel;
