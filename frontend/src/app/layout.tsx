import type { Metadata } from 'next';
import ConfigureAmplifyClientSide from '@/components/ConfigureAmplify';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spectraleaf — IoT Tea Fermentation Monitoring',
  description:
    'Real-time monitoring and analytics for industrial tea fermentation operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base text-text-primary antialiased">
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
