"use client";

import { BulkScreenshotResult } from "@/components/bulk-screenshot-result";
import WebshotApi from "@/utils/Screenshot.api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const getBucketKeys = async (bucketKey: string) => {
  try {
    const api = new WebshotApi();
    const { keys } = await api.getKeys(bucketKey);
    return keys;
  } catch (error) {
    console.error("Error fetching bucket keys:", error);
    return [];
  }
};

const SingleScreenshotImagePage = () => {
  const { id: bucketKey } = useParams();
  const [keys, setKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        setLoading(true);
        const _keys = await getBucketKeys(bucketKey as string);
        setKeys(_keys);
      } catch (error) {
        console.error("Error fetching keys:", error);
      } finally {
        setLoading(false);
      }
    };
    if (bucketKey) {
      fetchKeys();
    }
  }, [bucketKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BulkScreenshotResult
        screenshotBulkKeys={keys}
        bucketKey={bucketKey as string}
      />
    </div>
  );
};

export default SingleScreenshotImagePage;
