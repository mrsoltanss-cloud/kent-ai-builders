export const metadata = {
  title: "Brixel — Trader",
};

export default function PlainRootLayout({ children }: { children: React.ReactNode }) {
  // Minimal root layout: NO global header/sidebar/sign-out.
  // Keeps Tailwind working because <html>/<body> are defined here.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
