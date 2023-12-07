import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import Router from 'next/router';
import { ToastContainer } from '@/components/toast';
import "@/components/toaster.css"
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
          action: button ? button : '',
        };

        // Convert the data object to a query string
        const queryString = Object.keys(data)
          .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
          .join('&');

        const urlWithParams = `${process.env.NEXT_PUBLIC_POCKETURL}/analytics?${queryString}`;

        const res = await fetch(urlWithParams, {
          method: 'GET', // Specify the HTTP method
          headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
          },
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
              Router.push(target.href)
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
