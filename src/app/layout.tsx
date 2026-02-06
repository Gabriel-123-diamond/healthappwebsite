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
      <body>{children}</body>
    </html>
  );
}
