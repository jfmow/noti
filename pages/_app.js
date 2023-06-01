import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { register } from 'next-offline/runtime';
import { useEffect, useState } from 'react';
import UAParser from 'ua-parser-js';
import { useRouter } from 'next/router';
export default function App({ Component, pageProps }) {
  const parser = new UAParser();
  const userAgent = parser.getDevice()
  const router = useRouter()
  useEffect(()=>{
    //register('https://beta.jamesmowat.com/service-worker.js')
    if(userAgent.type === 'mobile'){
      router.push('https://m.noti.jamesmowat.com/')
    }
    register(`${process.env.NEXT_PUBLIC_CURRENTURL}/service-worker.js`)
  })
  return (
    <>
      <ToastContainer position="top-left" />
      <Component {...pageProps} />
    </>
  )
}
