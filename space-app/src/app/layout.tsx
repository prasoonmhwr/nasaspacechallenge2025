import "./globals.css";

export const metadata = {
  title: "NASA Space Apps – A World Away",
  description: "Hackathon Landing Page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
