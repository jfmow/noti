import Link from "next/link";
import styles from '@/styles/nav.module.css'
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/router";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function Nav() {
  const [loggedIn, setLoggedIn] = useState(false)
  const Router = useRouter()
  useEffect(() => {
    if (pb.authStore.isValid) {
      setLoggedIn(true)
    }
  })
  if (loggedIn) {
    return (
      <>

        <div className={styles.navcontainer}>
          <div className={styles.items}>
            <h1>SaveMyNotes</h1>
            <div className={styles.subitems}>
              <Link className={styles.navlink} href='/page/firstopen'>
                Pages
              </Link>
              <Link className={styles.navlink} href='/u/me'>
                Account
              </Link>
            </div>
          </div>
        </div>

      </>
    )
  }
  return (
    <div className={styles.navcontainer}>
      <div className={styles.items}>
        <h1>SaveMyNotes</h1>
        <Link href="/auth/login" className={styles.sign_Button}>
          Signup
          <div className={styles.sign_hoverEffect}>
            <div></div>
          </div>
        </Link>
      </div>
    </div>
  );
}