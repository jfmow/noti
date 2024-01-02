import '@/styles/globals.css';
import { ToastContainer } from '@/components/toast';
import "@/components/toaster.css"

export default function App({ Component, pageProps }) {

  return (
    <>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}
