import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { TMAProvider } from '@/components/TMAProvider';

export const metadata: Metadata = {
  title: 'Kinora - Movie Streaming',
  description: 'Movie streaming platform for Telegram Mini Apps.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <TMAProvider>
          {children}
        </TMAProvider>
      </body>
    </html>
  );
}
