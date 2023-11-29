import { useEffect, useState } from "react"
import PocketBase from 'pocketbase'
import Head from "next/head"
import styles from '@/styles/Auth-new.module.css'
import { toast } from "sonner"
import Router, { useRouter } from "next/router"
import { toaster } from "@/components/toasty"
import { Input, Link, Paragraph, SubmitButton } from "@/components/UX-Components"
import { Modal, ModalContent, ModalInput, ModalTrigger } from "@/lib/Modals/Modal"

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginRunning, setLoginRunning] = useState(false)
  const [SSOInputType, setSSOInputType] = useState('email')
  const [SSOcode, setSSOCode] = useState('')
  const [SSOemail, setSSOEmail] = useState('')
  const router = useRouter()
  const { query } = router

  useEffect(() => {
    if (query.ssoToken && query.ssoEmail) {
      LoginWithSSOCode(query.ssoEmail, query.ssoToken)
    }
  }, [query])

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

  async function GetSSOCode() {
    try {
      if (!SSOemail) {
        return
      }
      await pb.send(`/api/auth/sso?email=${SSOemail}&linkUrl=${process.env.NEXT_PUBLIC_CURRENTURL}`, { method: 'POST' })
      toaster.success(`Code sent to ${SSOemail}`)
      setSSOInputType('code')
    } catch {
      toaster.error(`Error while sending code to ${SSOemail}`)
    }
  }
  async function LoginWithSSOCode(SSOEmail, SSOCode) {
    try {
      setLoginRunning(true)
      if (!SSOEmail || !SSOCode) {
        return
      }
      const authData = await pb.send(`/api/auth/sso/login?email=${SSOEmail}&token=${SSOCode}`, { method: 'POST' })
      window.localStorage.setItem('pocketbase_auth', JSON.stringify(authData))
      toaster.success(`Successfully logged in!`)
      Router.push('/page/firstopen')
    } catch {
      toaster.error(`Error while logging in with sso`)
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
        <div className={styles.oauth_promote}>
          <div className={styles.oauth_promote_content}>
            <h1><gradient>Welcome back!</gradient></h1>
            <Paragraph>
              Complete the login form to login
            </Paragraph>

            <div className={styles.oauth2}>
              <div className={styles.oauth2_text}>
                <span className={styles.oauth2_line} />
                <Paragraph>Or</Paragraph>
                <span className={styles.oauth2_line} />
              </div>
            </div>
            <Modal>
              <ModalTrigger style={{ width: '100%' }}>
                <SubmitButton data-track-event='Login SSO btn' alt aria-label="SSO login button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-square"><path d="M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z" /><path d="m14 7 3 3" /><path d="M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4" /></svg>
                  Login with SSO
                </SubmitButton>
              </ModalTrigger>
              <ModalContent>
                <h1>Single-Sign-On</h1>
                <Paragraph>The code is only valid for 5min</Paragraph>
                {SSOInputType === "email" && (
                  <Input label={"Email"} aria-label="Email input" type="email" id="email" autoComplete="current-email username" placeholder="me@example.com" required="" onChange={(e) => setSSOEmail(e.target.value)} />
                )}
                {SSOInputType === "code" && (
                  <Input label={"Auth code"} aria-label="Code input" type="text" id="code" autoComplete="none" placeholder="Code from email eg: 874f62489347edf2d34ed499" required onChange={(e) => setSSOCode(e.target.value)} />
                )}
                {SSOInputType === "code" && (
                  <SubmitButton onClick={() => LoginWithSSOCode(SSOemail, SSOcode)}>Login</SubmitButton>
                )}
                {SSOInputType === "email" && (
                  <SubmitButton onClick={() => GetSSOCode()}>Get code</SubmitButton>
                )}
              </ModalContent>
            </Modal>
            <SubmitButton data-track-event='Login github btn' alt aria-label="Github login button" disabled={loginRunning} type="button" onClick={() => OAuthLogin('github')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" h-5 w-5 mr-2" data-id="16"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              Login with github
            </SubmitButton>
            <SubmitButton data-track-event='Login twitch btn' alt aria-label="Twitch login button" disabled={loginRunning} type="button" onClick={() => OAuthLogin('twitch')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" h-5 w-5 mr-2" data-id="18"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>
              Login with twitch
            </SubmitButton>
          </div>

        </div>
        <div className={styles.auth_container}>
          <h1>
            Login
          </h1>

          <form className={styles.auth_form} onSubmit={(e) => loginNormal(e)}>
            <div className={styles.auth_formgroup}>
              <Input label={"Email/username"} aria-label="Email input" type="text" id="email" autoComplete="current-email username" placeholder="me@example.com" required="" onChange={(e) => setUsername(e.target.value)} />
              <Input label={"Password"} aria-label="Password input" type="password" autoComplete="current-password" id="password" placeholder="Enter your password" required="" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <SubmitButton data-track-event='Login button login page' aria-label="Login button" disabled={loginRunning} type="submit">
              {loginRunning ? (<>
                <div className={styles.loader}></div>
              </>) : 'Login'}
            </SubmitButton>
          </form>

          <div className={styles.oauth2}>
            <div className={styles.oauth2_text}>
              <span className={styles.oauth2_line} />
              <Paragraph>Or</Paragraph>
              <span className={styles.oauth2_line} />
            </div>
          </div>
          <div className={styles.mobile_sso_promo} style={{ flexDirection: 'column', gap: '10px' }}>


            <Modal>
              <ModalTrigger style={{ width: '100%' }}>
                <SubmitButton data-track-event='Login SSO btn' alt aria-label="SSO login button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-square"><path d="M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z" /><path d="m14 7 3 3" /><path d="M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4" /></svg>
                  Login with SSO
                </SubmitButton>
              </ModalTrigger>
              <ModalContent>
                <h1>Single-Sign-On</h1>
                <Paragraph>The code is only valid for 5min</Paragraph>
                {SSOInputType === "email" && (
                  <Input label={"Email"} aria-label="Email input" type="email" id="email" autoComplete="current-email username" placeholder="me@example.com" required="" onChange={(e) => setSSOEmail(e.target.value)} />
                )}
                {SSOInputType === "code" && (
                  <Input label={"Auth code"} aria-label="Code input" type="text" id="code" autoComplete="none" placeholder="Code from email eg: 874f62489347edf2d34ed499" required onChange={(e) => setSSOCode(e.target.value)} />
                )}
                {SSOInputType === "code" && (
                  <SubmitButton onClick={() => LoginWithSSOCode()}>Login</SubmitButton>
                )}
                {SSOInputType === "email" && (
                  <SubmitButton onClick={() => GetSSOCode()}>Get code</SubmitButton>
                )}
              </ModalContent>
            </Modal>
            <SubmitButton data-track-event='Login github btn' alt aria-label="Github login button" disabled={loginRunning} type="button" onClick={() => OAuthLogin('github')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" h-5 w-5 mr-2" data-id="16"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              Login with github
            </SubmitButton>
            <SubmitButton data-track-event='Login twitch btn' alt aria-label="Twitch login button" disabled={loginRunning} type="button" onClick={() => OAuthLogin('twitch')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" h-5 w-5 mr-2" data-id="18"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>
              Login with twitch
            </SubmitButton>
          </div>
          <Link data-track-event='Signup page redirect link' style={{ textAlign: 'center' }} href={'/auth/signup'}>Signup</Link>
        </div>
      </div>

    </>
  )
}