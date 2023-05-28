import React from 'react';
import styles from '@/styles/OHome.module.css';
import Link from 'next/link';
import PocketBase from 'pocketbase'
import { useEffect } from 'react';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
const Home = () => {
  useEffect(() => {
    async function authUpdate() {
      try {
        const authData = await pb.collection('users').authRefresh();
        if (pb.authStore.isValid == false) {
          pb.authStore.clear();
        } else {
          window.location.replace('/pages')
        }
        if (authData.record.disabled) {
          pb.authStore.clear()
          return window.location.replace('/u/disabled')
        }
      } catch (error) {
        pb.authStore.clear();
      }
    }
    authUpdate()
  }, []);
  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.subtitle}>Welcome to</h3>
          <h1 className={styles.title}>Noti</h1>
          <h5 className={styles.description}>The best note-taking app ever</h5>
          <Link  href='/auth/signup' className={styles.Btn}>
            Join now
            </Link>
        </div>
      </header>
      

    </div>
  );
};

export default Home;
