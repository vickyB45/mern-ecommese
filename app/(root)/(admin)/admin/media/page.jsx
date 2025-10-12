"use client";

import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
import Media from "@/components/Aplication/admin/Media";
import UploadMedia from "@/components/Aplication/admin/UploadMedia";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPannelRoute";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuTrash } from "react-icons/lu";

/* ------------------------- Skeleton Placeholder ------------------------- */
const MediaSkeleton = () => (
  <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
    <div className="relative w-full h-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
    <div className="p-2 space-y-2">
      <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const MediaPage = () => {
  const queryClient = useQueryClient();
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const searchParams = useSearchParams();

  // ------------------------- Handle Delete Type Change -------------------------
  useEffect(() => {
    if (searchParams) {
      const trashOf = searchParams.get("trashof");
      setSelectedMedia([]);
      if (trashOf) setDeleteType("PD");
      else setDeleteType("SD");
    }
  }, [searchParams]);

  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: "#", label: "Media" },
  ];

  // ------------------------- Fetch Media -------------------------
  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&limit=10&deleteType=${deleteType}`
    );
    return response;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });

  // ------------------------- Delete Mutation Hook -------------------------
  const deleteMutation = useDeleteMutation("media-data", "/api/media/delete");

  // ------------------------- Handle Delete -------------------------
  const handleDelete = (selectedMedia, deleteType) => {
    let c = true;

    if (deleteType === "PD") {
      c = confirm("Are you sure? This media will be deleted permanently.");
    }

    if (c) {
      deleteMutation.mutate({ ids: selectedMedia, deleteType });
      setSelectedMedia([]);
      setSelectAll(false);
    }
  };

  // ------------------------- Handle Select All -------------------------
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  // ------------------------- Sync selectAll State -------------------------
  useEffect(() => {
    if (selectAll && data?.pages) {
      const ids = data.pages.flatMap((page) =>
        page.mediaData.map((m) => m._id)
      );
      setSelectedMedia(ids);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll, data]);

  // ------------------------- UI Render -------------------------
  return (
    <div className="p-2">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between md:flex-row flex-col gap-3">
            <h4 className="uppercase text-xl font-semibold tracking-wide">
              {deleteType === "SD" ? "Media Library" : "Trash Bin"}
            </h4>
            <div className="flex items-center gap-5">
              {deleteType === "SD" && <UploadMedia queryClient={queryClient} />}
              <div className="flex gap-3">
                {deleteType === "SD" ? (
                  <Button type="button" variant="destructive">
                    <Link
                      href={`${ADMIN_MEDIA_SHOW}?trashof=media`}
                      className="flex items-center gap-2"
                    >
                    <>
                      <LuTrash />
                      Trash
                      </>
                    </Link>
                  </Button>
                ) : (
                  <Button type="button">
                    <Link
                      href={`${ADMIN_MEDIA_SHOW}`}
                      className="flex items-center gap-2"
                    >
                      Back To Media
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* -------------------- Selected Media Info -------------------- */}
          {selectedMedia.length > 0 && (
            <div className="flex flex-col mb-4">
              <div className="hidden md:block mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
                <p className="text-sm">
                  You have selected {selectedMedia.length} media item(s).
                </p>
              </div>

              <div className="bg-violet-200 rounded flex justify-between items-center p-2">
                <Label>
                  <Checkbox
                    className="border-gray-400 mr-2"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  Select All
                </Label>

                <div className="flex gap-2">
                  {deleteType === "SD" ? (
                    <Button
                      type="button"
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                      variant="destructive"
                    >
                      Move Into Trash
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleDelete(selectedMedia, "RSD")}
                      >
                        Restore
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleDelete(selectedMedia, deleteType)}
                        variant="destructive"
                      >
                        Delete Permanently
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* -------------------- Media Grid -------------------- */}
          {isPending ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {[...Array(8)].map((_, i) => (
                <MediaSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <>
              {!data?.pages[0]?.mediaData?.length && (
                <div className="text-center text-gray-500 py-10">
                  No media found.
                </div>
              )}
              <div
                className="grid  grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 transition-opacity duration-500"
                style={{ opacity: isFetching ? 0.7 : 1 }}
              >
                {data?.pages?.map((page, index) => (
                  <React.Fragment key={index}>
                    {page?.mediaData?.map((media) => (
                      <Media
                        key={media._id}
                        media={media}
                        handleDelete={handleDelete}
                        deleteType={deleteType}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
         {hasNextPage && (
  <div className="text-center mt-4">
    <button
      type="button"
      disabled={isFetching}             // loading ke time disable karo
      onClick={() => fetchNextPage()}
      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer disabled:opacity-50"
    >
      {isFetching ? "Loading..." : "Load More"}  
    </button>
  </div>
)}

        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
