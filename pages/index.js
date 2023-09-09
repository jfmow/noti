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
        <link rel="canonical" href="https://note.suddsy.dev/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@800&display=swap" rel="stylesheet" />

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
          <div className={styles.section2}>
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


          </div>

          <div className={`${styles.section} ${styles.section_algin}`}>
            <div className={styles.customdivider}>
              <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className={styles.customdivider_shapefill}></path>
              </svg>
            </div>
            <img className={styles.alone_img} src={`/feature.png`} alt="A cool feature image" />

            <div>
              <span className={`${styles.s2_title} ${styles.mobile_s2_title_sml}`}>Simple</span>
              <span className={`${styles.s2_title} ${styles.mobile_s2_title_sml}`}>Colorfull</span>
              <span className={`${styles.s2_title} ${styles.mobile_s2_title_sml}`}>Calm</span>
            </div>
            <div className={styles.customdivider_wave_bottom}>
              <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={styles.customdivider_wave_bottom_shapefill}></path>
              </svg>
            </div>

          </div>

          <div className={`${styles.section}`}>
            <div>
              <span className={`${styles.s2_title}`}>Stand out from the rest</span>
            </div>
            <div>
              <span className={styles.s2_question}>And create notes like a pro.</span>
            </div>
            <div className={styles.s2_answer_img} >
              <img src='/pagepreview.png' />
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
              <div className={styles.customdivider_wave_bottom}>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={styles.customdivider_wave_bottom_shapefill}></path>
                </svg>
              </div>
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
function AnimatedSlideIn({ children, className, right }) {
  const [ref, inView] = useInView({ threshold: 0.3 });

  if (right) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 400 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        exit={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

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
  const [ref, inView] = useInView({ threshold: 0.4 });

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