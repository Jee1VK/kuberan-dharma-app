import "./globals.css";
import { AppNavbar } from "../components/navigation/AppNavbar";
import { MobileBottomNav } from "../components/navigation/MobileBottomNav";
import { ServiceWorkerRegister } from "../components/pwa/ServiceWorkerRegister";
import { getAssetUrl } from "../lib/utils/basePath";

export const metadata = {
  title: "KUBERAN DHARMA APP — Learn Sacred Scriptures",
  description: "Learn Ramayana, Mahabharata, Bhagavad Gita, Vedas, and Puranas in bite-sized Dharma Cards across 6 languages.",
};

export const viewport = {
  themeColor: "#6B1D2F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href={getAssetUrl('/images/favicon-32x32.png')} />
        <link rel="icon" type="image/png" sizes="16x16" href={getAssetUrl('/images/favicon-16x16.png')} />
        <link rel="apple-touch-icon" sizes="180x180" href={getAssetUrl('/images/apple-touch-icon.png')} />
        <link rel="manifest" href={getAssetUrl('/manifest.json')} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kuberan Dharma" />
        <meta name="application-name" content="Kuberan Dharma" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-stitch-ivory text-stitch-slate antialiased flex flex-col selection:bg-stitch-maroon selection:text-stitch-ivory pb-20 md:pb-0">
        <ServiceWorkerRegister />
        <AppNavbar />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
