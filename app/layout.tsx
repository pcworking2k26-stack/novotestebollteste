// ROTA: app/layout.tsx
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

const PIXEL_ID = '1502866891279664';

export const metadata: Metadata = {
  title: 'Desafio do Hexa | Evento Promocional',
  description: 'Verifique sua participação em uma rodada promocional do Desafio do Hexa.',
  applicationName: 'Desafio do Hexa',
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
            fbq('track', 'ViewContent', {content_name: 'Pre LP Desafio do Hexa', content_category: 'challenge_game'});
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
