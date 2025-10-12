"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const useFetch = ({ url, method = "GET", options = {} }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Avoid unnecessary re-renders by memoizing request options
  const optionString = JSON.stringify({ url, method, options });

  const requestOptions = useMemo(() => {
    const opts = { ...options };
    if (method !== "POST" && !opts.data) {
      opts.data = {};
    }
    return opts;
  }, [optionString]);

  useEffect(() => {
    const controller = new AbortController();

    const apiCall = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: response } = await axios({
          url,
          method,
          signal: controller.signal,
          ...requestOptions,
        });

        if (!response.success) {
          throw new Error(response.message || "Request failed");
        }

        setData(response);
      } catch (error) {
        if (axios.isCancel(error)) return; // prevent update after unmount
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    apiCall();

    return () => controller.abort();
  }, [url, refreshIndex, requestOptions]);

  const refetch = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
};

export default useFetch;
