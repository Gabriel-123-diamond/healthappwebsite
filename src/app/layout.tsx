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
      <head>
        <script src="https://js.paystack.co/v1/inline.js" async></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Polyfill matchMedia for environments where it is missing (like some SSR or test environments)
                  if (typeof window !== 'undefined' && !window.matchMedia) {
                    window.matchMedia = function() {
                      return {
                        matches: false,
                        addListener: function() {},
                        removeListener: function() {},
                        addEventListener: function() {},
                        removeEventListener: function() {}
                      };
                    };
                  }

                  var saved = localStorage.getItem('theme');
                  var theme = saved || 'system';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
