// components/BackgroundSelector.js

import { useRef, useState } from "react";
import ColorPicker from "react-best-gradient-color-picker";
import { useAtom } from "jotai";
import { bgAtom } from "./state";
import { IoCloseOutline } from "react-icons/io5";

import { AiOutlineBgColors } from "react-icons/ai";
import { Button, Card, Flex, Inset, Tooltip } from "@radix-ui/themes";
import { useOnClickOutside } from "usehooks-ts";

const BackgroundSelector = () => {
  const [background, setBackground] = useAtom(bgAtom);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleColorChange = (color: string) => {
    setBackground(color);
  };

  const ref = useRef(null);

  const handleClickOutside = () => {
    // Your custom logic here
    setPickerVisible(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div>
      <Tooltip content="Background color">
        <Button
          variant="soft"
          onClick={() => setPickerVisible(!isPickerVisible)}
        >
          <AiOutlineBgColors size={20} />
        </Button>
      </Tooltip>

      {isPickerVisible && (
        <Card
          variant="surface"
          className="w-fit absolute"
          style={{ position: "absolute" }}
          ref={ref}
        >
          <Inset clip="padding-box" side="top" pb="current">
            <Flex justify="end" className="p-2">
              <IoCloseOutline
                size={20}
                className="cursor-pointer"
                onClick={() => setPickerVisible(false)}
              />
            </Flex>
          </Inset>

          <ColorPicker value={background} onChange={handleColorChange} />
        </Card>
      )}
    </div>
  );
};

export default BackgroundSelector;
