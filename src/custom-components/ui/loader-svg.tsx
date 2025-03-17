"use client";
import React from "react";

const LoaderSVG = () => {
  return (
    <svg
      className="w-12 h-12 text-white"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="2" rx="2" width="2" x="5" y="16">
        <animate
          attributeName="x"
          dur="1360ms"
          keySplines="0 0.8 0.8 1"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          values="6;10;10;16;16"
        />
        <animate
          attributeName="y"
          dur="1360ms"
          keySplines="0 0.8 0.8 1"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          values="16;5;5;16;16"
        />
      </rect>
      <rect fill="currentColor" height="2" rx="2" width="2" x="11" y="6">
        <animate
          attributeName="x"
          dur="1360ms"
          keySplines="0 0.8 0.8 1"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          values="11;16;16;6;6"
        />
        <animate
          attributeName="y"
          dur="1360ms"
          keySplines="0 0.8 0.8 1"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          values="7;15;15;16;16"
        />
      </rect>
      <rect fill="currentColor" height="2" rx="2" width="2" x="17" y="16">
        <animate
          attributeName="x"
          dur="1360ms"
          keySplines="0 0.8 0.8 1"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          values="16;4;4;11;11"
        />
        <animate
          attributeName="y"
          dur="1360ms"
          keySplines="0 0.8 0.8 1"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          values="16;15;15;7;7"
        />
      </rect>
    </svg>
  );
};

export default LoaderSVG;
