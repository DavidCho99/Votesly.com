import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '../components/Providers';
import BottomNav from '../components/layout/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GridironVote',
  description: 'College Football Fan Support Rankings',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} pb-20 bg-[#0A0D15] text-white`} style={{ overscrollBehaviorY: 'none' }}>
        <Providers>
          <div className="min-h-screen tracking-tight selection:bg-amber-500/30 flex flex-col items-center">
            <main className="w-full max-w-3xl relative min-h-screen shadow-2xl shadow-black/50 border-x border-white/5 overflow-x-hidden pb-16">
              {children}
            </main>
            <div className="w-full max-w-3xl border-x border-white/5 bg-[#0F131F]/90 backdrop-blur-3xl border-t fixed bottom-0 z-50">
               <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
