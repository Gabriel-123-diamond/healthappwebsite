import { ReactNode } from 'react';

// This is the root layout required by Next.js.
// It will only be used if a route is hit that is outside the [locale] segment.
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
