import Providers from "@/components/Providers";
import MyAreaFab from "@/components/MyAreaFab";
import "./globals.css";

export const metadata = {
  title: "Brixel.uk",
  description: "Home improvements made simple",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Providers>
          <main>{children}</main>
          <MyAreaFab />
        </Providers>
      </body>
    </html>
  );
}
