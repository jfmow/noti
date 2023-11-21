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

      function isClickableElement(element) {
        return element.tagName === "A" || element.tagName === "BUTTON" || typeof element.onclick === "function";
      }
      function handleLinkOrButtonClick(event) {
        var target = event.target;

        if (isClickableElement(target)) {
          if (target.tagName === "A" && target.getAttribute("data-track-event")) {
            if (target && target.getAttribute("data-track-event") && target.href) {
              event.preventDefault();
              Analytics(target.getAttribute("data-track-event"))
              Router.push(link.href)
            }
          } else if ((target.tagName === "BUTTON" && target.getAttribute("data-track-event")) || (typeof target.onclick === "function" && target.getAttribute("data-track-event"))) {
            Analytics(target.getAttribute("data-track-event"))
          }
        }
      }
      handleLinkOrButtonClick(e)
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
