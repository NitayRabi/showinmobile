import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { KnownDevices } from "./device";

export const bgAtom = atomWithStorage("bg", "#fffcf5");
export const urlAtom = atomWithStorage("url", "");
export const deviceAtom = atomWithStorage<keyof typeof KnownDevices>(
  "device",
  "iPhone 15"
);
export const logoAtom = atomWithStorage("logo", "");

export const useEncodedState = () => {
  const [bg, setBg] = useAtom(bgAtom);
  const [url, setUrl] = useAtom(urlAtom);
  const [device, setDevice] = useAtom(deviceAtom);
  const [logo, setLogo] = useAtom(logoAtom);

  const decodeState = (state: string) => {
    const { bg, url, device, logo } = JSON.parse(decodeURIComponent(state));
    setBg(bg);
    setUrl(url);
    setDevice(device);
    setLogo(logo);
  };

  return [
    encodeURIComponent(
      JSON.stringify({
        bg,
        url,
        device,
        logo,
      })
    ),
    decodeState,
  ] as const;
};
