import React, { useState } from 'react';
import styles from '@/styles/OHome.module.css';
import Link from 'next/link';
import PocketBase from 'pocketbase'
import { useEffect } from 'react';
import Nav from '@/components/Nav';
import PlainLoader from '@/components/PlainLoader';
import { useRouter } from 'next/router';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function Home(){
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  useEffect(() => {
    async function authUpdate() {
      try {
        await pb.collection('users').authRefresh();
        if (!pb.authStore.isValid) {
          pb.authStore.clear();
          setIsLoading(false)
        } else {
          router.push('/page/firstopen')
        }
      } catch (error) {
        pb.authStore.clear();
        setIsLoading(false)
      }
      
    }
    authUpdate()
  }, []);
  if(isLoading){
    return <PlainLoader/>
  }
  return (
    <div>
      <Nav/>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.subtitle}>Welcome to</h3>
          <h1 className={styles.title}>Noti</h1>
          <h5 className={styles.description}>The best note-taking app ever</h5>
          <Link href='/auth/signup' className={styles.Btn}>
            Join now
          </Link>
        </div>
      </header>
      <div className={styles.sections}>
        <div className={styles.section1}>
          <div className={styles.content}>
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M220-80q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h70v-96q0-78.85 55.606-134.425Q401.212-920 480.106-920T614.5-864.425Q670-808.85 670-730v96h70q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Zm0-60h520v-434H220v434Zm260.168-140Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM350-634h260v-96q0-54.167-37.882-92.083-37.883-37.917-92-37.917Q426-860 388-822.083 350-784.167 350-730v96ZM220-140v-434 434Z" /></svg>

            <h1>A note taking app like no other!</h1>
            <p>Enjoy your day knowing your notes are safe</p>

          </div>
        </div>
        <div className={styles.section3}>
          <div className={styles.content1}>
            
            <div className={styles.idk}>
              <h1>Super simple</h1>
            </div>
            <p>Fast uploads ensure you are as efficent as posible while keeping your data secure</p>
          </div>
          <div className={styles.content2}>
            <div className={styles.idk}>

              <h1>Fast support</h1>
            </div>
            <p>Quick and responsive assistance is available whenever you need help.</p>
          </div>
          <div className={styles.content3}>
            <div className={styles.idk}>

              <h1>Easy to use</h1>
            </div>
            <p> User-friendly interface makes it simple for anyone to navigate and utilize.</p>
          </div>
          <div className={styles.content4}>
            <div className={styles.idk1}>

              <h1>Fresh</h1>
            </div>
            <p>Stay up-to-date with the latest features and enhancements for an improved experience.</p>
          </div>
        </div>
        
        <div className={styles.section2}>
          <div className={styles.content}>
            <div className={styles.idk}>
              <svg className={styles.icon1} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z" /></svg>

              <h1>Open source</h1>
            </div>
            <p>View the full website on GitHub</p>
          </div>
          <div className={styles.area3} >
            <iframe className={styles.are3if} loading='lazy' src='/preview/page'/>
            <p>(As a preview you cannot save pages)</p>
          </div>
        </div>
      </div>
    <div className={styles.footer}>
      <h3>Made with 💖 by James M</h3>
    </div>
    </div>
  );
};
