'use client';

import Script from 'next/script';

interface ClientScriptProps {
  src: string;
  strategy: 'lazyOnload' | 'afterInteractive' | 'beforeInteractive';
  onLoad: () => void;
}

export default function ClientScript({ src, strategy, onLoad }: ClientScriptProps) {
  return <Script src={src} strategy={strategy} onLoad={onLoad} />;
}