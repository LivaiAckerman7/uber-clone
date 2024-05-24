import { inter } from "./layout";


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>

  );
}
