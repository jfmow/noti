import { useState } from "react"
import PocketBase from 'pocketbase'
import Head from "next/head"
import styles from '@/styles/Auth-new.module.css'
import { toast } from "sonner"
import Router from "next/router"
import Link from "@/components/Link"

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
      toast.error('Invalid username/email or password')
    }
    setLoginRunning(false)
  }

  async function OAuthLogin(provider) {
    try {
      setLoginRunning(true)
      await pb.collection('users').authWithOAuth2({ provider: provider });
      Router.push('/page/firstopen')
    } catch (error) {
      toast.error(`Unable to login with ${provider}`)
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
              <span>OAuth</span>
              <span className={styles.oauth2_line} />
            </div>
            <div className={styles.oauth2_btns}>
              <button aria-label='Github signup/login button' disabled={loginRunning} type="button" onClick={() => OAuthLogin('github')} className={styles.github_btn}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
              </svg></button>
              <button aria-label='Github signup/login button' disabled={loginRunning} type="button" onClick={() => OAuthLogin('twitch')} className={styles.github_btn}><img src="/Brand-assets/TwitchLogo.svg" /></button>
            </div>
          </div>

          <button aria-label="Signup redirect button" className={styles.auth_formsubmitbtn_alt} onClick={() => Router.push('/auth/signup')} type="button">Signup</button>

        </div>
      </div>

    </>
  )
}