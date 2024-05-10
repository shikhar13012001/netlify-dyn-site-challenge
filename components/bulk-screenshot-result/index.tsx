import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";

export const BulkScreenshotResult: FC<{
  screenshotBulkKeys: string[];
  bucketKey: string;
}> = ({ screenshotBulkKeys, bucketKey }) => {
  const handleCopy = () => {
    // copy the persistent link to the clipboard
    navigator.clipboard
      .writeText(`http://localhost:3000/screenshot/bucket/${bucketKey}`)
      .then(() => {
        toast("Link copied to clipboard");
      })
      .catch((err) => {
        console.error(err);
        toast("Failed to copy link to clipboard");
      });
  };
  return (
    <div className="w-full flex flex-col items-center mt-4">
      <h1 className="text-2xl text-white w-full text-left my-2">
        Bulk Screenshot Results
      </h1>
      <div className="w-full flex items-center justify-start gap-4">
        <Button
          variant={"outline"}
          onClick={handleCopy}
          className="hover:bg-slate-800 border-slate-400  w-full text-white font-light mt-4 max-w-[200px] my-2"
        >
          Copy Persistent Link
          <IoCopyOutline size={24} className="ml-2" />
        </Button>
      </div>
      <div className="w-full flex items-center justify-start gap-4">
        {screenshotBulkKeys.map((key) => (
          <div key={key} className="flex flex-col items-center justify-center">
            <Image
              src={`/api/screenshots/${key}?bucket=${bucketKey}`}
              alt="Screenshot"
              width={300}
              height={200}
            />
            <Button
              className="hover:bg-slate-800 bg-slate-700 w-full text-white font-light mt-4"
              onClick={() => {
                const link = document.createElement("a");
                link.href = `/api/screenshots/${key}?bucket=${bucketKey}`;
                link.download = "screenshot.png";
                link.click();
              }}
            >
              Download Screenshot{" "}
              <AiOutlineDownload size={24} className="ml-2" />
            </Button>
            {/* Copy persistent link button */}
          </div>
        ))}
      </div>
    </div>
  );
};
