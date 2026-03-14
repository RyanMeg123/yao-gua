import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '义理易学顾问',
  description: '诚实、温厚、洞察 — 六爻起卦 · AI 深度解卦',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
