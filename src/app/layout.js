import "./globals.css";

export const metadata = {
  title: "Brixel – Smart building. Smarter quotes.",
  description: "AI-powered builder platform for Kent. Instant estimates, verified builders, guaranteed work.",
  metadataBase: new URL("https://brixel.uk"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/tw.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
