import PocketBase from 'pocketbase';
import { useState, useEffect } from 'react';
import styles from '@/styles/Auth.module.css'
import { toast } from 'react-toastify';
import Head from 'next/head';
import validator from 'validator';
import Loader from '@/components/Loader'

import Link from 'next/link';
import { useRouter } from 'next/router';
import { getUserTimeZone } from '@/lib/getUserTimeZone';
import { createKey } from '@/lib/createEncKey';
import { ModalButton, ModalCheckBox, ModalContainer, ModalForm, ModalInput, ModalTitle } from '@/lib/Modal';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)


export default function Login() {
    const Router = useRouter()
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [riskAccept, setRiskAccept] = useState(false);
    const [signUpDisclamer, setDisclamerState] = useState(true);

    const [showPassword, setShowpassword] = useState(false);

    useEffect(() => {
        if (pb.authStore.isValid) {
            return Router.push('/page/firstopen')
        }
        setIsLoading(false)
    }, []);

    async function auth() {
        if (riskAccept === false) {
            setDisclamerState(true)
            return
        }
        try {
            if (!agree) {
                return toast.error('Please agree to the T&Cs to continue', { position: toast.POSITION.TOP_LEFT });
            }
            ////console.log(name, email, mail)
            if (!email || !password || !name) {
                return toast.error('Please fill out all fields', { position: toast.POSITION.TOP_LEFT });
            }
            setIsLoading(true);
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

            const userTimeZone = getUserTimeZone()


            const newAccData = {
                "email": sanitizedEmail,
                "username": sanitizedName,
                "emailVisibility": false,
                "password": sanitizedPassword,
                "passwordConfirm": sanitizedPassword,
                "time_zone": userTimeZone
            };
            const crateAccProgressToast = toast.loading("Please wait...")
            try {

                const userAccountData = await pb.collection('users').create(newAccData)
                await pb.collection('users').authWithPassword(email, password)

                const encryptionKey = createKey()
                const encData = {
                    "chef": encryptionKey,
                    "plate": userAccountData.id
                };
                //console.log(encData)

                const encRec = await pb.collection('cookies').create(encData);
                //console.log(encRec)
                const newRec = {
                    "meal": encRec.id
                }
                await pb.collection('users').update(userAccountData.id, newRec)
                toast.update(crateAccProgressToast, { render: "Created", type: "success", isLoading: false });


                /* The code is using the `toast.promise()` method to display a toast message
                while sending a verification email to a user's email address. The
                `pb.collection('users').requestVerification(email)` method is called to initiate the
                email sending process. The `toast.promise()` method takes an object with three
                properties (`pending`, `success`, and `error`) to display different messages based
                on the status of the email sending process. */
                await pb.collection('users').requestVerification(email)
                toast.done(crateAccProgressToast)
                Router.push('/page/firstopen')
            } catch (error) {
                //console.log(error)
                setIsLoading(false)
                toast.update(crateAccProgressToast, { render: "Unable to create account!", type: "error", isLoading: false });
            }
        } catch (error) {
            setIsLoading(false)
            //console.log(error)
            toast.update(crateAccProgressToast, { render: "Unable to create account!", type: "error", isLoading: false });
        }
    }

    async function oAtuh() {
        if (!signUpDisclamer) {
            setDisclamerState(true);
        };
        if (riskAccept === false) {
            return
        };
        setIsLoading(true)
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'github' });
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

    function setAgreeState() {
        if (!agree) {
            setAgree(true)
        } else {
            setAgree(false)
        }
    }

    function riskAllow() {
        setDisclamerState(false);
    };
    if (isLoading) {
        return <Loader />
    }
    return (
        <div>
            <Head>
                <title>Signup!</title>
                <link rel="favicon" href="/favicon.ico" />
                <meta name="robots" ></meta>
            </Head>
            <div className={styles.login_box}>
                <div className={styles.formcontainer}>
                    <p className={styles.title}>Signup</p>
                    <form className={styles.form}>
                        <div className={styles.inputgroup}>
                            <label for="username">Username</label>
                            <input onChange={(e) => setName(e.target.value)} type="text" name="username" id="username" placeholder="" />

                        </div>
                        <div className={styles.inputgroup}>
                            <label for="username">Email</label>
                            <input onChange={event => setEmail(event.target.value)} type="email" name="email" id="email" placeholder="" />
                        </div>
                        <div className={styles.inputgroup}>
                            <label for="password">Password</label>
                            <div className={styles.pwinput}>
                                <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} name="password" id="password" placeholder="" />
                                {showPassword ? (
                                    <svg onClick={() => setShowpassword(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17c.47-.14.96-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.03-.39-1.42 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.65.32-1.37.5-2.14.5zm2.97-5.33c-.15-1.4-1.25-2.49-2.64-2.64l2.64 2.64z" /></svg>
                                ) : (
                                    <svg onClick={() => setShowpassword(true)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                                )}
                            </div>
                        </div>
                        <div className={styles.signupbtns}>
                            <div className={styles.tandccon}>
                                <p>You must agree to the <Link className={styles.legalbtn} href='/auth/terms-and-conditions'>Terms &amp; conditions</Link> and <Link className={styles.legalbtn} href='/auth/privacy-policy'>Privacy policy</Link> to continue</p>
                                <div className={styles.cntr}>
                                    <input onClick={setAgreeState} defaultchecked={agree ? true : false} type="checkbox" id="cbx" className={`${styles.hiddenxsup} ${styles.cbx2}`} value={agree} />
                                    <label for="cbx" className={styles.cbx}></label>
                                </div>
                            </div>
                        </div>
                        <button onClick={auth} className={styles.sign} type='button'>Sign up</button>
                    </form>
                    <div className={styles.socialmessage}>
                        <div className={styles.line}></div>
                        <p className={styles.message}>Other accounts</p>
                        <div className={styles.line}></div>
                    </div>
                    <div className={styles.socialicons}>
                        <button aria-label="Log in with GitHub" className={styles.icon} type='button' onClick={oAtuh}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={`${styles.w5} ${styles.h5} ${styles.fillcurrent}`}>
                                <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
                            </svg>
                        </button>
                    </div>
                    <p className={styles.signup}>
                        <a rel="noopener noreferrer" href="/" className={styles.signup}>Cancel</a>
                    </p>
                </div>

            </div>
            {signUpDisclamer && (
                <ModalContainer events={() => setDisclamerState(false)}>
                    <ModalForm>
                        <div className={styles.warningsvg}><svg aria-hidden="true" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linejoin="round" stroke-linecap="round"></path>
                        </svg></div>

                        <ModalTitle>Beta App</ModalTitle>
                        <p className={styles.warn} style={{ maxHeight: '40dvh', overflowY: 'scroll', overflowX: 'hidden' }}>
                            Important Notice: Beta App - Data Security and Service Availability.<br /><br />

*** The database now resets every 12 hours so any data uploaded or saved will be deleted after 12 hours ***

                            Dear User,

                            We would like to inform you about the nature of our platform before you proceed with signing up. Please note that our application is currently in the proof of concept stage, and as such, certain limitations and risks exist that you should be aware of.

                            Firstly, it is crucial to understand that our platform is not yet a fully developed and stable service. While we are working diligently to improve its functionality and reliability, there is a possibility of encountering unexpected issues, including data loss or service disruptions.

                            In light of this, we want to reiterate that storing sensitive or confidential data on our platform is strongly discouraged. Given its experimental nature, we cannot guarantee the same level of security and data protection as more established services. We kindly request you to refrain from inputting sensitive information that you would not be comfortable with potentially being exposed or lost.

                            By continuing with the signup process, you acknowledge that this is a proof of concept app and accept the associated risks. We appreciate your understanding and participation as we work towards enhancing the stability and security of our platform.

                            If you have any questions or require further clarification, please do not hesitate to reach out to our <a href='mailto:help@jamesmowat.com'>support team</a>.

                            Thank you for your cooperation.
                        </p>
                        <ModalCheckBox chngevent={setRiskAccept}>Accept risk</ModalCheckBox>
                        <ModalButton events={riskAllow}>Continue</ModalButton>
                    </ModalForm>
                </ModalContainer>
            )}
        </div>
    )
}

