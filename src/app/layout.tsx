import "./globals.css";
export const metadata = {
  title: "LexiAI",
  description: "Open-Sourced AI Documentation Search Engine",
  image: "/logo.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
