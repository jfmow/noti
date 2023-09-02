import React, { useRef, useState } from 'react';
import styles from '@/styles/OHome.module.css';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import PlainLoader from '@/components/Loader';
import Nav from '@/components/Nav';
import { useInView } from 'react-intersection-observer';
import { motion, useScroll, useTransform } from 'framer-motion'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

function mapValue(inputValue, inputRange, outputRange) {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  // Ensure the inputValue is within the input range
  const clampedInputValue = Math.min(Math.max(inputValue, inputMin), inputMax);

  // Map the clamped input value to the output range
  const mappedValue = ((clampedInputValue - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;

  return mappedValue;
}

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [bg, setBg] = useState(false)
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [scrollYProgress1, setScrollYProgress1] = useState(0);
  const [scrollYProgress2, setScrollYProgress2] = useState(1);

  const floatImgYPos = scrollYProgress1
  const floatImgScale = scrollYProgress2


  useEffect(() => {

    //Manualy doing the values because framer-motion is too dumb on page load for some reason??
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollPosition / maxScroll;
      const scrollYProgress = progress; // Replace with your actual value
      setScrollYProgress(progress)
      const mappedValue1 = mapValue(scrollYProgress, [0, 1], [0, 500]);
      const mappedValue2 = mapValue(scrollYProgress, [0, 1], [1, 10]);
      setScrollYProgress1(mappedValue1)
      setScrollYProgress2(mappedValue2)
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const bgval = Math.random().toPrecision()
    if (bgval > 0.5) {
      setBg(true)
    }
    async function authUpdate() {
      try {
        if (!pb.authStore.isValid) {
          setIsLoading(false);
          pb.authStore.clear();
        } else {
          router.push('/page/firstopen');
        }
      } catch (error) {
        setIsLoading(false);
        pb.authStore.clear();
      }
    }

    authUpdate();
  }, []);

  if (isLoading) {
    return <PlainLoader />;
  }

  return (
    <>
      <Head>
        <title>Note taking for you</title>
        <meta name="description" content="Multi page note editor"></meta>
        <meta name="robots" content="max-snippet:0, noarchive, notranslate, noimageindex"></meta>
        <meta name="keywords" content="JavaScript, Frontend, Developer, Nextjs, react, code, pocketbase, PocketBase, Pocketbase, savemyexams, exam, exams, save, note, notes, notion" />

        <link rel="icon" href="/Favicon.png" />
        <link rel="canonical" href="https://savemynotes.net/" />
      </Head>
      <Nav />
      <p style={{ visibility: '0', width: '0', height: '0' }} aria-label='SEO text'>A place to take your notes with only fetures you will use. Explore note taking more simply.</p>
      <div className={styles.container} id='top'>
        <div className={`${styles.header} ${bg && styles.bgalt}`}>
          <div className={`${styles.headerContent}`}>
            <motion.img src='/float1.png' className={styles.floatimg1} style={{ floatImgYPos, scale: floatImgScale }} />
            <motion.img src='/float2.png' className={styles.floatimg2} style={{ floatImgYPos, scale: floatImgScale }} />
            <motion.img src='/float3.png' className={styles.floatimg3} style={{ floatImgYPos }} />
            <motion.img src='/float4.png' className={styles.floatimg4} style={{ floatImgYPos, scale: floatImgScale }} />
            <motion.img src='/float5.png' className={styles.floatimg5} style={{ floatImgYPos }} />
            <motion.img loading='egar' height='60' className={styles.title} src='/name.png' />

            <span className={styles.header_text}>All your <span className={styles.header_underline}>notes</span> together in one place</span>

            <div style={{ zIndex: '2' }}>
              <button className={styles.Btn} onClick={() => Router.push('/auth/signup')}>
                Start writing now <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M16.01 11H5c-.55 0-1 .45-1 1s.45 1 1 1h11.01v1.79c0 .45.54.67.85.35l2.78-2.79c.19-.2.19-.51 0-.71l-2.78-2.79c-.31-.32-.85-.09-.85.35V11z" /></svg>
              </button>
            </div>
          </div>

        </div>
        <div className={styles.sections}>
          <motion.div
            className={styles.progressbar}
            style={{ scaleX: scrollYProgress }}
          />
          {/* Animate the second section */}
          <AnimatedSection className={styles.section2}>
            <div className={styles.section2_div} id='features'>
              <h2 >Get work done quickly and efficiently</h2>
              <div className={styles.fcards}>
                <div className={styles.fcarddual}>
                  <div className={styles.fcard}>
                    <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none" /><path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44z" /><path d="M10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z" /></svg>
                    </div>Fast loading</span>
                    <p>Experience lightning-fast loading times on our platform. Our optimized infrastructure and efficient algorithms ensure that your workloads load quickly, enabling you to access and complete tasks without delays. Say goodbye to frustrating waiting times and enjoy a seamless workflow.</p>
                  </div>
                  <div className={styles.fcard}>
                    <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M14.82 11h7.13c-.47-4.72-4.23-8.48-8.95-8.95v7.13c.85.31 1.51.97 1.82 1.82zM15 4.58C17 5.4 18.6 7 19.42 9h-3.43c-.28-.37-.62-.71-.99-.99V4.58zM2 12c0 5.19 3.95 9.45 9 9.95v-7.13C9.84 14.4 9 13.3 9 12c0-1.3.84-2.4 2-2.82V2.05c-5.05.5-9 4.76-9 9.95zm7-7.42v3.44c-1.23.92-2 2.39-2 3.98 0 1.59.77 3.06 2 3.99v3.44C6.04 18.24 4 15.35 4 12c0-3.35 2.04-6.24 5-7.42zm4 10.24v7.13c4.72-.47 8.48-4.23 8.95-8.95h-7.13c-.31.85-.97 1.51-1.82 1.82zm2 1.17c.37-.28.71-.61.99-.99h3.43C18.6 17 17 18.6 15 19.42v-3.43z" /></svg>
                    </div>Security</span>
                    <p>We prioritize the security of your data. Our servers are hosted with reputable and industry-leading companies, ensuring that your sensitive information is protected. We implement robust security measures, secure data transmission protocols*1, and regular security audits. Rest assured that your data is safe and secure when using our platform.</p>
                    <span className={styles.disclamer}>*1. We take reasonable measures to protect the security of your personal information and prevent unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.</span>
                  </div>
                </div>
                <div className={styles.fcard}>
                  <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24" /></g><g><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8c0-4.41,3.59-8,8-8 s8,3.59,8,8C20,16.41,16.41,20,12,20z M12.89,11.1c-1.78-0.59-2.64-0.96-2.64-1.9c0-1.02,1.11-1.39,1.81-1.39 c1.31,0,1.79,0.99,1.9,1.34l1.58-0.67c-0.15-0.44-0.82-1.91-2.66-2.23V5h-1.75v1.26c-2.6,0.56-2.62,2.85-2.62,2.96 c0,2.27,2.25,2.91,3.35,3.31c1.58,0.56,2.28,1.07,2.28,2.03c0,1.13-1.05,1.61-1.98,1.61c-1.82,0-2.34-1.87-2.4-2.09L8.1,14.75 c0.63,2.19,2.28,2.78,3.02,2.96V19h1.75v-1.24c0.52-0.09,3.02-0.59,3.02-3.22C15.9,13.15,15.29,11.93,12.89,11.1z" /></g></svg>
                  </div>Free</span>
                  <p>Enjoy all the benefits of our platform at absolutely no cost. We believe in providing accessible tools for individuals and businesses to thrive. Our free offering ensures that you can leverage our fast loading and low data usage features without any financial commitment. Start boosting your productivity today with our free and feature-rich platform. And if you want to pay, only pay for what You use.</p>
                </div>
              </div>
            </div>


          </AnimatedSection>

          <div className={`${styles.section} ${styles.section_algin}`}>
            <img className={styles.alone_img} src={`/feature.png`} alt="A cool feature image" />

            <AnimatedSlideIn>
              <span className={styles.s2_question}>So why use this?</span>
              <div>

                <span className={styles.s2_title}>Because why not!</span>
              </div>
            </AnimatedSlideIn>
          </div>



          <AnimatedSection className={styles.section} >
            <div>
              <span className={styles.s2_title}>Free and open source</span>
            </div>
            <div className={styles.s2_cards} style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <div delay={0} className={styles.s2_card} >
                <span className={styles.s2_card_title}>Explore on github</span>
                <Link href='https://github.com/jfmow/noti'><div className={styles.s2_card_img}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                  />
                </svg></div></Link>
              </div>
              <div delay={0.4} className={styles.s2_card}>
                <span className={styles.s2_card_title}>Self host</span>
                <Link href='https://docker.com/'><div className={styles.s2_card_img}><svg xmlns="http://www.w3.org/2000/svg" aria-label="Docker" role="img" viewBox="0 0 512 512"><rect width="512" height="512" rx="15%" fill="#ffffff" /><path stroke="#066da5" stroke-width="38" d="M296 226h42m-92 0h42m-91 0h42m-91 0h41m-91 0h42m8-46h41m8 0h42m7 0h42m-42-46h42" /><path fill="#066da5" d="m472 228s-18-17-55-11c-4-29-35-46-35-46s-29 35-8 74c-6 3-16 7-31 7H68c-5 19-5 145 133 145 99 0 173-46 208-130 52 4 63-39 63-39" /></svg></div></Link>
              </div>
              <div delay={0.8} className={styles.s2_card}>
                <span className={styles.s2_card_title}>Open source backend</span>
                <Link href='https://pocketbase.io/'><div className={styles.s2_card_img}><svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="25.536" y="13.4861" width="1.71467" height="16.7338" transform="rotate(45.9772 25.536 13.4861)" fill="white" />
                  <path d="M26 14H36.8C37.4628 14 38 14.5373 38 15.2V36.8C38 37.4628 37.4628 38 36.8 38H15.2C14.5373 38 14 37.4628 14 36.8V26" fill="white" />
                  <path d="M26 14H36.8C37.4628 14 38 14.5373 38 15.2V36.8C38 37.4628 37.4628 38 36.8 38H15.2C14.5373 38 14 37.4628 14 36.8V26" stroke="#16161a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M26 14V3.2C26 2.53726 25.4628 2 24.8 2H3.2C2.53726 2 2 2.53726 2 3.2V24.8C2 25.4628 2.53726 26 3.2 26H14" fill="white" />
                  <path d="M26 14V3.2C26 2.53726 25.4628 2 24.8 2H3.2C2.53726 2 2 2.53726 2 3.2V24.8C2 25.4628 2.53726 26 3.2 26H14" stroke="#16161a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M10 20C9.44772 20 9 19.5523 9 19V8C9 7.44772 9.44772 7 10 7H13.7531C14.4801 7 15.1591 7.07311 15.7901 7.21932C16.4348 7.35225 16.9904 7.58487 17.4568 7.91718C17.9369 8.2362 18.3141 8.6682 18.5885 9.21319C18.8628 9.74489 19 10.4029 19 11.1871C19 11.9448 18.856 12.6028 18.5679 13.161C18.2936 13.7193 17.9163 14.1779 17.4362 14.5368C16.9561 14.8957 16.4005 15.1616 15.7695 15.3344C15.1385 15.5072 14.4664 15.5936 13.7531 15.5936H13.0247C12.4724 15.5936 12.0247 16.0413 12.0247 16.5936V19C12.0247 19.5523 11.577 20 11.0247 20H10ZM12.0247 12.2607C12.0247 12.813 12.4724 13.2607 13.0247 13.2607H13.5679C15.214 13.2607 16.037 12.5695 16.037 11.1871C16.037 10.5092 15.8244 10.0307 15.3992 9.75153C14.9877 9.47239 14.3772 9.33282 13.5679 9.33282H13.0247C12.4724 9.33282 12.0247 9.78054 12.0247 10.3328V12.2607Z" fill="#16161a" />
                  <path d="M22 33C21.4477 33 21 32.5523 21 32V21C21 20.4477 21.4477 20 22 20H25.4877C26.1844 20 26.8265 20.0532 27.4139 20.1595C28.015 20.2526 28.5342 20.4254 28.9713 20.6779C29.4085 20.9305 29.75 21.2628 29.9959 21.6748C30.2555 22.0869 30.3852 22.6053 30.3852 23.2301C30.3852 23.5225 30.3374 23.8149 30.2418 24.1074C30.1598 24.3998 30.0232 24.6723 29.832 24.9248C29.6407 25.1774 29.4016 25.4034 29.1148 25.6028C28.837 25.7958 28.5081 25.939 28.1279 26.0323C28.1058 26.0378 28.0902 26.0575 28.0902 26.0802V26.0802C28.0902 26.1039 28.1073 26.1242 28.1306 26.1286C29.0669 26.3034 29.7774 26.6332 30.2623 27.1181C30.7541 27.6099 31 28.2945 31 29.1718C31 29.8364 30.8702 30.408 30.6107 30.8865C30.3511 31.365 29.9891 31.7638 29.5246 32.0828C29.0601 32.3885 28.5137 32.6212 27.8852 32.7807C27.2705 32.9269 26.6011 33 25.8771 33H22ZM24.0123 24.2239C24.0123 24.7762 24.46 25.2239 25.0123 25.2239H25.3443C26.082 25.2239 26.6148 25.0844 26.9426 24.8052C27.2705 24.5261 27.4344 24.1339 27.4344 23.6288C27.4344 23.1503 27.2637 22.8113 26.9221 22.612C26.5943 22.3993 26.0751 22.2929 25.3648 22.2929H25.0123C24.46 22.2929 24.0123 22.7407 24.0123 23.2929V24.2239ZM24.0123 29.7071C24.0123 30.2593 24.46 30.7071 25.0123 30.7071H25.6311C27.2432 30.7071 28.0492 30.1222 28.0492 28.9525C28.0492 28.3809 27.8511 27.9688 27.4549 27.7163C27.0724 27.4637 26.4645 27.3374 25.6311 27.3374H25.0123C24.46 27.3374 24.0123 27.7851 24.0123 28.3374V29.7071Z" fill="#16161a" />
                </svg></div></Link>
              </div>
            </div>
          </AnimatedSection>



          <AnimatedSection className={styles.section} dark={true}>
            <AnimatedTextPopIn>
              <div>
                <span className={styles.s2_question}>What happens to my data?</span>
              </div>
              <div>
                <span className={styles.s2_title}>It's yours!</span>
              </div>
            </AnimatedTextPopIn>
            <div className={styles.s2_cards} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <AnimatedCardPopIn style={{ height: '100%' }} className={styles.fcard}>
                <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="m11.19 1.36-7 3.11C3.47 4.79 3 5.51 3 6.3V11c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6.3c0-.79-.47-1.51-1.19-1.83l-7-3.11c-.51-.23-1.11-.23-1.62 0zM12 11.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>
                </div>Safe and secure</span>
                <p>It's your data so if you self host it's yours to look at not us. And even then if you don't it's still your data and not for us to go touchy looky at.</p>
              </AnimatedCardPopIn>
              <AnimatedCardPopIn style={{ height: '100%' }} className={styles.fcard}>
                <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" /></svg>
                </div>Kept how you like it</span>
                <p>Host it on your own server and when you delete something, you know it's very very gone.</p>
              </AnimatedCardPopIn>
            </div>
          </AnimatedSection>

          <AnimatedSection className={styles.section2}>
            <div className={styles.section2_div}>
              <AnimatedSlideIn>
                <h2>Simple ui</h2>
              </AnimatedSlideIn>
              <div className={styles.fcards}>
                <div className={styles.fcarddual}>
                  <div className={styles.fcards}>
                    <AnimatedCardPopIn className={styles.fcard}>
                      <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><circle cx="14.5" cy="10.5" r="1.25" /><circle cx="9.5" cy="10.5" r="1.25" /><path d="M16.1 14H7.9c-.19 0-.32.2-.23.37C8.5 15.94 10.13 17 12 17s3.5-1.06 4.33-2.63a.262.262 0 0 0-.23-.37zm6.84-2.66a4.008 4.008 0 0 0-2.81-3.17 9.114 9.114 0 0 0-2.19-2.91C16.36 3.85 14.28 3 12 3s-4.36.85-5.94 2.26c-.92.81-1.67 1.8-2.19 2.91a3.994 3.994 0 0 0-2.81 3.17c-.04.21-.06.43-.06.66 0 .23.02.45.06.66a4.008 4.008 0 0 0 2.81 3.17 8.977 8.977 0 0 0 2.17 2.89C7.62 20.14 9.71 21 12 21s4.38-.86 5.97-2.28c.9-.8 1.65-1.79 2.17-2.89a3.998 3.998 0 0 0 2.8-3.17c.04-.21.06-.43.06-.66 0-.23-.02-.45-.06-.66zM19 14c-.1 0-.19-.02-.29-.03-.2.67-.49 1.29-.86 1.86C16.6 17.74 14.45 19 12 19s-4.6-1.26-5.85-3.17c-.37-.57-.66-1.19-.86-1.86-.1.01-.19.03-.29.03-1.1 0-2-.9-2-2s.9-2 2-2c.1 0 .19.02.29.03.2-.67.49-1.29.86-1.86C7.4 6.26 9.55 5 12 5s4.6 1.26 5.85 3.17c.37.57.66 1.19.86 1.86.1-.01.19-.03.29-.03 1.1 0 2 .9 2 2s-.9 2-2 2z" /></svg>
                      </div>Simple</span>
                      <p>Simple and accessible ui so you can get your notes down faster and better.</p>
                    </AnimatedCardPopIn>
                    <AnimatedCardPopIn className={styles.fcard}>
                      <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>
                      </div>Playfull</span>
                      <p>Lots of color to make sure your notes stand out! Customisable icons and notes so you can easily find them.</p>
                    </AnimatedCardPopIn>
                  </div>
                  <AnimatedCardPopIn className={styles.fcard}>
                    <span><div className={styles.fcard_icon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><circle cx="12" cy="16" r="1" /><path d="M12 13c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z" /><path d="M17 1H7c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 17H7V6h10v12z" /></svg>
                    </div>Robust</span>
                    <p>With a large market of devices we have made it so you can use savemynotes on your phone, laptop, tablet etc easily and with a consistant look between them all.</p>
                  </AnimatedCardPopIn>
                </div>

              </div>
            </div>


          </AnimatedSection>

        </div>
        <div className={styles.footer}>
          <h3>Made with 💖 by James M</h3>
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
  );
}




function AnimatedSection({ children, className }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
function AnimatedSlideIn({ children, className }) {
  const [ref, inView] = useInView({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -200 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedTextPopIn({ children, className }) {
  const [ref, inView] = useInView({ threshold: 0.4 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 1, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 1, scale: 1.5 }}
      transition={{ duration: 1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
function AnimatedCardPopIn({ children, className, style }) {
  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.4 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
function AnimatedCard({ children, className, delay }) {
  const [ref, inView] = useInView({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.5, delay: delay ? delay : Math.random() - 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}