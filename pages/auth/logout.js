import PocketBase from 'pocketbase';
import styles from '@/styles/Auth.module.css'
import Link from 'next/link';
import { useEffect } from 'react';
import Head from 'next/head';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);


export default function Login() {
  function logOut() {
    pb.authStore.clear();
    window.location.replace("/")
    return
  }
  
  const status = pb.authStore.isValid
  useEffect(() => {
    
  if (status == false) {
    window.location.replace("/auth/login")
    return 
  } 
}, []);
  
  return (
    <div>
        <Head>
            <title>Logout</title>
            <link rel="favicon" href="/favicon.ico"/>
            <meta name="robots" content="noindex"></meta>
        </Head>
      <div>
                <div className={styles.login}>
                    <div className={styles.card} style={{gridColumn: "1 !important"}}>
                        <h4 className={styles.title}>Logout!</h4>
                        <form>
                            <div className={styles.buttons}>
                                <button className={styles.crbtn} onClick={logOut} type="submit">Logout</button>
                                <Link passHref legacyBehavior href="/"><a className={styles.btn} >Cancel</a></Link>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>

    </div>
    
  )

}