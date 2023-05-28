import PocketBase from 'pocketbase';
import { useState, useEffect } from 'react';
import styles from '@/styles/Auth.module.css'
import { toast } from 'react-toastify';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import validator from 'validator';
import Loader from '@/components/Loader'
import { getPosition } from '@/lib/position.js'

const Tc = dynamic(() => import('@/components/Termsandconditions'), {
    ssr: false, loading: () => <p>Loading...</p>,
})
const Pp = dynamic(() => import('@/components/PrivacyPolicy'), {
    ssr: false, loading: () => <p>Loading...</p>,
})

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)


export default function Login() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [prevPage, setPrevUrl] = useState('');
    const [agree, setAgree] = useState(false);
    const [showTandC, setShowTandC] = useState(false);
    const [showPp, setShowPp] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleButtonClick = () => {
        setShowTandC(true);
    }
    const handleButtonClickPP = () => {
        setShowPp(true);
    }


    useEffect(() => {

        if (pb.authStore.isValid) {
            return window.location.replace('/')
        }
        // Get previous URL from session storage
        const prevUrl = sessionStorage.getItem('prevUrl');
        if (prevUrl) {
            // Remove previous URL from session storage
            setPrevUrl(prevUrl)
            sessionStorage.removeItem('prevUrl');
        }
        setIsLoading(false)
    }, []);



    async function auth(event) {
        event.preventDefault();
        try {
            if (!agree) {
                return toast.error('Please agree to the T&Cs to continue', { position: toast.POSITION.TOP_LEFT });
            }
            //console.log(name, email, mail)
            if (!name || !email || !password) {
                return toast.error('Please fill out all fields', { position: toast.POSITION.TOP_LEFT });
            }
            const sanitizedEmail = validator.trim(validator.escape(email));
            const sanitizedPassword = validator.trim(validator.escape(password));
            const sanitizedName = validator.trim(validator.escape(name));
            // Validate sanitized inputs
            if (!validator.isLength(sanitizedPassword, { min: 7 })) {
                toast.warning('Invalid password', {
                    position: toast.POSITION.TOP_LEFT,
                });
                return
            }
            if (!validator.isEmail(sanitizedEmail)) {
                toast.warning('Invalid email', {
                    position: toast.POSITION.TOP_LEFT,
                });
                return
            }
            const res = await fetch('/api/filterusername', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sanitizedName })
            });
            if (res.status === 429) {
                return toast.error(`Rate limited!`)
            }
            const filteredUsername = await res.json();
            if (filteredUsername.error) {
                return toast.error(`${filteredUsername.error}`)
            }
            const response = await fetch('/api/botprotection');
            const botdata = await response.json();
            if (botdata.error) {
                return toast.error('Bot protection failed!')
            }
            const { encryptedLocation } = await getPosition();

            const data = {
                "username": filteredUsername,
                "email": sanitizedEmail,
                "emailVisibility": false,
                "password": sanitizedPassword,
                "passwordConfirm": sanitizedPassword,
                "protection_data": true

            };
            setIsLoading(true)
            try {
                const response = await toast.promise(
                    pb.collection('users').create(data),
                    {
                        pending: 'Creating account...',
                        success: 'Account created successfuly. 👌',
                        error: 'Failed to create account! 🤯'
                    }
                );
                const response2 = await toast.promise(
                    pb.collection('users').authWithPassword(name, password),
                    {
                        pending: 'Signing in...',
                        success: 'Signed in successfuly. 👌',
                        error: 'Failed to sign-in! 🤯'
                    }
                );
                const authDataaaa = await pb.collection('users').authRefresh();
                try {
                    const privatedata = {
                        "user": response.id,
                        "protection_data": {
                            ...botdata,
                            location: encryptedLocation
                        }
                    };

                    const record = await pb.collection('private_data').create(privatedata);
                    console.log(record)
                } catch (error) {
                    console.log(error)
                }
                const response3 = await toast.promise(
                    pb.collection('users').requestVerification(email),
                    {
                        pending: 'Sending verification email...',
                        success: 'Please verify email!. 👌',
                        error: 'Failed to send verification email 🤯'
                    }
                );
                setTimeout(() => {
                    window.location.replace(prevPage)
                }, 1000);
            } catch (error) {
                console.log(error)
                setIsLoading(false)
                toast.error('Error while creating account!', {
                    position: toast.POSITION.TOP_LEFT,
                });
            }
        } catch (error) {
            setIsLoading(false)
            toast.error('Error while creating account!', {
                position: toast.POSITION.TOP_LEFT,
            });
        }
    }

    function setAgreeState() {
        if (!agree) {
            setAgree(true)
        } else {
            setAgree(false)
        }
    }
    function closeTandC() {
        setShowTandC(false)
        document.body.classList.remove("modal-open")
    }
    function closePp() {
        setShowPp(false)
        document.body.classList.remove("modal-open")
    }
    function checkUsername(str) {
        const pattern = /[_-]+/;
        if (pattern.test(str)) {
            return toast.warning('Username invalid. No -, _ allowed!')
        } else {
            console.log('The string does not contain any invalid characters.');
            setName(str)
        }

    }
    if (isLoading) {
        return <Loader />
    }
    return (
        <div>
            <Head>
                <title>Signup!</title>
                <link rel="favicon" href="/favicon.ico" />
                <meta name="robots" content="noindex"></meta>
            </Head>
            <div className={styles.login}>
                <div className={styles.card}>
                    <h4 className={styles.title}>Signup!</h4>
                    <form onSubmit={auth}>
                        <div className={styles.field}>
                            <svg className={styles.inputicon} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z"></path></svg>
                            <input required autoComplete="off" id="logemail" value={email} placeholder="Email" className={styles.inputfield} name="email" type="email" onChange={event => setEmail(event.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <svg className={styles.inputicon} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 575q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM220 896q-25 0-42.5-17.5T160 836v-34q0-38 19-65t49-41q67-30 128.5-45T480 636q62 0 123 15.5T731 696q31 14 50 41t19 65v34q0 25-17.5 42.5T740 896H220Z" /></svg>
                            <input required pattern="[^\s_-]+" autoComplete="off" id="logusrname" value={name} placeholder="Username" className={styles.inputfield} name="name" type="text" onChange={event => checkUsername(event.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <svg className={styles.inputicon} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path></svg>
                            <input minLength='8' maxLength='72' pattern="[^\s]+" autoComplete="off" value={password} id="logpass" placeholder="Password" className={styles.inputfield} name="password" type="password" onChange={event => setPassword(event.target.value)} required />
                        </div>
                        <div className={styles.signupbtns}>
                            <div className={styles.tandccon}>
                                <p>You must agree to the <button className={styles.legalbtn} type="button" onClick={handleButtonClick}>Terms &amp; conditions</button> and <button className={styles.legalbtn} type="button" onClick={handleButtonClickPP}>Privacy policy</button> to continue</p>
                                {showPp && <Pp isOpen={showPp} onClose={closePp} />}
                                {showTandC && <Tc isOpen={showTandC} onClose={closeTandC} />}
                                <div className={styles.cntr}>
                                    <input onClick={setAgreeState} defaultchecked={agree ? true : false} type="checkbox" id="cbx" className={`${styles.hiddenxsup} ${styles.cbx2}`} />
                                    <label for="cbx" className={styles.cbx}></label>
                                </div>
                            </div>
                            <button className={styles.btn} type="submit">Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

