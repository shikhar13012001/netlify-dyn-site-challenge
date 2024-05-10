import { Button } from "@/components/ui/button";
import { FC } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";

interface SingleScreenshotResultProps {
  url?: string;
  setScreenshotKey?: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  screenshotKey: string;
}
export const SingleScreenshotResult: FC<SingleScreenshotResultProps> = ({
  url,
  screenshotKey,
}) => {
  const handleCopy = () => {
    // copy the persistent link to the clipboard
    navigator.clipboard
      .writeText(`http://localhost:3000/api/screenshot/image/${screenshotKey}`)
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
      {url && (
        <h1 className="text-2xl text-white w-full text-left my-2">
          Screenshot of{" "}
          <a
            href={url}
            target="_blank"
            className="text-sm font-light text-gray-400  hover:text-indigo-500"
          >
            {url}
          </a>
        </h1>
      )}
      <div className="w-full flex items-center justify-start gap-4">
        <Button
          className="hover:bg-slate-800 bg-slate-700 w-full text-white font-light mt-4 max-w-[200px] my-2"
          onClick={() => {
            const link = document.createElement("a");
            link.href = `/api/screenshots/${screenshotKey}`;
            link.download = "screenshot.png";
            link.click();
          }}
        >
          Download Screenshot <AiOutlineDownload size={24} className="ml-2" />
        </Button>

        {/* Copy persistent link button */}
        <Button
          variant="outline"
          onClick={handleCopy}
          className="hover:bg-slate-800 border-slate-400  w-full text-white font-light mt-4 max-w-[200px] my-2"
        >
          Copy Persistent Link
          <IoCopyOutline size={24} className="ml-2" />
        </Button>
      </div>
      {/* @ts-ignore */}
      <img
        src={`/api/screenshots/${screenshotKey}`}
        alt="Screenshot"
        className="max-w-full"
      />
    </div>
  );
};
