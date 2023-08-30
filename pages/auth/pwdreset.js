import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import styles from '@/styles/Auth.module.css'
import Link from 'next/link'
import { toast } from 'react-toastify';
import Head from 'next/head';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)

export default function PasswordReset() {
    const [email, setEmail] = useState('');
    async function auth(event) {
        event.preventDefault();
        console.error(pb.autoCancellation)
        if (email.includes('@')) {
            ////console.log(name, email)
            try {
                const response = await toast.promise(
                    pb.collection('users').requestPasswordReset(email),
                    {
                        pending: 'Requesting reset...',
                        success: 'Reset email sent',
                        error: 'Rest email failed to send 🤯'
                    }
                );
                //console.error(authData)

            } catch (error) {
                toast.warning('Failed to send reset email');
            }
        } else {
            return
        }
    }
    return (
        <div>
            <Head>
                <title>Reset password</title>
                <link rel="favicon" href="/Favicon.png" />
                <meta name="robots" content="noindex"></meta>
            </Head>
            <div className={styles.login_box}>
                <div className={styles.formcontainer}>
                    <p className={styles.title}>Password reset</p>
                    <form className={styles.form}>
                        <div className={styles.inputgroup}>
                            <label for="username">Email</label>
                            <input onChange={event => setEmail(event.target.value)} type="email" name="email" id="email" placeholder="" />
                        </div>
                        <button onClick={auth} className={styles.sign} type='button'>Reset</button>
                    </form>
                    <div className={styles.socialmessage}>
                        <div className={styles.line}></div>
                        <p className={styles.message}>If you have an account with us you will receive an email to reset your password</p>
                        <div className={styles.line}></div>
                    </div>
                </div>

            </div>
        </div>
    )
}