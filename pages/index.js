import React, { useState } from 'react';
import styles from '@/styles/OHome.module.css';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
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

  useEffect(() => {
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
        <title>Noti</title>
      </Head>
      <Nav/>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h3 className={styles.subtitle}>Welcome to</h3>
            <h1 className={styles.title}>Noti</h1>
            <h5 className={styles.description}>The best note-taking app ever</h5>
            <Link href="/auth/signup" className={styles.Btn}>
              Join now
            </Link>
          </div>
        </header>
        <div className={styles.sections}>
          <AnimatePresence>
            {/* Animate the first section */}
            <AnimatedSection className={styles.section3}>
              <h2>Get work done quickly and efficiently with fast loading and low data usage.</h2>
              <img alt="floating notebooks on blue background" className={styles.bg} src="/static/hmpgimg3.png" />
            </AnimatedSection>

            {/* Animate the second section */}
            <AnimatedSection className={styles.section2}>
              <h2>Enjoy new features and updates every week to keep your notes looking fresh.</h2>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <h1>99% Uptime</h1>
                  <p>Thats our goal but 100% would be even better!</p>
                </div>
                <div className={styles.stat}>
                  <h1>Latest features</h1>
                  <p>New features published each week making your notes even better</p>
                </div>
                <div className={styles.stat}>
                  <h1>Fast</h1>
                  <p>Quick server response times mean you can get to writing even faster</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Animate the third section */}
            <AnimatedSection className={styles.section3}>
              <img alt="floating notebook" className={styles.bg} src="/static/notebookfloating1.jpg" />
              <div>
              <h2>Just the right amount of features</h2>
              <p>And just ask if you think theres something more that could be added</p>
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
  const [ref, inView] = useInView({ threshold: 0.4 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
