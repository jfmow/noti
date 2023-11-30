import { useEffect, useState } from "react"
import PocketBase from 'pocketbase'
import Head from "next/head"
import styles from '@/styles/Auth-new.module.css'
import Router, { useRouter } from "next/router"
import { toaster } from "@/components/toasty"
import { Input, Link, Paragraph, SubmitButton } from "@/components/UX-Components"
import { Modal, ModalContent, ModalTrigger } from "@/lib/Modals/Modal"

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function PasswordReset() {
    const [username, setUsername] = useState('')
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
        if (!username) return;
        try {
            setLoginRunning(true)
            await pb.collection('users').requestPasswordReset(
                username
            );
            toaster.info('Request sent! If you have an account with that email you should recive an email with a link to reset your password.')
        } catch (err) {
            toaster.error('Invalid email')
        }
        setLoginRunning(false)
    }

    async function GetSSOCode(e) {
        e.preventDefault()
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
    async function LoginWithSSOCode(SSOEmail, SSOCode, e) {
        if (e) {
            e.preventDefault()
        }
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
                        <h1><gradient>Quick login!</gradient></h1>
                        <Paragraph>
                            Use a magic link sent to your email to login!
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
                                <SubmitButton data-track-event='Login SSO btn' aria-label="SSO login button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                    Login with Email
                                </SubmitButton>
                            </ModalTrigger>
                            <ModalContent>
                                {SSOInputType === "code" && (
                                    <>
                                        <Paragraph>Enter code here or <strong>click link in email</strong>, the code/link is only valid for 5min</Paragraph>
                                        <form aria-label="Auth code submit form" onSubmit={(e) => LoginWithSSOCode(SSOemail, SSOcode, e)}>
                                            <Input label={""} aria-label="Code input" type="text" id="code" autoComplete="none" placeholder="Code from email eg: 874f62489347edf2d34ed499" required onChange={(e) => setSSOCode(e.target.value)} />
                                            <SubmitButton type='submit'>Login</SubmitButton>
                                        </form>
                                    </>
                                )}
                                {SSOInputType === "email" && (
                                    <form aria-label="Auth code request with email form" onSubmit={(e) => GetSSOCode(e)}>
                                        <Input label={"Email"} aria-label="Email input" type="email" id="sso-email" autoComplete="current-email" placeholder="me@example.com" required="" onChange={(e) => setSSOEmail(e.target.value)} />
                                        <SubmitButton type='submit'>Request code</SubmitButton>
                                    </form>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>

                </div>
                <div className={styles.auth_container}>
                    <h1>
                        Reset password
                    </h1>

                    <form className={styles.auth_form} onSubmit={(e) => loginNormal(e)}>
                        <div className={styles.auth_formgroup}>
                            <Input label={"Email"} aria-label="Email input" type="email" id="email" autoComplete="current-email" placeholder="me@example.com" required="" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <SubmitButton data-track-event='Password reset email request button' aria-label="Password reset button" disabled={loginRunning} type="submit">
                            {loginRunning ? (<>
                                <div className={styles.loader}></div>
                            </>) : 'Request reset'}
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                    Email link login
                                </SubmitButton>
                            </ModalTrigger>
                            <ModalContent>
                                {SSOInputType === "code" && (
                                    <>
                                        <Paragraph>Enter code here or <strong>click link in email</strong>, the code/link is only valid for 5min</Paragraph>
                                        <form aria-label="Auth code submit form" onSubmit={(e) => LoginWithSSOCode(SSOemail, SSOcode, e)}>
                                            <Input label={""} aria-label="Code input" type="text" id="code" autoComplete="none" placeholder="Code from email eg: 874f62489347edf2d34ed499" required onChange={(e) => setSSOCode(e.target.value)} />
                                            <SubmitButton type='submit'>Login</SubmitButton>
                                        </form>
                                    </>
                                )}
                                {SSOInputType === "email" && (
                                    <form aria-label="Auth code request with email form" onSubmit={(e) => GetSSOCode(e)}>
                                        <Input label={"Email"} aria-label="Email input" type="email" id="sso-email" autoComplete="current-email" placeholder="me@example.com" required="" onChange={(e) => setSSOEmail(e.target.value)} />
                                        <SubmitButton type='submit'>Request code</SubmitButton>
                                    </form>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                    <Link data-track-event='Login page redirect link' style={{ textAlign: 'center' }} href={'/auth/login'}>Login</Link>
                </div>
            </div>

        </>
    )
}