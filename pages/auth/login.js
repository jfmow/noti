import { useState } from "react"
import PocketBase from 'pocketbase'
import Head from "next/head"
import styles from '@/styles/Auth-new.module.css'
import { toast } from "sonner"
import Router from "next/router"
import Link from "@/components/Link"
import { toaster } from "@/components/toasty"

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginRunning, setLoginRunning] = useState(false)

  async function loginNormal(e) {
    e.preventDefault();
    if (!username || !password) return;
    try {
      setLoginRunning(true)
      await pb.collection('users').authWithPassword(
        username,
        password,
      );
      Router.push('/page/firstopen')
    } catch (err) {
      toaster.error('Invalid username/email or password')
    }
    setLoginRunning(false)
  }

  async function OAuthLogin(provider) {
    try {
      setLoginRunning(true)
      await pb.collection('users').authWithOAuth2({ provider: provider });
      Router.push('/page/firstopen')
    } catch (error) {
      toaster.error(`Unable to login with ${provider}`)
    }
    setLoginRunning(false)
  }

  return (
    <>

      <Head>
        <title>Login</title>
      </Head>

      <button aria-label="Back" className={styles.back} onClick={() => Router.back()}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg></button>


      <div className={styles.container}>
        <div className={styles.auth_container}>
          <div className={styles.logocontainer}>
            Login
          </div>

          <form className={styles.auth_form} onSubmit={(e) => loginNormal(e)}>
            <div className={styles.auth_formgroup}>
              <label for="email">Email/Username</label>
              <input aria-label="Email input" type="text" id="email" name="email" autoComplete="current-email username" placeholder="me@example.com" required="" onChange={(e) => setUsername(e.target.value)} />

              <label for="password">Password</label>
              <input aria-label="Password input" type="password" autoComplete="current-password" id="password" name="password" placeholder="Enter your password" required="" onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button aria-label="Login button" className={styles.auth_formsubmitbtn} disabled={loginRunning} type="submit">{loginRunning ? (<>
              <div className={styles.loader}></div></>) : 'Login'}</button>
          </form>

          <div className={styles.oauth2}>
            <div className={styles.oauth2_text}>
              <span className={styles.oauth2_line} />
            </div>
          </div>
          <button aria-label="Github login button" className={styles.auth_formsubmitbtn_alt} disabled={loginRunning} type="button" onClick={() => OAuthLogin('github')}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" h-5 w-5 mr-2" data-id="16"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            Login with github</button>
          <button aria-label="Twitch login button" className={styles.auth_formsubmitbtn_alt} disabled={loginRunning} type="button" onClick={() => OAuthLogin('twitch')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" h-5 w-5 mr-2" data-id="18"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>
            Login with twitch</button>

          <Link style={{ textAlign: 'center', fontWeight: '500' }} href={'/auth/signup'}>Signup</Link>
        </div>
      </div>

    </>
  )
}