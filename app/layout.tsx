import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import SessionProvider from '@/components/providers/SessionProvider';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Zara Fashion — Shop Latest Trends in Nigeria',
    template: '%s | Zara Fashion',
  },
  description:
    'Discover the latest fashion trends at Zara Fashion. Shop women\'s clothing, men\'s clothing, shoes, bags, accessories & beauty products. Fast delivery across Nigeria.',
  keywords: [
    'fashion', 'clothing', 'nigeria', 'online shopping', 'women fashion',
    'men fashion', 'shoes', 'bags', 'accessories', 'beauty', 'lagos',
    'affordable fashion', 'ankara', 'native wear', 'dresses',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Zara Fashion',
    title: 'Zara Fashion — Shop Latest Trends in Nigeria',
    description: 'Discover the latest fashion trends. Shop women\'s & men\'s clothing, shoes, bags & beauty products.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-black min-h-screen flex flex-col">
        <SessionProvider>
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </SessionProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
