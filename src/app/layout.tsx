import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  metadataBase: new URL('https://family-events.ru'),
  title: {
    default: "FAMILY — Лучшие тусовки Москвы | Вечеринки и мероприятия",
    template: "%s | FAMILY Moscow"
  },
  description: "Лучшие вечеринки и мероприятия в Москве. Присоединяйся к Family! Топовые DJ, крутые локации, незабываемая атмосфера. Билеты на события онлайн.",
  keywords: ["тусовки москва", "вечеринки москва", "мероприятия москва", "клубы москва", "events moscow", "family moscow", "билеты на вечеринки", "ночная жизнь москва", "концерты москва", "афиша москва"],
  authors: [{ name: "FAMILY Moscow" }],
  creator: "FAMILY Moscow",
  publisher: "FAMILY Moscow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://family-events.ru",
    siteName: "FAMILY Moscow",
    title: "FAMILY — Лучшие тусовки Москвы",
    description: "Лучшие вечеринки и мероприятия в Москве. Присоединяйся к Family!",
    images: [
      {
        url: "/Familylogo.png",
        width: 1200,
        height: 630,
        alt: "FAMILY Moscow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAMILY — Лучшие тусовки Москвы",
    description: "Лучшие вечеринки и мероприятия в Москве. Присоединяйся к Family!",
    images: ["/Familylogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    yandex: "70a78e66a5a42211",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-bg min-h-screen flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}