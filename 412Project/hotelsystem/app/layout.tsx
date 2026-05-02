import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[url('/hotelBackground.png')] bg-cover bg-center">
        {children}
      </body>
    </html>
  );
}