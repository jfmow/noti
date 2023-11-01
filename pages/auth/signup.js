import { useState } from "react"
import PocketBase from 'pocketbase'
import Head from "next/head"
import styles from '@/styles/Auth-new.module.css'
import { toast } from "sonner";
import Router from "next/router"
import { ModalCheckBox } from "@/lib/Modal"
import { getUserTimeZone } from '@/lib/getUserTimeZone';
import validator from 'validator';
import Link from "@/components/Link"
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
            toast.error('Failed to create an account! Please try again or check if you already have one!')
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

    async function genPassword() {
        const pwd = await fetch('/api/random-password?length=16')
        const pwdstring = await pwd.json()
        setPassword(pwdstring.password)
        setPasswordVisible(true)
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
                            <label for="email">Email</label>
                            <input autoComplete="email" aria-required aria-label="Email input" type="email" id="email" name="email" placeholder="me@example.com" required="" onChange={(e) => setEmail(e.target.value)} />

                            <label for="username">Username</label>
                            <input autoComplete="username" aria-required aria-label="Username input" type="text" id="username" name="username" placeholder="Enter a username" required="" onChange={(e) => setUsername(e.target.value)} />

                            <label for="password">Password</label>
                            <input autoComplete="current-password" aria-required aria-label="Password input (One and only)" type={passwordVisible ? 'text' : 'password'} id="password" value={password} name="password" placeholder="Enter your password" required="" onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <p style={{ margin: '1em 0', color: '#a7a7a7', fontFamily: 'sans-serif' }}>Please read the <Link href='/auth/terms-and-conditions' style={{ textDecoration: 'underline' }}>Terms and conditions</Link>, <Link style={{ textDecoration: 'underline' }} href='/auth/privacy-policy'>Privacy policy</Link> and <Link style={{ textDecoration: 'underline' }} href='/auth/disclamer'>Disclamer</Link> before continuing. By continuing you agree to these.</p>

                        <button aria-label="Signup button" className={styles.auth_formsubmitbtn} disabled={loginRunning} type="submit">{loginRunning ? (<>
                            <div className={styles.loader}></div></>) : 'Signup'}</button>
                    </form>

                    <div className={styles.oauth2}>
                        <div className={styles.oauth2_text}>
                            <span className={styles.oauth2_line} />

                        </div>

                    </div>

                    <button aria-label="Login redirect button" className={styles.auth_formsubmitbtn_alt} onClick={() => Router.push('/auth/login')} type="button">Login</button>

                </div>
            </div>

        </>
    )
}