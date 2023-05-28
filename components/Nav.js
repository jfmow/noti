import Link from "next/link";
import styles from '@/styles/nav.module.css'
export default function Nav() {
    return (
        <>

            <div className={styles.nav_container}>
                <div className={styles.navitems}>
                    <Link href='/pages' className={styles.navitems_item}>Pages</Link>
                    <Link href='/u/me' className={styles.navitems_item}>Account</Link>
                </div>
                <div className={styles.navitems_useraccount}>
                    
                </div>
            </div>

        </>
    )
}