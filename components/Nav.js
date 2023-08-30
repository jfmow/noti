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
        <div>
          <img src='/banner.png' height={mobile ? '30' : '50'} />
        </div>
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