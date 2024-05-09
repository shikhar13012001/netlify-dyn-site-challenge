"use client";

import { FcMultipleCameras } from "react-icons/fc";
import { CgWebsite } from "react-icons/cg";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import React, { forwardRef, useRef } from "react";

interface CircleProps {
  className: string;
  children: React.ReactNode;
}

const CircleComponent = ({ className, children,...props }:CircleProps, ref: React.ForwardedRef<HTMLDivElement>)=> {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
};

const Circle = forwardRef<HTMLDivElement, CircleProps>(CircleComponent);
const  LoadingBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden rounded-lg bg-background p-10 md:shadow-xl"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row justify-between">
          <Circle className="" ref={div1Ref}>
            <FcMultipleCameras className="text-black" />
          </Circle>
          <Circle className="" ref={div2Ref}>
            <CgWebsite className="h-6 w-6 text-black" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={10}
        endYOffset={10}
        curvature={-20}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        reverse
        startYOffset={-10}
        endYOffset={-10}
        curvature={20}
      />
    </div>
  );
}


export default LoadingBar