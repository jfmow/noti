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
                    </div>
                    <div className={styles.navitems_useraccount}>
                        <span className={styles.avatar}><Link aria-label='Settings' href="/u/me" passHref><Image width='100' height='100' className={styles.usericon} src={pb.baseUrl + "/api/files/_pb_users_auth_/" + pb.authStore.model?.id + "/" + pb.authStore.model?.avatar + "?thumb=400x400"}></Image></Link></span>
                    </div>
                </div>

            </>
        )
    }
    return (
        <>

            <div className={styles.nav_container}>
                <div className={styles.navitems}>
                    <Link href='/pages' className={styles.navitems_item}>Pages</Link>
                </div>
                <div className={styles.navitems_useraccount}>
                <Link href='/auth/login' className={styles.navitems_item}>Login</Link>

                </div>
            </div>

        </>
    )
}