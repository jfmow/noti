import { Link, Paragraph, SubmitButton } from "@/components/UX-Components";
import { toaster } from "@/components/toast";
import PocketBase from 'pocketbase'
import Router, { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)
export default function Login() {
    const [authMethod, setAuthMethod] = useState('sso')
    const [oauthmethods, setOauthmethods] = useState([])
    const [idenity, setIdentity] = useState('')
    const [password, setPassword] = useState('')
    const [emailAuthCodeRequested, setemailAuthCodeRequested] = useState(false)
    const [emailAuthToken, setemailAuthToken] = useState('')
    const [loading, setLoading] = useState(false)
    const { query } = useRouter()
    useEffect(() => {
        async function getOauthMethods() {
            const result = await pb.collection('users').listAuthMethods();
            const providers = result.authProviders.map((item) => {
                return item.name
            })
            setOauthmethods(providers)
        }
        getOauthMethods()
    }, [])
    useEffect(() => {
        if (query?.msg) {
            toaster.error(query.msg)
        }
        if (query.ssoEmail && query.ssoToken) {
            //TODO: this
            authWithToken(query.ssoToken, query.ssoEmail)
        }
    }, [query])
    async function OAuthLogin(provider) {
        const loadingToast = await toaster.loading('Working...')
        try {
            await pb.collection('users').authWithOAuth2({ provider: provider })
            toaster.dismiss(loadingToast)
            if (query?.redirect) {
                Router.push(query.redirect)
            } else {
                Router.push('/page/firstopen')
            }
        } catch (err) {
            toaster.update(loadingToast, "A problem has occured logging in.", "error")
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    async function authWithPassword() {
        if (idenity.length < 3 || password.length < 7) return toaster.error("Invalid email/password")
        setLoading(true)
        try {
            await pb.collection('users').authWithPassword(
                idenity,
                password,
            );
            Router.push("/page/firstopen")
        } catch (error) {
            toaster.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function requestToken() {
        setLoading(true)
        try {
            const req = await pb.send(`/api/auth/sso?email=${idenity}&linkUrl=https://${window.location.hostname}`, { method: "POST" })
            toaster.info(`A code has been emailed to ${idenity}. This code is valid for 5 minutes`)
            setemailAuthCodeRequested(true)
        } catch (error) {
            toaster.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function authWithToken(token, email) {
        setLoading(true)
        try {
            const req = await pb.send(`/api/auth/sso/login?email=${email}&token=${token}`, { method: "POST" })
            window.localStorage.setItem('pocketbase_auth', JSON.stringify(req))
            if (query?.redirect) {
                Router.push(query.redirect)
            } else {
                Router.push('/page/firstopen')
            }
        } catch (error) {
            toaster.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-zinc-50 w-full h-screen grid">

            <div className="w-[100vw] sm:w-[100%] h-full p-3 bg-zinc-100 border-r border-zinc-200 shadow-lg flex flex-col items-center justify-center relative"><div class="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="z-2 relative  flex flex-col items-center justify-center ">
                    <div className="flex items-center justify-center flex-col mb-4">
                        <h1 className="underline decoration-zinc-300 mb-2  font-[600] text-[28px] text-zinc-800">Log in</h1>
                        <Paragraph>Enter your details to continue</Paragraph>

                    </div>

                    {authMethod === "password" || !authMethod ? (
                        <>
                            <form onSubmit={(e) => { e.preventDefault(); authWithPassword() }} className="w-[300px] grid gap-2">
                                <input defaultValue={idenity} required onChange={(e) => setIdentity(e.target.value)} placeholder="Email | me@example.com" type="email" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                {isValidEmail(idenity) ? (
                                    <>
                                        <input required onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                    </>
                                ) : null}
                                <SubmitButton type="submit" disabled={loading}>{loading ? (<Loader2 className="mr-1 h-4 w-4 animate-spin" />) : null}Log in</SubmitButton>
                            </form >
                            <Link onClick={() => setAuthMethod('sso')} className="mt-4 underline cursor-pointer">Use Email Auth</Link>
                        </>
                    ) : null}
                    {authMethod === "sso" ? (
                        <>
                            <form onSubmit={(e) => { e.preventDefault(); emailAuthCodeRequested ? authWithToken(emailAuthToken, idenity) : requestToken() }} className="w-[300px] grid gap-2">
                                <input defaultValue={idenity} required onChange={(e) => setIdentity(e.target.value)} placeholder="Email | me@example.com" type="email" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                {emailAuthCodeRequested ? (
                                    <>
                                        <input required onChange={(e) => setemailAuthToken(e.target.value)} placeholder="Token" type="text" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                        <SubmitButton type="submit" disabled={loading}>{loading ? (<Loader2 className="mr-1 h-4 w-4 animate-spin" />) : null}Log in</SubmitButton>
                                    </>
                                ) : (
                                    <SubmitButton type="submit" disabled={loading}>{loading ? (<Loader2 className="mr-1 h-4 w-4 animate-spin" />) : null}Request code</SubmitButton>
                                )}
                            </form >
                            <Link onClick={() => setAuthMethod('password')} className="mt-4 underline cursor-pointer">Use password</Link>
                        </>
                    ) : null}

                    <div className="w-[400px] mt-5 flex flex-col items-center justify-center border-t">
                        <div className="w-[300px] mt-3 grid grid-cols-2 gap-3">
                            {oauthmethods.map((item) => (
                                <button className="flex w-full min-h-[37px] rounded-lg bg-zinc-300 items-center justify-center gap-3 px-3 py-2 font-semibold text-zinc-800 hover:bg-zinc-200 transition-all duration-300" onClick={() => OAuthLogin(item)}>
                                    <img className="w-5 h-5" src={`/icons/oauth/${item}.svg`} />
                                    {item.slice(0, 1).toUpperCase()}{item.slice(1)}
                                </button>
                            ))}
                        </div>

                    </div>



                </div>
                <Link className="absolute  w-full text-center bottom-5 cursor-pointer" href={`${query?.redirect ? `/auth/signup?redirect=${query.redirect}` : '/auth/signup'}`}>Signup</Link>
            </div>

        </div >
    )
}