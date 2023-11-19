import { Link, Paragraph } from '@/components/UX-Components'
import styles from '@/styles/Home2.module.css'
import Router from 'next/router'
import { useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
export default function Home() {
  useEffect(() => {
    if (window.localStorage.getItem('pocketbase_auth')) {
      Router.replace('/page/firstopen')
    }
  }, [])
  return (
    <>
      <div className={styles.container}>
        <Nav />
        <Header />
        <Features />
        <Image>
          <img src='/page-alone.png' />
        </Image>
        <Card>
          <h1>Free forever</h1>
          <p>
            Never pay a penny. Why charge for someone else's knowlege
          </p>
        </Card>
        <Image>
          <img src='/page.png' />
        </Image>

        <Footer />
      </div>
    </>
  )
}

function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <img width={24} src='logo.png' />

        <span>savemynotes</span>
      </div>
      <div className={styles.links}>
        <Link>Home</Link>
        <Link href='https://github.com/jfmow/noti'>Selfhost</Link>
        <Link href='/auth/login'>Login</Link>
      </div>
      <Link href='/auth/signup' className={styles.calltoaction}>Get started</Link>
    </nav>
  )
}

function Header() {
  return (
    <div className={styles.header}>
      <h1>Note taking shouldn't be hard.</h1>
      <Paragraph>
        Savemynotes makes note taking simple. With an easy to use desgin and features you can understand, making it a brease to use and look at.
        <br />Putting <strong>your</strong> notes in <strong>your hands</strong>
      </Paragraph>
      <div className={styles.buttons}>
        <Link href='/page/rzz50e2mnhgwof2' className={styles.calltoaction_alt}>Explore the demo</Link>
        <Link href='/auth/signup' className={styles.calltoaction}>Get started</Link>
      </div>
    </div>
  )
}

function Features() {
  return (
    <div className={styles.features}>
      <motion.div initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.85 }} className={styles.card}>
        <ctitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
          Features
        </ctitle>
        <Paragraph>
          Easy to use, easy to keep using.<br />Simplifed so you can focus on writing and not worry about how it looks
        </Paragraph>
      </motion.div>
      <motion.div initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.9 }} className={styles.card}>
        <ctitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-click"><path d="m9 9 5 12 1.8-5.2L21 14Z" /><path d="M7.2 2.2 8 5.1" /><path d="m5.1 8-2.9-.8" /><path d="M14 4.1 12 6" /><path d="m6 12-1.9 2" /></svg>
          Intuitive
        </ctitle>
        <Paragraph>
          Our app's intuitive design ensures that you can start using it right away. No steep learning curve - just open and start creating your notes effortlessly.

        </Paragraph>
      </motion.div>
      <motion.div initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.95 }} className={styles.card}>
        <ctitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bring-to-front"><rect x="8" y="8" width="8" height="8" rx="2" /><path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" /><path d="M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" /></svg>
          Organized
        </ctitle>
        <Paragraph>
          Keep your notes neatly organized with our app. Create folders, categorize your notes, and search effortlessly (coming soon) to find what you need when you need it.
        </Paragraph>
      </motion.div>
      <motion.div initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 1 }} className={styles.card}>
        <ctitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
          Open Source
        </ctitle>
        <Paragraph>
          Knowing what the software your using is doing should be visible. No hiding behind a curtan. And this allows for community collaboration which helps make these apps even better.
        </Paragraph>
      </motion.div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div className={styles.longcard}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

function Image({ children }) {
  return (
    <div className={styles.image}>
      {children}
    </div>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <img width={24} src='logo.png' />

        <span style={{ display: 'flex', flexDirection: 'row', gap: '3px', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copyright"><circle cx="12" cy="12" r="10" /><path d="M14.83 14.83a4 4 0 1 1 0-5.66" /></svg>
          <strong>James Mowat</strong> 2023-current
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link href='/auth/terms-and-conditions'>Terms & Conditions</Link>
        <Link href='/auth/privacy-policy'>Privacy policy</Link>
        <Link href='/auth/disclamer'>Disclamer</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link href='/auth/login'>Login</Link>
        <Link href='/auth/signup'>Signup</Link>
        <Link href='/page/rzz50e2mnhgwof2'>Preview</Link>
        <Link href='https://github.com/jfmow/noti'>Selfhost</Link>
        <Link href='https://jamesmowat.com/'>James Mowat</Link>
      </div>
    </footer>
  )
}