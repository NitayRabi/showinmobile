import NextImage from "next/image";
import { useAtom } from "jotai";
import { logoAtom } from "./state";
import { useFullscreen } from "./hooks/useFullscreen";
import { IoCloseOutline } from "react-icons/io5";
import { Button, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { isFullscreen } = useFullscreen();
  const [logo, setLogo] = useAtom(logoAtom);
  const [showClearLogo, setShowClearLogo] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = logo;

    // Once the image loads, get its dimensions
    img.onload = () => {
      setDimensions({
        width: img.width,
        height: img.height,
      });
    };
  }, [logo]);

  return (
    logo && (
      <Flex
        onMouseEnter={() => setShowClearLogo(true)}
        onMouseLeave={() => setShowClearLogo(false)}
        className="absolute bottom-10 left-10 z-50"
      >
        {!isFullscreen && showClearLogo && (
          <Button
            className="absolute"
            radius="full"
            size="1"
            onClick={() => setLogo("")}
          >
            <IoCloseOutline size={14} />
          </Button>
        )}
        <NextImage
          src={logo}
          width={dimensions.width}
          height={dimensions.height}
          alt="Logo"
        ></NextImage>
      </Flex>
    )
  );
}
