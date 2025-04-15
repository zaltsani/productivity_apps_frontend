import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  preload: false
})

export const metadata = {
  title: "Shiro Productivity Apps",
  description: "Productivity Apps Created by ShiroTech22",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${space_grotesk.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
