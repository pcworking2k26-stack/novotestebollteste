// ROTA: app/layout.tsx
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

const PIXEL_ID = '1502866891279664';

export const metadata: Metadata = {
  title: 'Jogo do Hexa | Rodada Promocional',
  description: 'Verifique sua banca promocional e avance para o cadastro oficial.',
  applicationName: 'Jogo do Hexa',
  icons: {
    icon: '/logo.png'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#061106'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
            fbq('track', 'ViewContent', {content_name: 'Pre LP Jogo do Hexa', content_category: 'pre_cadastro'});
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
