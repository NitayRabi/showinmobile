"use client";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import dynamic from "next/dynamic";

import Emulator from "./emulator";
import { Flex, Theme } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { bgAtom } from "./state";
import Toolbar from "./toolbar";
import Logo from "./logo";
import * as Toast from "@radix-ui/react-toast";

function Home() {
  const [bg] = useAtom(bgAtom);

  return (
    <Toast.Provider swipeDirection="right">
      <Flex
        className="w-full"
        justify="center"
        align="center"
        style={{ background: bg }}
      >
        <Theme
          accentColor="brown"
          hasBackground={false}
          panelBackground="solid"
          className="w-full"
        >
          <main className="flex flex-col justify-center h-dvh w-full">
            <Logo />
            <Toolbar />
            <Emulator />
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </Theme>
      </Flex>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
