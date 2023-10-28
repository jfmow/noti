import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import Router from 'next/router';
import '@/components/toast.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (Router.pathname === '/') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`${process.env.NEXT_PUBLIC_CURRENTURL}/service-worker-min.js`)
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      }
    }
  }, []);

  return (
    <>
      <Toaster richColors />
      <Component {...pageProps} />
    </>
  );
}
