"use client";

import React, { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

export function AutoResizeTextarea({
  maxRows = 5,
  className,
  onKeyDown,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const singleRowHeight = 24;
      const maxHeight = maxRows * singleRowHeight;
      const scrollHeight = textarea.scrollHeight;

      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        setIsOverflowing(true);
      } else {
        textarea.style.height = `${scrollHeight}px`;
        setIsOverflowing(false);
      }
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [props.value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onKeyDown) {
        onKeyDown(e);
      }
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <Textarea
      {...props}
      ref={textareaRef}
      rows={1}
      onChange={(e) => {
        resizeTextarea();
        props.onChange?.(e);
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        className,
        isOverflowing ? "overflow-y-auto" : "overflow-y-hidden"
      )}
    />
  );
}
