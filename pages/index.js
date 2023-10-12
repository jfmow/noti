import Link from '@/components/Link'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import Router from 'next/router'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function Home2() {
  const [windowWidth, setWindowWidth] = useState(false)
  useEffect(() => {
    try {
      if (pb.authStore.isValid) {
        Router.push('/page/firstopen')
      }
    } catch { }
  }, [])
  useEffect(() => {
    if (window) {
      if (window.innerWidth < 600) {
        setWindowWidth(true)
      }
    }
  }, [])
  return (
    <>
      <div className={styles.container}>
        {windowWidth ? (
          <Nav2 />

        ) : (
          <Nav />
        )}

        <div className={styles.sections}>

          <Section1 />


          <FeatureCardsSection />
          <CompBanner />
          <BigTextSection1 />
          <BigInspSection />

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


      </div>
    </>
  )
}

function Section1() {
  return (
    <div className={styles.section1}>
      <div className={styles.center}>
        <img className={styles.section1_bannerimg} src='/bannera.jpg' />
        <h1 className={styles.title}>The <span className={styles.section1_title_bg}>Ultimate</span> Note App</h1>
        <p className={styles.subtitle}>Elevate your <span className={styles.section1_title_bg}>Note</span> taking experience to make your notes better.</p>
        <Link className={styles.button_s1} href='/auth/signup'>Get Started</Link>
        <span className={styles.button_s1_subtitle}>{`(It's freee)`}</span>
      </div>
    </div>
  )
}

