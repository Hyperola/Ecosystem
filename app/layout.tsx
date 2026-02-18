// app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FCFCFA]">
        {/* No Providers or Navbars here! 
            They live in the group layouts below this one. */}
        {children}
      </body>
    </html>
  );
}