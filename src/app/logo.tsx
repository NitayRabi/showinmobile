import Image from "next/image";
import { useAtom } from "jotai";
import { logoAtom } from "./state";
import { useFullscreen } from "./hooks/useFullscreen";
import { IoCloseOutline } from "react-icons/io5";
import { Button, Flex } from "@radix-ui/themes";

export default function Logo() {
  const { isFullscreen } = useFullscreen();
  const [logo, setLogo] = useAtom(logoAtom);
  return (
    <Flex className="absolute top-6 right-6 z-50">
      {!isFullscreen && logo && (
        <Button size="1" onClick={() => setLogo("")}>
          <IoCloseOutline size={20} />
        </Button>
      )}
      {logo && <Image src={logo} alt="Logo" width={125} height={125}></Image>}
    </Flex>
  );
}
