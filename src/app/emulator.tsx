"use client";

import { useEffect, useState } from "react";
import { KnownDevices } from "./device";
import { Box, Flex, Skeleton } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { deviceAtom, urlAtom } from "./state";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const toUrl = (url: string) => {
  if (url.startsWith("https")) {
    return url;
  }
  return `https://${url}`;
};

const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function Emulator() {
  const [url] = useAtom(urlAtom);
  const [selectedDevice] = useAtom(deviceAtom);

  const debouncedUrl = useDebounce(toUrl(url), 500);
  const device = KnownDevices[selectedDevice];

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate device aspect ratio
  const deviceAspectRatio = device.viewport.width / device.viewport.height;

  // Determine dimensions to fit the device within the viewport
  let width, height;

  if (viewportWidth / viewportHeight > deviceAspectRatio) {
    // Viewport is wider than device aspect ratio
    height = viewportHeight * 0.7; // Adjust height as needed (80% of viewport height)
    width = height * deviceAspectRatio; // Calculate width based on aspect ratio
  } else {
    // Viewport is taller than device aspect ratio
    width = viewportWidth * 0.7; // Adjust width as needed (80% of viewport width)
    height = width / deviceAspectRatio; // Calculate height based on aspect ratio
  }

  return (
    <Flex justify="center" align="center">
      <Box
        style={{
          width: `${width}px`, // Set calculated width
          height: `${height}px`, // Set calculated height
          maxWidth: "100vw", // Ensure it doesn't exceed viewport width
          maxHeight: "100vh", // Ensure it doesn't exceed viewport height
          //   borderWidth: "20px",
          boxSizing: "content-box",
        }}
        className="rounded-xl shadow-2xl border-slate-900"
      >
        {isUrl(debouncedUrl) ? (
          <iframe
            style={{
              width: "100%",
              height: "100%",
              border: "none", // Optional for aesthetics
            }}
            src={debouncedUrl}
          />
        ) : (
          <Skeleton width="100%" height="100%" />
        )}
      </Box>
    </Flex>
  );
}
