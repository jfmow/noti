import Link from '@/components/Link'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react'
import PocketBase from 'pocketbase'
import Router from 'next/router'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function Home2() {
  useEffect(() => {
    try {
      if (pb.authStore.isValid) {
        Router.push('/page/firstopen')
      }
    } catch { }
  }, [])
  return (
    <>
      <div className={styles.container}>
        <Nav />
        <Section1 />
        <div className={`${styles.section}`}>
          <div className={styles.s2_answer_img} >
            <img src='/pagepreview.png' />
          </div>
          <div>
            <span className={`${styles.s2_title}`}>Stand out from the rest</span>
          </div>
          <div>
            <span className={styles.s2_question}>And create notes like a pro.</span>
          </div>


        </div>
        <div className={`${styles.section} ${styles.section_algin}`}>
          <div className={styles.customdivider}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className={styles.customdivider_shapefill}></path>
            </svg>
          </div>
          <img className={styles.alone_img} src={`/feature.png`} alt="A cool feature image" />

          <div>
            <span className={`${styles.s2_title} ${styles.mobile_s2_title_sml}`}>Fast</span>
            <span className={`${styles.s2_title} ${styles.mobile_s2_title_sml}`}>Simple</span>
            <span className={`${styles.s2_title} ${styles.mobile_s2_title_sml}`}>Easy to use</span>
          </div>
          <div className={styles.customdivider_wave_bottom}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={styles.customdivider_wave_bottom_shapefill}></path>
            </svg>
          </div>

        </div>
        <div className={styles.section}>
          <div>
            <div>
              <span className={styles.s2_title}>It's your data!</span>
            </div>
          </div>
          <div className={styles.s2_cards} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ height: '100%' }} className={styles.fcard}>
              <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="m11.19 1.36-7 3.11C3.47 4.79 3 5.51 3 6.3V11c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6.3c0-.79-.47-1.51-1.19-1.83l-7-3.11c-.51-.23-1.11-.23-1.62 0zM12 11.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>
              </div>Safe and secure</span>
              <p>It's your data so if you self host it's yours to look at not us. And even then if you don't it's still your data and not for us to go touchy looky at.</p>
            </div>
            <div style={{ height: '100%' }} className={styles.fcard}>
              <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" /></svg>
              </div>Kept how you like it</span>
              <p>Host it on your own server and when you delete something, you know it's very very gone.</p>
            </div>
          </div>
        </div>
        <div className={styles.section2} style={{ background: 'rgb(247 238 255)' }}>
          <div className={styles.customdivider}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className={styles.customdivider_shapefill}></path>
            </svg>
          </div>
          <div className={styles.section2_div}>
            <span className={styles.s2_title}>Simple ui</span>
            <div className={styles.fcards}>
              <div className={styles.fcarddual}>
                <div className={styles.fcards}>
                  <div className={styles.fcard}>
                    <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><circle cx="14.5" cy="10.5" r="1.25" /><circle cx="9.5" cy="10.5" r="1.25" /><path d="M16.1 14H7.9c-.19 0-.32.2-.23.37C8.5 15.94 10.13 17 12 17s3.5-1.06 4.33-2.63a.262.262 0 0 0-.23-.37zm6.84-2.66a4.008 4.008 0 0 0-2.81-3.17 9.114 9.114 0 0 0-2.19-2.91C16.36 3.85 14.28 3 12 3s-4.36.85-5.94 2.26c-.92.81-1.67 1.8-2.19 2.91a3.994 3.994 0 0 0-2.81 3.17c-.04.21-.06.43-.06.66 0 .23.02.45.06.66a4.008 4.008 0 0 0 2.81 3.17 8.977 8.977 0 0 0 2.17 2.89C7.62 20.14 9.71 21 12 21s4.38-.86 5.97-2.28c.9-.8 1.65-1.79 2.17-2.89a3.998 3.998 0 0 0 2.8-3.17c.04-.21.06-.43.06-.66 0-.23-.02-.45-.06-.66zM19 14c-.1 0-.19-.02-.29-.03-.2.67-.49 1.29-.86 1.86C16.6 17.74 14.45 19 12 19s-4.6-1.26-5.85-3.17c-.37-.57-.66-1.19-.86-1.86-.1.01-.19.03-.29.03-1.1 0-2-.9-2-2s.9-2 2-2c.1 0 .19.02.29.03.2-.67.49-1.29.86-1.86C7.4 6.26 9.55 5 12 5s4.6 1.26 5.85 3.17c.37.57.66 1.19.86 1.86.1-.01.19-.03.29-.03 1.1 0 2 .9 2 2s-.9 2-2 2z" /></svg>
                    </div>Simple</span>
                    <p>Simple and accessible ui so you can get your notes down faster and better.</p>
                  </div>
                  <div className={styles.fcard}>
                    <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>
                    </div>Playfull</span>
                    <p>Lots of color to make sure your notes stand out! Customisable icons and notes so you can easily find them.</p>
                  </div>
                </div>
                <div className={styles.fcard}>
                  <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><circle cx="12" cy="16" r="1" /><path d="M12 13c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z" /><path d="M17 1H7c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 17H7V6h10v12z" /></svg>
                  </div>Robust</span>
                  <p>With a large market of devices we have made it so you can use savemynotes on your phone, laptop, tablet etc easily and with a consistant look between them all.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
        <div className={styles.footer}>
          <h3>Made with <img src='/emoji/twitter/64/1f496.png' width='16' height='16' /> by James M</h3>
          <h5>
            Explore on{' '}
            <Link aria-label="jfmow github link" href="https://github.com/jfmow" target="_blank">
              <svg className={styles.githublogo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                />
              </svg>
            </Link>
          </h5>
        </div>
      </div>
    </>
  )
}

function Section1() {
  return (
    <div className={styles.section1}>
      <div className={styles.center}>
        <h1 className={styles.title}>The Ultimate Note App To Elevate Your Note-Taking Experience</h1>
        <p className={styles.subtitle}>SaveMyNotes is a complimentary starter template created using NextJS and PocketBase, equipped with all the essentials to kickstart your note taking and streamline your workflow.</p>
        <Link className={styles.button_s1} href='/auth/signup'>Get Started For Free</Link>
      </div>
    </div>
  )
}

function Nav() {
  return (
    <div className={styles.sticky}>
      <div className={styles.nav}>
        <div><img width='200' src='/name.png' /></div>
        <div className={styles.nav_links}>
          <Link href='/'>Home</Link>
          <Link href='/preview'>Preview</Link>
          <Link href='https://github.com/jfmow/noti'>Selfhost</Link>
          <Link href='/auth/login'>Login</Link>
        </div>
        <div className={styles.nav_buttons}>
          <Link href='/auth/signup' className={styles.nav_button_main}>Get started</Link>
        </div>
      </div>
    </div>
  )
}