import Link from "@/components/Link";
import styles from '@/styles/nav.module.css'
export default function Nav() {
  return (
    <div className={styles.container}>
      <Link href='#features'>
        Features
      </Link>
      <Link target='blank' href='https://github.com/jfmow/noti'>
        Selfhost
      </Link>
      <Link href='/auth/login'>
        Login
      </Link>
    </div>
  );
}