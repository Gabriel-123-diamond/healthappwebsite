import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import type { Metadata } from "next";
import "../globals.css";
import GlobalDisclaimer from "@/components/GlobalDisclaimer";
import { Link } from "@/i18n/routing";
import Script from "next/script";
import Header from "@/components/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import PushNotificationManager from "@/components/PushNotificationManager";

export const metadata: Metadata = {
  title: "Ikiké Health AI - Global Health Information Platform",
  description: "Discover credible health information across orthodox medicine and herbal knowledge.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body
        className={`antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <LanguageProvider initialLocale={locale as any}>
              <PushNotificationManager />
              <GlobalDisclaimer />
              <Header />
              <main className="flex-grow dark:bg-slate-900">
                {children}
              </main>
              <footer className="bg-slate-50 border-t py-12 px-4 dark:bg-slate-950 dark:border-slate-800">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">I</span>
                                          </div>
                                          <span className="font-bold text-xl text-slate-900 tracking-tight dark:text-white">Ikiké Health AI</span>                    </div>
                    <p className="text-slate-500 text-sm max-w-sm mb-6 dark:text-slate-400">
                      A global-standard health information platform providing verified medical information and traditional herbal knowledge.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 dark:text-white">Platform</h4>
                    <ul className="space-y-2">
                      <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Search</Link></li>
                      <li><Link href="/articles" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Articles</Link></li>
                      <li><Link href="/directory" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Directory</Link></li>
                      <li><Link href="/referrals" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Referrals</Link></li>
                      <li><Link href="/seed" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Standard Seed (V1)</Link></li>
                      <li><Link href="/admin/seed" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Admin Seed (V2)</Link></li>
                      <li><Link href="/developers" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Developers</Link></li>
                      <li><Link href="/history" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Search History</Link></li>
                      <li><Link href="/support" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Help & Support</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 dark:text-white">Legal</h4>
                    <ul className="space-y-2">
                      <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Privacy Policy</Link></li>
                      <li><Link href="/terms" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Terms of Use</Link></li>
                      <li><Link href="/disclaimer" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">Disclaimer</Link></li>
                    </ul>
                  </div>
                </div>
                              <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center dark:border-slate-800">
                                <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Ikiké Health AI. All rights reserved.</p>
                              </div>              </footer>
            </LanguageProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
