import Link from "@/components/Link";
import styles from '@/styles/nav.module.css'
import { useEffect, useState } from 'react';
export default function Nav() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobile(true)
    }
  })
  return (
    <div className={styles.navcontainer}>
      <div className={styles.items}>
        {!mobile && (
          <img src='/banner.png' height='33' />
        )}

        <div className={styles.links}>
          <Link className={styles.link} href='https://github.com/jfmow/noti/blob/master/README.md'>About</Link>
          <Link className={styles.link} href='https://github.com/jfmow/noti'>Self-host</Link>
        </div>
        <Link className={styles.link} href='/auth/login'>
          Login
        </Link>
      </div>
    </div>
  );
}