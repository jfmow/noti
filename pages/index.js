import React, { useState } from 'react';
import styles from '@/styles/OHome.module.css';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import PlainLoader from '@/components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Nav from '@/components/Nav';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {

    if (window.innerWidth < 800) {
      setMobile(true)
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
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <img loading='egar' height='60' className={styles.title} src='/name.png' />

            <span className={styles.header_text}>All your <span className={styles.header_underline}>notes</span> together in one place</span>

            <div style={{ zIndex: '2' }}>
              <button className={styles.Btn} onClick={() => Router.push('/auth/signup')}>
                Start writing now <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M16.01 11H5c-.55 0-1 .45-1 1s.45 1 1 1h11.01v1.79c0 .45.54.67.85.35l2.78-2.79c.19-.2.19-.51 0-.71l-2.78-2.79c-.31-.32-.85-.09-.85.35V11z" /></svg>
              </button>
            </div>
          </div>

        </header>
        <div className={styles.sections}>
          <AnimatePresence>
            {/* Animate the first section */}


            {/* Animate the second section */}
            <AnimatedSection className={styles.section2}>
              <div className={styles.section2_div}>
                <h2>Get work done quickly and efficiently</h2>
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

          </AnimatePresence>
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
  const [ref, inView] = useInView({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </section>
  );
}
