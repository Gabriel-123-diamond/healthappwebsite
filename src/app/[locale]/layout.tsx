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
import AuthCheck from "@/components/AuthCheck";
import AiChatbot from "@/components/chat/AiChatbot";
import { Activity } from "lucide-react";

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
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <LanguageProvider initialLocale={locale as any}>
          <AuthCheck>
            <PushNotificationManager />
            <AiChatbot />
            <GlobalDisclaimer />
            <Header />
            <main className="flex-grow dark:bg-slate-900">
              {children}
            </main>
            <footer className="relative bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 pt-24 pb-12 px-4 overflow-hidden">
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
                      Bridging modern clinical science with traditional herbal wisdom through explainable artificial intelligence.
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
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Platform</h4>
                      <ul className="space-y-4">
                        <li><Link href="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Intelligence Search</Link></li>
                        <li><Link href="/articles" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Scientific Articles</Link></li>
                        <li><Link href="/directory" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Expert Directory</Link></li>
                        <li><Link href="/community" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Community Grid</Link></li>
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Resources</h4>
                      <ul className="space-y-4">
                        <li><Link href="/tools" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Professional Tools</Link></li>
                        <li><Link href="/history" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Synthesis History</Link></li>
                        <li><Link href="/support" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Assistance Center</Link></li>
                      </ul>
                    </div>
                    <div className="space-y-6 col-span-2 sm:col-span-1">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Legal Core</h4>
                      <ul className="space-y-4">
                        <li><Link href="/privacy" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Privacy Protocol</Link></li>
                        <li><Link href="/terms" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/disclaimer" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">Medical Disclaimer</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-slate-200 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-xs font-bold text-slate-400">&copy; 2026 Ikiké Health AI. Global Intelligence Standard.</p>
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
            </LanguageProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
    );
}
