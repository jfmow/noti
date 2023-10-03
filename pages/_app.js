import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { register } from 'next-offline/runtime';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner'
export default function App({ Component, pageProps }) {

  useEffect(() => {
    //register('https://beta.jamesmowat.com/service-worker.js')
    register(`${process.env.NEXT_PUBLIC_CURRENTURL}/service-worker-min.js`)
  }, [])




  return (
    <>
      <Toaster richColors />
      <Component {...pageProps} />
    </>
  )
}
