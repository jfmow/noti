import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import Router from 'next/router';
import '@/components/toast.css'
import { ToastContainer } from '@/components/toasty';
import { generateDeviceFingerprint } from '@/lib/Fingerprint';

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

  useEffect(() => {
    async function Analytics(button) {
      try {
        const id = await generateDeviceFingerprint()
        const currentPage = Router.asPath
        const data = {
          url: currentPage,
          id: id,
          action: button ? button : ''
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/api/you`, {
          method: 'POST', // Specify the HTTP method
          headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
          },
          body: JSON.stringify(data), // Convert the data to a JSON string
        });
      } catch {
        console.error('Analytics error')
      }
    }
    Analytics()
    window.addEventListener('click', (e) => {
      Analytics((e.target.tagName + ' ' + e.target.innerText) || e.target.tagName + ' button')
    })
    return () => {
      window.removeEventListener('click', (e) => {
        Analytics((e.target.tagName + ' ' + e.target.innerText) || e.target.tagName + ' button')
      })
    }
  })

  return (
    <>
      <ToastContainer />
      <Toaster richColors />
      <Component {...pageProps} />
    </>
  );
}
