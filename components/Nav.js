import Link from "next/link";
import styles from '@/styles/nav.module.css'
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react';
import Image from "next/image";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function Nav() {
    const [loggedIn, setLoggedIn] = useState(false)
    useEffect(() => {
        if (pb.authStore.isValid) {
            setLoggedIn(true)
        }
    })
    if (loggedIn) {
        return (
            <>

                <div className={styles.nav_container}>
                <div className={styles.navitems}>
                    <Link href='/pages' className={styles.navitems_item}>Pages</Link>
                    <Link href='/u/me' className={styles.navitems_item}>Account</Link>
                    
                </div>
                </div>

            </>
        )
    }
    return (
        <>

            <div className={styles.nav_container}>
                <div className={styles.navitems}>
                    <Link href='/preview/firstopen' className={styles.navitems_item}>Demo</Link>
                    <Link href='/auth/login' className={styles.navitems_item}>Login</Link>
                    
                </div>
            </div>

        </>
    )
}