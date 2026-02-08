import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gabriela Fernandes Lacerda | Psicóloga Clínica",
  description: "Psicóloga clínica dedicada ao seu bem-estar mental. Atendimento online e presencial com acolhimento e profissionalismo.",
  keywords: ["psicóloga", "psicologia", "terapia", "saúde mental", "psicoterapia", "atendimento online"],
  authors: [{ name: "Gabriela Fernandes Lacerda" }],
  openGraph: {
    title: "Gabriela Fernandes Lacerda | Psicóloga Clínica",
    description: "Psicóloga clínica dedicada ao seu bem-estar mental.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9333ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
