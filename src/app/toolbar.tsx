"use client";

import { KnownDevices } from "./device";
import {
  Button,
  DropdownMenu,
  Flex,
  Separator,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import BackgroundSelector from "./background-selector";
import { useAtom } from "jotai";
import { deviceAtom, logoAtom, urlAtom, useEncodedState } from "./state";
import { BiFullscreen, BiImage, BiSolidImage } from "react-icons/bi";

import { useFullscreen } from "./hooks/useFullscreen";
import { LiaLinkSolid } from "react-icons/lia";
import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
export default function Toolbar() {
  const [url, setUrl] = useAtom(urlAtom);
  const [selectedDevice, setSelectedDevice] = useAtom(deviceAtom);
  const [logo, setLogo] = useAtom(logoAtom);
  const [state] = useEncodedState();
  const { isFullscreen } = useFullscreen();
  const [isToastOpen, setIsToastOpen] = useState(false);

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

  const setFullScreen = () => {
    // Set the tab  to fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const selectIcon = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogo(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const share = () => {
    const urlToCopy = window.origin + `/open/?state=${state}`;
    navigator.clipboard.writeText(urlToCopy);
    setIsToastOpen(true);
    setTimeout(() => {
      setIsToastOpen(false);
    }, 2000);
  };

  return (
    <>
      <Flex
        style={{
          opacity: isFullscreen ? 0 : 1,
          pointerEvents: isFullscreen ? "none" : "auto",
          // visibility: isFullscreen ? "hidden" : "initial",
          transition: "opacity 0.3s",
          transitionBehavior: "smooth",
          transitionTimingFunction: "ease-in-out",
        }}
        className="absolute top-4 left-0 right-0 z-10 w-full"
        justify="center"
        align="center"
      >
        <Flex
          style={{ overflow: "visible", width: "40%", minWidth: "max-content" }}
          className="relative bg-white rounded-lg pb-2 pt-2 pr-6 pl-6 shadow-lg w-1/3"
        >
          <Flex className="p-2 w-full" align="center" justify="between">
            <TextField.Root
              className="min-w-60"
              placeholder="https://example.com"
              variant="surface"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft" style={{ maxWidth: "175px" }}>
                  <Text truncate>{selectedDevice}</Text>
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {Object.keys(KnownDevices).map((deviceName) => (
                  <DropdownMenu.Item
                    onClick={() =>
                      setSelectedDevice(deviceName as keyof typeof KnownDevices)
                    }
                    key={deviceName}
                  >
                    {deviceName}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Separator orientation="vertical" />

            <BackgroundSelector />

            <Tooltip content="Set logo">
              <Button onClick={selectIcon} variant="soft">
                {logo ? <BiSolidImage size={20} /> : <BiImage size={20} />}
              </Button>
            </Tooltip>

            <Separator orientation="vertical" />
            <Tooltip content="Copy link">
              <Button onClick={share} variant="soft">
                <LiaLinkSolid size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Fullscreen">
              <Button onClick={setFullScreen}>
                <BiFullscreen size={20} />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
      <Toast.Root className="ToastRoot" open={isToastOpen}>
        <Toast.Title className="ToastTitle">Share</Toast.Title>
        <Toast.Description className="ToastDescription">
          Link copied to clipboard
        </Toast.Description>
      </Toast.Root>
    </>
  );
}
