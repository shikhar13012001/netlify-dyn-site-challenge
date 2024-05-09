"use client";
import React from "react";
import { useParams } from "next/navigation";
import { SingleScreenshotResult } from "@/app/page";
const SingleScreenshotImagePage = () => {
  const { id } = useParams();
  return (
    <div>
      <SingleScreenshotResult screenshotKey={id as string} />
    </div>
  );
};

export default SingleScreenshotImagePage;
