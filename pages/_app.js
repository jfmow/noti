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
    function getAction(e) {
      let inputString = Array.from(e.target.classList)[0];
      let outputString = inputString?.replace(/_+|__.+$/, ' ');

      Analytics((e.target.parentElement.ariaLabel ? e.target.parentElement.ariaLabel.replace(/_/g, '') : e.target.innerText ? e.target.innerText : outputString?.split('__')[0]))
    }
    window.addEventListener('click', (e) => getAction(e))
    return () => {
      window.removeEventListener('click', (e) => getAction(e))
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
