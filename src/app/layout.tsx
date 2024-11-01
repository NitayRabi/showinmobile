import type { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const description =
  "ShowInMobile is an innovative application designed to showcase websites in a mobile view. It offers users the flexibility to customize backgrounds, upload company logos, and present their content in fullscreen mode, seamlessly adapting to various screen sizes for optimal display.";

const keywords =
  "mobile website showcase, responsive design tool, web presentation app, customizable mobile viewer, fullscreen website display, mobile site preview, company logo showcase, website testing on mobile";
const title = "ShowInMobile - Showcase Websites in Mobile View";

export const metadata: Metadata = {
  title,
  description,
  keywords,
  authors: [{ name: "Nitay Rabinovich", url: "https://github.com/NitayRabi" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
