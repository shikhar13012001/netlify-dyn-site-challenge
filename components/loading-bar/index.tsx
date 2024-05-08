import { ProgressBar } from "@adobe/react-spectrum";

const LoadingBar = () => {
  return (
    <div className="progress w-full max-w-4xl h-2 overflow-hidden" style={{ position: "relative" }}>
      <div className="progress-bar progress-bar-striped indeterminate h-2 bg-indigo-500"></div>
    </div>
  );
};

export default LoadingBar;
