import "./globals.css";
import { AppNavbar } from "../components/navigation/AppNavbar";
import { getAssetUrl } from "../lib/utils/basePath";

export const metadata = {
  title: "KUBERAN DHARMA APP — Learn Sacred Scriptures",
  description: "Learn Ramayana, Mahabharata, Bhagavad Gita, Vedas, and Puranas in bite-sized Dharma Cards across 6 languages.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#6B1D2F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={getAssetUrl('/images/kuberan_logo_transparent.png')} />
      </head>
      <body className="min-h-screen bg-stitch-ivory text-stitch-slate antialiased flex flex-col selection:bg-stitch-maroon selection:text-stitch-ivory">
        <AppNavbar />
        {children}
      </body>
    </html>
  );
}
