"use client";
import { SingleScreenshotResult } from "@/components/single-screenshot-result";
import { useParams } from "next/navigation";
const SingleScreenshotImagePage = () => {
  const { id } = useParams();
  return (
    <div>
      <SingleScreenshotResult screenshotKey={id as string} />
    </div>
  );
};

export default SingleScreenshotImagePage;
