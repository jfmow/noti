import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
//import { register } from 'next-offline/runtime';
import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
export default function App({ Component, pageProps }) {
  useEffect(() => {
    //register('https://beta.jamesmowat.com/service-worker.js')
    //register(`${process.env.NEXT_PUBLIC_CURRENTURL}/service-worker.js`)
  }, [])
  return (
    <>
      <Nav />
      <ToastContainer position="top-left" />
      <Component {...pageProps} />
    </>
  )
}
