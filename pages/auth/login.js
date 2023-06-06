import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import styles from '@/styles/Auth.module.css'
import Link from 'next/link'
import { toast } from 'react-toastify';
import Head from 'next/head';
import validator from 'validator';


const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
export default function Login() {

  const [email, setEmail] = useState('');
  //const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [prevPage, setPrevUrl] = useState('');
  async function auth(event) {
    event.preventDefault();
    console.error(pb.autoCancellation)
    //console.log(name, email)


    try {
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
      if (authData.record.disabled) {
        pb.authStore.clear()
        return window.location.replace('/u/disabled')
      }
      if(!authData.record.meal){
        const keySize = 128 / 8; // Key size in bytes
                const key = lib.WordArray.random(keySize);
                const encryptionKey = enc.Hex.stringify(key);
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
      return window.location.replace('/page/firstopen')
    } catch (error) {
      // Handle errors appropriately
      console.log(error);
      toast.error('Error logging in. Please make sure you have a valid account', {
        position: toast.POSITION.TOP_LEFT,
      });
    }


  }

  async function oAthLogin() {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'github' });
    return window.location.replace('/page/firstopen')
  }

  const status = pb.authStore.isValid
  useEffect(() => {
    if (status == true) {
      window.location.replace("/auth/logout")
      return
    }
    const prevUrl = sessionStorage.getItem('prevUrl');

    if (prevUrl) {
      setPrevUrl(prevUrl)
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Login</title>
        <link rel="favicon" href="/favicon.ico" />
        <meta name="robots" content="noindex"></meta>
      </Head>
      <div className={styles.login_box}>
        <div className={styles.card}>
          <h4 className={styles.title}>Login!</h4>
          <form onSubmit={auth}>
            <div className={`${styles.field} ${styles.field_start}`}>
              <svg className={styles.inputicon} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 575q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM220 896q-25 0-42.5-17.5T160 836v-34q0-38 19-65t49-41q67-30 128.5-45T480 636q62 0 123 15.5T731 696q31 14 50 41t19 65v34q0 25-17.5 42.5T740 896H220Z" /></svg>
              <input required autoComplete="off" id="logemail" value={email} placeholder="Email or Username" className={styles.inputfield} name="email" type="text" onChange={event => setEmail(event.target.value)} />
            </div>
            <div className={`${styles.field} ${styles.field_end}`}>
              <svg className={styles.inputicon} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path></svg>
              <input autoComplete="off" value={password} id="logpass" placeholder="Password" className={styles.inputfield} name="password" type="password" onChange={event => setPassword(event.target.value)} required />
            </div>
            <div className={styles.buttons}>
              <button className={styles.btn} type="submit">Login</button>
              <button className={styles.obtn} type="button" onClick={oAthLogin}>Github</button>
            </div>

            <p className={styles.signup}>Forgot password? <a className={styles.signuplink} href='/auth/pwdreset'>Reset</a></p>
            <p className={styles.signup}>New here? <Link className={styles.signuplink} href='/auth/signup'>Signup</Link></p>
            <Link href='/'><p className={styles.signup}>Cancel</p></Link>
          </form>

        </div>
      </div>
    </div>
  )

}


