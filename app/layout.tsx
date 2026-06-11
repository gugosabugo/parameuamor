import type { Metadata } from "next";
import { Quicksand } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: "Para meu amor",
  description: "Um site para soller",
};

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-quicksand', // Isso cria uma variável CSS para o Tailwind ler
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${quicksand.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}