function Nav() {
  return (
    <div className={styles.sticky}>
      <div className={styles.nav}>
        <div><img width='200' src='/name-new.png' /></div>
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
function Nav2() {
  const [state, setState] = useState(false)
  return (
    <div className={styles.sticky}>
      <div className={styles.nav}>
        <div className={styles.nav_items_mobile}>
          <div><img width='200' src='/name-new.png' /></div>
          <button className={styles.nav_mobile_menu} type='button' onClick={() => setState(!state)}>{state ? (
            <svg id="hide-button" class="h-6 fill-current hidden" viewBox="0 0 20 20"><title>Menu Close</title><polygon points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2" transform="rotate(45 10 10)"></polygon></svg>
          ) : (
            <svg id="show-button" class="h-6 fill-current block" viewBox="0 0 20 20"><title>Menu Open</title><path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z"></path></svg>
          )}</button>
        </div>
        {state && (
          <div className={styles.nav_dropDown}>
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
        )}
      </div>
    </div>
  )
}

function FeatureCardsSection() {
  return (
    <div className={styles.FeatureCardsSection}>
      <h2 className={styles.FeatureCardsSection_title}>Always One Step Ahead</h2>
      <div className={styles.FeatureCardsSection_cards}>
        <div className={styles.FeatureCardsSection_card}>
          <div className={styles.FeatureCardsSection_card_title}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
              <path d="M19.46 10a1 1 0 0 0-.07 1 7.55 7.55 0 0 1 .52 1.81 8 8 0 0 1-.69 4.73 1 1 0 0 1-.89.53H5.68a1 1 0 0 1-.89-.54A8 8 0 0 1 13 6.06a7.69 7.69 0 0 1 2.11.56 1 1 0 0 0 1-.07 1 1 0 0 0-.17-1.76A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0 .55-8.89 1 1 0 0 0-1.75-.11z" />
              <path d="M10.59 12.59a2 2 0 0 0 2.83 2.83l5.66-8.49z" />
            </svg>
            <h4>Fast</h4>
          </div>
          <p className={styles.FeatureCardsSection_card_description}>
            Our app is designed to be lightning fast, ensuring you can create, edit, and access your notes without any delays. Say goodbye to waiting around for your notes to load.
          </p>
        </div>

        <div className={styles.FeatureCardsSection_card}>
          <div className={styles.FeatureCardsSection_card_title}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M3.72 6.04c.47.46 1.21.48 1.71.06.37-.32.69-.51.87-.43.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1h1.21c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25h-1.22c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3c-1.09 0-2.04.63-2.7 1.22-.53.48-.53 1.32-.02 1.82zm10.16 12.51c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z" /></svg>
            <h4>Easy to Use</h4>
          </div>
          <p className={styles.FeatureCardsSection_card_description}>
            Our user-friendly interface makes creating and managing notes a breeze. Whether you're tech-savvy or new to note-taking apps, you'll find our app intuitive and easy to navigate.
          </p>
        </div>

        <div className={styles.FeatureCardsSection_card}>
          <div className={styles.FeatureCardsSection_card_title}>
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24" /></g><g><g><path d="M8.79,9.24V5.5c0-1.38,1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5v3.74c1.21-0.81,2-2.18,2-3.74c0-2.49-2.01-4.5-4.5-4.5 s-4.5,2.01-4.5,4.5C6.79,7.06,7.58,8.43,8.79,9.24z M14.29,11.71c-0.28-0.14-0.58-0.21-0.89-0.21h-0.61v-6 c0-0.83-0.67-1.5-1.5-1.5s-1.5,0.67-1.5,1.5v10.74l-3.44-0.72c-0.37-0.08-0.76,0.04-1.03,0.31c-0.43,0.44-0.43,1.14,0,1.58 l4.01,4.01C9.71,21.79,10.22,22,10.75,22h6.1c1,0,1.84-0.73,1.98-1.72l0.63-4.47c0.12-0.85-0.32-1.69-1.09-2.07L14.29,11.71z" /></g></g></svg>
            <h4>Intuitive</h4>
          </div>
          <p className={styles.FeatureCardsSection_card_description}>
            Our app's intuitive design ensures that you can start using it right away. No steep learning curve - just open and start creating your notes effortlessly.
          </p>
        </div>

        <div className={styles.FeatureCardsSection_card}>
          <div className={styles.FeatureCardsSection_card_title}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M10.59 4.59C10.21 4.21 9.7 4 9.17 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-1.41-1.41z" /></svg>
            <h4>Organized</h4>
          </div>
          <p className={styles.FeatureCardsSection_card_description}>
            Keep your notes neatly organized with our app. Create folders, categorize your notes, and search effortlessly (coming soon) to find what you need when you need it.
          </p>
        </div>

        <div className={styles.FeatureCardsSection_card}>
          <div className={styles.FeatureCardsSection_card_title}>
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24" x="0" /></g><g><g><path d="M19.46,8l0.79-1.75L22,5.46c0.39-0.18,0.39-0.73,0-0.91l-1.75-0.79L19.46,2c-0.18-0.39-0.73-0.39-0.91,0l-0.79,1.75 L16,4.54c-0.39,0.18-0.39,0.73,0,0.91l1.75,0.79L18.54,8C18.72,8.39,19.28,8.39,19.46,8z M11.5,9.5L9.91,6 C9.56,5.22,8.44,5.22,8.09,6L6.5,9.5L3,11.09c-0.78,0.36-0.78,1.47,0,1.82l3.5,1.59L8.09,18c0.36,0.78,1.47,0.78,1.82,0l1.59-3.5 l3.5-1.59c0.78-0.36,0.78-1.47,0-1.82L11.5,9.5z M18.54,16l-0.79,1.75L16,18.54c-0.39,0.18-0.39,0.73,0,0.91l1.75,0.79L18.54,22 c0.18,0.39,0.73,0.39,0.91,0l0.79-1.75L22,19.46c0.39-0.18,0.39-0.73,0-0.91l-1.75-0.79L19.46,16 C19.28,15.61,18.72,15.61,18.54,16z" /></g></g></svg>
            <h4>Customizable</h4>
          </div>
          <p className={styles.FeatureCardsSection_card_description}>
            Tailor the app to your needs. Customize themes and layouts to create a note-taking environment that suits your style and preferences.
          </p>
        </div>

        <div className={styles.FeatureCardsSection_card}>
          <div className={styles.FeatureCardsSection_card_title}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
            <h4>Open Source</h4>
          </div>
          <p className={styles.FeatureCardsSection_card_description}>
            We believe in transparency and community collaboration. Our app is open source, allowing developers to contribute, improve, and customize it to their liking. Join the open-source community and be a part of our app's evolution.
          </p>
        </div>
      </div>
    </div>
  )
}

function CompBanner() {
  return (
    <div className={styles.CompBanner}>
      <h3>Made by a student, for students, for the community</h3>
      <div className={styles.CompBanner_logos}>
        <Link href='https://github.com/jfmow/noti'><img src='GitHub_Logo.png' /></Link>
        <Link href='https://jamesmowat.com'><img src='jamesmowat.svg' /></Link>
      </div>
    </div>
  )
}

function BigTextSection1() {
  return (
    <div className={styles.BigTextSection1}>
      <div className={styles.BigTextSection1_box}>
        <h2 className={styles.BigTextSection1_title}>Create Notes Faster</h2>
        <p className={styles.BigTextSection1_text}>Create notes from anywhere. With small components our app is able to load with minimal data usage</p>
        <Link className={styles.button_s1_invert} href='/auth/signup'>Start creating now!</Link>
      </div>
    </div>
  )
}

function OpenSourseSection() {
  return (
    <div className={styles.OpenSourseSection}>
      <h2 className={styles.OpenSourseSection_title}>Made with open source tools</h2>
      <div className={styles.OpenSourseSection_cards}>
        <div className={styles.OpenSourseSection_card}>
          <div className={styles.OpenSourseSection_card_title}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V17c0 .55.45 1 1 1h3.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H23c.55 0 1-.45 1-1v-.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" /></svg>
            <h4>Free to use</h4>
          </div>
          <p className={styles.OpenSourseSection_card_description}>
            Our app can be download and hosted by anyone with ease. It's open source too so you can customise it however you like.
          </p>
        </div>
        <div className={styles.OpenSourseSection_card}>
          <div className={styles.OpenSourseSection_card_title}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" ><path d="M16.01 7 16 4c0-.55-.45-1-1-1s-1 .45-1 1v3h-4V4c0-.55-.45-1-1-1s-1 .45-1 1v3h-.01C6.9 7 6 7.9 6 8.99v4.66c0 .53.21 1.04.58 1.41L9.5 18v2c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-2l2.92-2.92c.37-.38.58-.89.58-1.42V8.99C18 7.89 17.11 7 16.01 7z" /></svg>            <h4>Community powered</h4>
          </div>
          <p className={styles.OpenSourseSection_card_description}>
            Built with open-source tools and packages you know how everything works and know nothing sneaky is going on.
          </p>
        </div>
      </div>
    </div>
  )
}

function BigInspSection() {
  return (
    <div className={styles.BigInspSection}>
      <div className={styles.BigInspSection_content}>
        <img className={styles.BigInspSection_img} style={{ gridArea: 'A' }} src='/8Bit/pinkgirl8bit.jpg' />
        <img className={styles.BigInspSection_img} style={{ gridArea: 'B' }} src='/8Bit/pop8bitboy.jpg' />
        <img className={styles.BigInspSection_img} style={{ gridArea: 'C' }} src='/8Bit/pinkgirl8bit.jpg' />
        <img className={styles.BigInspSection_img} style={{ gridArea: 'D' }} src='/8Bit/boywalking.jpg' />
        <img className={styles.BigInspSection_img} style={{ gridArea: 'E' }} src='/8Bit/boydeskreading8bit.jpg' />
      </div>
    </div>
  )
}