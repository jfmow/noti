import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import styles from '@/styles/Auth.module.css'
import Link from 'next/link'
import { toast } from 'react-toastify';
import Head from 'next/head';
import validator from 'validator';
import { useRouter } from 'next/router';
import { getUserTimeZone } from '@/lib/getUserTimeZone';
import PlainLoader from '@/components/Loader';
import { createKey } from '@/lib/createEncKey';
import { ModalButton, ModalCheckBox, ModalContainer, ModalForm, ModalInput, ModalTitle } from '@/lib/Modal';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
export default function Login() {
  const Router = useRouter()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setIsLoading] = useState(false)
  const [showRisk, setShowRisk] = useState(false);



  useEffect(() => {
    if (pb.authStore.isValid) {
      Router.push("/auth/logout")
      return
    }
  }, []);

  async function auth() {
    try {
      if (!email || !password) {
        return
      }
      setIsLoading(true)
      pb.authStore.clear();
      // Retrieve user inputs
      // Sanitize inputs using validator.js
      const sanitizedEmail = validator.trim(validator.escape(email));
      const sanitizedPassword = validator.trim(validator.escape(password));
      // Validate sanitized inputs
      const authData = await pb.collection('users').authWithPassword(
        sanitizedEmail,
        sanitizedPassword,
        { '$autoCancel': false },
      );
      console.log(authData)
      if (!authData.record.seen_risk_warning) {
        setIsLoading(false)
        setShowRisk(true)
        return
      }
      if (authData.record.disabled) {
        pb.authStore.clear()
        return Router.push('/u/disabled')
      }
      if (!authData.record.meal) {
        const encryptionKey = createKey()
        const encData = {
          "chef": encryptionKey,
          "plate": authData.record.id
        };

        const encRec = await pb.collection('cookies').create(encData);
        const usrDataUp = {
          "meal": encRec.id
        };

        await pb.collection('users').update(authData.record.id, usrDataUp);
      }
      if (!authData.record.time_zone) {

        const userTimeZone = getUserTimeZone();


        const newTimeZoneUser = {
          "time_zone": userTimeZone
        };

        await pb.collection('users').update(authData.record.id, newTimeZoneUser);
      }
      return Router.push('/page/firstopen')
    } catch (error) {
      // Handle errors appropriately
      console.log(error);
      toast.error('Error logging in. Please make sure you have a valid account');
      setIsLoading(false)
    }


  }

  async function oAtuh() {
    setIsLoading(true)

    const authData = await pb.collection('users').authWithOAuth2({ provider: 'github' });
    if (!authData.record.seen_risk_warning) {
      setIsLoading(false)
      setShowRisk(true)
      return
    }
    if (!authData.record.time_zone) {

      const userTimeZone = getUserTimeZone();
      const Data = {
        "time_zone": userTimeZone
      };

      await pb.collection('users').update(authData.record.id, Data);
    }
    if (!authData.record.meal) {
      const encryptionKey = createKey()
      const encData = {
        "chef": encryptionKey,
        "plate": authData.record.id
      };
      const encRec = await pb.collection('cookies').create(encData);
      const usrDataUp = {
        "meal": encRec.id
      };
      await pb.collection('users').update(authData.record.id, usrDataUp);
    }
    return Router.push('/page/firstopen')
  }

  async function updateRiskVal() {
    const data = {
      "seen_risk_warning": true
    }
    await pb.collection('users').update(pb.authStore.model.id, data);
  }


  if (loading) {
    return (
      <PlainLoader />
    )
  }

  return (
    <div>
      <Head>
        <title>Login</title>
        <link rel="favicon" href="/favicon.ico" />
        <meta name="robots" ></meta>
      </Head>
      <div className={styles.login_box}>
        <div className={styles.formcontainer}>
          <p className={styles.title}>Login</p>
          <form className={styles.form}>
            <div className={styles.inputgroup}>
              <label for="username">Username</label>
              <input onChange={event => setEmail(event.target.value)} type="text" name="username" id="username" placeholder="" />
            </div>
            <div className={styles.inputgroup}>
              <label for="password">Password</label>
              <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="" />
              <div className={styles.forgot}>
                <a rel="noopener noreferrer" href="/auth/pwdreset">Forgot Password ?</a>
              </div>
            </div>
            <button onClick={auth} className={styles.sign} type='button'>Sign in</button>
          </form>
          <div className={styles.socialmessage}>
            <div className={styles.line}></div>
            <p className={styles.message}>Login with other accounts</p>
            <div className={styles.line}></div>
          </div>
          <div className={styles.socialicons}>
            <button aria-label="Log in with GitHub" className={styles.icon} type='button' onClick={oAtuh}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={`${styles.w5} ${styles.h5} ${styles.fillcurrent}`}>
                <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
              </svg>
            </button>
          </div>
          <p className={styles.signup}>Don't have an account?
            <a rel="noopener noreferrer" href="/auth/signup" className={styles.signup}>Sign up</a>
          </p>
          <p className={styles.signup}>
            <a rel="noopener noreferrer" href="/" className={styles.signup}>Cancel</a>
          </p>
        </div>

      </div>
      {showRisk && (
        <ModalContainer events={() => setShowRisk(false)}>
          <ModalForm>
            <div className={styles.warningsvg}><svg aria-hidden="true" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linejoin="round" stroke-linecap="round"></path>
            </svg></div>

            <ModalTitle>Beta App</ModalTitle>
            <p className={styles.warn} style={{ maxHeight: '40dvh', overflowY: 'scroll', overflowX: 'hidden' }}>
              Important Notice: Beta App - Data Security and Service Availability

              Dear User,

              We would like to inform you about the nature of our platform before you proceed with signing up. Please note that our application is currently in the proof of concept stage, and as such, certain limitations and risks exist that you should be aware of.

              Firstly, it is crucial to understand that our platform is not yet a fully developed and stable service. While we are working diligently to improve its functionality and reliability, there is a possibility of encountering unexpected issues, including data loss or service disruptions.

              In light of this, we want to reiterate that storing sensitive or confidential data on our platform is strongly discouraged. Given its experimental nature, we cannot guarantee the same level of security and data protection as more established services. We kindly request you to refrain from inputting sensitive information that you would not be comfortable with potentially being exposed or lost.

              By continuing with the signup process, you acknowledge that this is a proof of concept app and accept the associated risks. We appreciate your understanding and participation as we work towards enhancing the stability and security of our platform.

              If you have any questions or require further clarification, please do not hesitate to reach out to our <a href='mailto:help@jamesmowat.com'>support team</a>.

              Thank you for your cooperation.
            </p>
            <ModalButton events={updateRiskVal}>Continue</ModalButton>
          </ModalForm>
        </ModalContainer>
      )}
    </div>
  )

}


