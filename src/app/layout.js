import "./globals.css";

export const metadata = {
  title: "Brixel — Kent’s #1 AI-Powered Builder",
  description: "Instant estimates. Verified builders. Guaranteed work. Build smarter with Brixel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
