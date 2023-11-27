import { useState } from "react"
import PocketBase from 'pocketbase'
import Head from "next/head"
import styles from '@/styles/Auth-new.module.css'
import Router from "next/router"
import { getUserTimeZone } from '@/lib/getUserTimeZone';
import validator from 'validator';
import { toaster } from "@/components/toasty";
import { Input, Link, Paragraph, SubmitButton } from "@/components/UX-Components";
import { Modal, ModalContent, ModalTrigger } from "@/lib/Modals/Modal"
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginRunning, setLoginRunning] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)

    async function loginNormal(e) {
        e.preventDefault();
        if (!username || !password || !email) return;
        const sanitizedEmail = validator.trim(validator.escape(email));
        const sanitizedPassword = validator.trim(validator.escape(password));
        const sanitizedUsername = validator.trim(validator.escape(username));
        const userTimeZone = getUserTimeZone()
        try {
            setLoginRunning(true)
            const data = {
                "username": sanitizedUsername,
                "email": sanitizedEmail,
                "emailVisibility": false,
                "password": sanitizedPassword,
                "passwordConfirm": sanitizedPassword,
                "time_zone": userTimeZone
            };

            await pb.collection('users').create(data);
            await pb.collection('users').requestVerification(email);
            await pb.collection('users').authWithPassword(username, password);
            Router.push('/page/firstopen')
        } catch (err) {
            toaster.error('Failed to create an account! Please try again or check if you already have one!')
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

    async function SignupWithSSO() {
        try {
            setLoginRunning(true)
            if (!email || !username) {
                return
            }
            const authData = await pb.send(`/api/auth/sso/signup?email=${email}&username=${username}`, { method: 'POST' })
            window.localStorage.setItem('pocketbase_auth', JSON.stringify(authData))
            Router.push('/page/firstopen')
        } catch {
            toaster.error(`Error while logging in with sso`)
        }
        setLoginRunning(false)
    }

    return (
        <>

            <Head>
                <title>Signup</title>
            </Head>

            <button aria-label="Back" className={styles.back} onClick={() => Router.back()}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg></button>


            <div className={styles.container}>
                <div className={styles.auth_container}>
                    <div className={styles.logocontainer}>
                        Signup
                    </div>

                    <form aria-label="Signup form" className={styles.auth_form} onSubmit={(e) => loginNormal(e)}>
                        <div className={styles.auth_formgroup}>
                            <Input label={"Email"} autoComplete="email" aria-required aria-label="Email input" type="email" id="email" placeholder="me@example.com" required="" onChange={(e) => setEmail(e.target.value)} />
                            <Input label={"username"} autoComplete="username" aria-required aria-label="Username input" type="text" id="username" placeholder="Enter a username" required="" onChange={(e) => setUsername(e.target.value)} />
                            <Input label={"password"} autoComplete="current-password" aria-required aria-label="Password input (One and only)" type={passwordVisible ? 'text' : 'password'} id="password" value={password} placeholder="Enter your password" required="" onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <Paragraph >
                            Please read the <Link href='/auth/terms-and-conditions' style={{ textDecoration: 'underline' }}>Terms and conditions</Link>, <Link style={{ textDecoration: 'underline' }} href='/auth/privacy-policy'>Privacy policy</Link> and <Link style={{ textDecoration: 'underline' }} href='/auth/disclamer'>Disclamer</Link> before continuing. By continuing you agree to these.
                        </Paragraph>
                        <SubmitButton data-track-event='Signup btn signup page' aria-label="Signup button" disabled={loginRunning} type="submit">
                            {loginRunning ? (
                                <>
                                    <div className={styles.loader}></div>
                                </>
                            ) : 'Signup'}
                        </SubmitButton>
                    </form>

                    <div className={styles.oauth2}>
                        <div className={styles.oauth2_text}>
                            <span className={styles.oauth2_line} />

                        </div>
                        <Modal>
                            <ModalTrigger>
                                <SubmitButton data-track-event='Signup btn signup page' aria-label="Signup button" disabled={loginRunning} type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-square"><path d="M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z" /><path d="m14 7 3 3" /><path d="M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4" /></svg>
                                    Use sso
                                </SubmitButton>
                            </ModalTrigger>
                            <ModalContent>
                                <h1>Single-Sign-On</h1>
                                <Paragraph>Use your email to sign-in, no annoying passwords. Complete this form to signup and use sso.</Paragraph>
                                <Input label={"Email"} autoComplete="email" aria-required aria-label="Email input" type="email" id="email" placeholder="me@example.com" required="" onChange={(e) => setEmail(e.target.value)} />
                                <Input label={"username"} autoComplete="username" aria-required aria-label="Username input" type="text" id="username" placeholder="Enter a username" required="" onChange={(e) => setUsername(e.target.value)} />

                                <SubmitButton data-track-event='Signup btn signup page' aria-label="Signup button" disabled={loginRunning} type="button" onClick={() => SignupWithSSO()}>
                                    {loginRunning ? (
                                        <>
                                            <div className={styles.loader}></div>
                                        </>
                                    ) : 'Signup'}
                                </SubmitButton>

                            </ModalContent>
                        </Modal>

                    </div>

                    <Link data-track-event='Login redirect signup page' style={{ textAlign: 'center' }} href={'/auth/login'}>Login</Link>
                </div>
            </div>

        </>
    )
}