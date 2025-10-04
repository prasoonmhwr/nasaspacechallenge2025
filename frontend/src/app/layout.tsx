import "./globals.css";
import localFont from "next/font/local";

export const myFontNormal = localFont({
  src: "../assets/normal.ttf",
  variable: "--font-normal",
  display: "swap",
});

export const metadata = {
  description: "A World Away",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${myFontNormal.className}bg-black text-white`}>{children}</body>
    </html>
  );
}
