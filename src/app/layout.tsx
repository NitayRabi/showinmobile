import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head";

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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const description =
  "ShowInMobile is an innovative application designed to showcase websites in a mobile view. It offers users the flexibility to customize backgrounds, upload company logos, and present their content in fullscreen mode, seamlessly adapting to various screen sizes for optimal display.";

const keywords =
  "mobile website showcase, responsive design tool, web presentation app, customizable mobile viewer, fullscreen website display, mobile site preview, company logo showcase, website testing on mobile";
const title = "ShowInMobile - Showcase Websites in Mobile View";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>ShowInMobile - Showcase a website in mobile</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Nitay Rabinovich" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* TODO <meta property="og:image" content="/path/to/your/image.jpg" /> */}
        <meta property="og:url" content="https://showinmobile.app" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* TODO <meta name="twitter:image" content="/path/to/your/image.jpg" /> */}
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
