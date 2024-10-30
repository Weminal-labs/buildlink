import React from "react";

export default function LoadingMessage() {
  return (
    <div className="flex mb-4">
      <div className="bg-muted p-4 rounded-lg flex items-center space-x-2">
        <div className="flex space-x-2">
          <div
            className="size-1 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="size-1 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="size-1 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
