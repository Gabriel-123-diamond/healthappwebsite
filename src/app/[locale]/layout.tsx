import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
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
import { UiProvider } from "@/context/UiContext";
import PushNotificationManager from "@/components/PushNotificationManager";
import AuthCheck from "@/components/AuthCheck";
import { Activity } from "lucide-react";
import ScrollToTop from "@/components/common/ScrollToTop";
import AiChatbotWrapper from '@/components/chat/AiChatbotWrapper';

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.ikikehealth.com'),
  title: "Ikiké Health AI - Global Health Information Platform",
  description: "Discover credible health information across orthodox medicine and herbal knowledge.",
  applicationName: "Ikiké Health",
  openGraph: {
    type: "website",
    siteName: "Ikiké Health AI",
    title: "Ikiké Health AI - African Healthcare Platform",
    description: "Bridging modern clinical science with traditional herbal wisdom through explainable artificial intelligence.",
    images: [{
      url: "/og-image.jpg", 
      width: 1200,
      height: 630,
      alt: "Ikiké Health AI Dashboard Preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ikiké Health AI",
    description: "Discover credible health information across orthodox medicine and herbal knowledge.",
  },
  appleWebApp: {
    title: "Ikiké Health",
    statusBarStyle: "black-translucent",
  },
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
  const messages = await getMessages();
  const t = await getTranslations('footer');
  const h = await getTranslations('home');
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <LanguageProvider initialLocale={locale as any}>
              <UiProvider>
                <AuthCheck>
                  <PushNotificationManager />
                  <div className="print:hidden">
                    <AiChatbotWrapper />
                    <GlobalDisclaimer />
                    <Header />
                  </div>
                  <main className="flex-grow dark:bg-slate-900">
                    {children}
                  </main>
                  <div className="print:hidden">
                    <ScrollToTop />
                  </div>
                  <footer className="relative bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 pt-24 pb-12 px-4 overflow-hidden print:hidden">
              {/* Background Accents */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
                <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 right-[-5%] w-[300px] h-[300px] bg-indigo-400/10 blur-[80px] rounded-full" />
              </div>

              <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                  <div className="lg:col-span-5 space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-black text-xl">I</span>
                      </div>
                      <span className="font-black text-2xl text-slate-900 dark:text-white tracking-tighter">Ikiké Health AI</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                      {h('heroSubtitle')}
                    </p>
                    <div className="flex gap-4">
                      {/* Placeholder for Social Icons if needed */}
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shadow-sm">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('platform')}</h4>
                      <ul className="space-y-4">
                        <li><Link href="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('intelSearch')}</Link></li>
                        <li><Link href="/articles" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('articles')}</Link></li>
                        <li><Link href="/directory" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('directory')}</Link></li>
                        <li><Link href="/community" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('community')}</Link></li>
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('resources')}</h4>
                      <ul className="space-y-4">
                        {/* <li><Link href="/tools" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Professional Tools</Link></li> */}
                        <li><Link href="/history" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('history')}</Link></li>
                        <li><Link href="/support" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('support')}</Link></li>
                      </ul>
                    </div>

                    <div className="space-y-6 col-span-2 sm:col-span-1">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('legal')}</h4>
                      <ul className="space-y-4">
                        <li><Link href="/privacy" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('privacy')}</Link></li>
                        <li><Link href="/terms" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('terms')}</Link></li>
                        <li><Link href="/disclaimer" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">{t('disclaimer')}</Link></li>
                        <li className="pt-4 border-t border-slate-100 dark:border-white/5">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{t('centralHub')}</p>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                            No. 1 Okon Essien Street<br />
                            Uyo, Akwa Ibom, NG
                          </p>
                        </li>
                        <li><Link href="/admin/login" className="text-sm font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors opacity-50 hover:opacity-100">Admin Portal</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-slate-200 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-xs font-bold text-slate-400">&copy; 2026 Ikiké Health AI. {t('copyright')}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status: Optimal</span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
              </AuthCheck>
            </UiProvider>
            </LanguageProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
    );
}
