import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FaFileCsv } from "react-icons/fa";
import React, { ChangeEvent, FC, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ImUpload } from "react-icons/im";
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  classNameWrapper?: string;
  className?: string;
  dropMessage: string;
  handleOnDrop: (acceptedFiles: FileList | null) => void;
}

const DropzoneComponent: React.ForwardRefRenderFunction<any, DropzoneProps> = (
  { className, classNameWrapper, dropMessage, handleOnDrop, ...props },
  ref
) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Function to handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleOnDrop(null);
  };

  // Function to handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    if (inputRef.current) {
      inputRef.current.files = files;
      handleOnDrop(files);
    }
  };

  // Function to simulate a click on the file input element
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  return (
    <Card
      ref={ref}
      className={cn(
        `border-2 border-dashed border-indigo-500 border-opacity-60 bg-muted hover:cursor-pointer hover:border-muted-foreground/50 h-40 mt-4`,
        classNameWrapper
      )}
    >
      <CardContent
        className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-lg"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="text-sm w-3/4 text-center flex items-center justify-center flex-col">
            {dropMessage}. Provide a CSV file with URLs, you can download the
            generated screenshots, or have a shareable gallery link.
            <ImUpload size={64} />
          </span>
          <Input
            {...props}
            value={undefined}
            ref={inputRef}
            type="file"
            className={cn("hidden", className)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleOnDrop(e.target.files)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

const Dropzone = React.forwardRef(DropzoneComponent);
interface BulkUploadProps {
  handleFormSubmit: (data: { file: File | null }) => void;
}

const BulkUpload: FC<BulkUploadProps> = ({ handleFormSubmit }) => {
  const defaultValues: { file: null | File } = {
    file: null,
  };
  const methods = useForm({
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  });

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = [
        { name: "csv", types: ["text/csv"] },
        {
          name: "excel",
          types: [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
        },
      ];
      const fileType = allowedTypes.find((allowedType) =>
        allowedType.types.find((type) => type === acceptedFiles[0].type)
      );
      if (!fileType) {
        methods.setValue("file", null);
        methods.setError("file", {
          message: "File type is not valid",
          type: "typeError",
        });
      } else {
        methods.setValue("file", acceptedFiles[0]);
        methods.clearErrors("file");
      }
    } else {
      methods.setValue("file", null);
      methods.setError("file", {
        message: "File is required",
        type: "typeError",
      });
    }
  }
  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col items-center justify-center w-full max-w-2xl gap-2 text-slate-400"
        onSubmit={methods.handleSubmit(handleFormSubmit)}
        noValidate
        autoComplete="off"
      >
        <FormField
          control={methods.control}
          name="file"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Dropzone
                  {...field}
                  dropMessage="Drop files or click here"
                  handleOnDrop={handleOnDrop}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {methods.watch("file") && (
          <div className="flex items-center justify-center gap-3 p-4 relative">
            <FaFileCsv className="h-4 w-4" />
            <p className="text-sm font-medium">{methods.watch("file")?.name}</p>
          </div>
        )}
        {methods.watch("file") && (
          <Button type="submit" variant="outline" className="border-indigo-500 hover:bg-indigo-500 w-full text-white font-light mt-4">
            Upload file
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export { Dropzone, BulkUpload };
