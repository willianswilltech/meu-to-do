import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fluent Task Manager',
  description: 'A polished, responsive task management application inspired by Microsoft To Do.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.className}>
      <body suppressHydrationWarning className="bg-gray-50">{children}</body>
    </html>
  );
}
