import { Link, SubmitButton } from "@/components/UX-Components";
import { toaster } from "@/components/toast";
import PocketBase from 'pocketbase'
import Router, { useRouter } from "next/router";
import { Modal, ModalContent, ModalTrigger } from "@/lib/Modals/Modal";
import { Github, Key, Loader2, Twitch } from "lucide-react";
import { useEffect, useState } from "react";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)
export default function Login() {
    const [sso, setSSO] = useState(false)
    const { query } = useRouter()
    useEffect(() => {
        if (query?.msg) {
            toaster.error(query.msg)
        }
        if (query.ssoEmail && query.ssoToken) {
            setSSO(true)
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

    return (
        <div className="bg-zinc-50 w-full h-screen grid">

            <div className="w-[100vw] sm:w-[100%] h-full p-3 bg-zinc-100 border-r border-zinc-200 shadow-lg flex flex-col items-center justify-center relative"><div class="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="z-2 relative  flex flex-col items-center justify-center ">
                    <div className="flex items-center justify-center flex-col">
                        <h1 className=" mb-2  font-[700] text-5xl text-zinc-800">Log in</h1>
                    </div>
                    <div className="w-[400px] mb-4 mt-2 pb-5 flex flex-col items-center justify-center border-b">
                        <div className="w-[300px] mt-3 grid gap-1 grid-cols-2">
                            <SubmitButton onClick={() => OAuthLogin('github')}>
                                <Github className="w-5 h-5" />
                                Github
                            </SubmitButton>
                            <SubmitButton onClick={() => OAuthLogin('twitch')}>
                                <Twitch className="w-5 h-5" />
                                Twitch
                            </SubmitButton>
                        </div>
                    </div>

                    {!sso ? (
                        <>
                            <PasswordLogin />

                            <Link className="underline mt-4 cursor-pointer" onClick={() => setSSO(true)}>SSO Login</Link>
                        </>
                    ) : (
                        <>
                            <SSOLogin prefill={{ email: query?.ssoEmail, code: query?.ssoToken }} />
                            <Link className="underline mt-4 cursor-pointer" onClick={() => setSSO(false)}>Username/Email Login</Link>
                        </>
                    )}



                </div>
                <Link className="absolute  w-full text-center bottom-5 cursor-pointer" href={`${query?.redirect ? `/auth/signup?redirect=${query.redirect}` : '/auth/signup'}`}>Signup</Link>
            </div>

        </div >
    )
}

function PasswordLogin() {
    const { query } = useRouter()
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [invalidUser, setInvalidUser] = useState(false)
    const [invalidPassword, setInvalidPassword] = useState(false)
    async function Login() {
        if (!user || user.length < 3) {
            setInvalidUser(true)
            return
        } else {
            setInvalidUser(false)
        }
        if (!password || password.length < 8) {
            setInvalidPassword(true)
            return
        } else {
            setInvalidPassword(false)
        }
        setLoading(true)
        try {
            await pb.collection('users').authWithPassword(user, password)
            if (query?.redirect) {
                Router.push(query.redirect)
            } else {
                Router.push('/page/firstopen')
            }

            return
        } catch (err) {
            toaster.error(err.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={(e) => { e.preventDefault(); Login() }} className="w-[300px] grid gap-2" >
            {!!invalidUser && (
                <p className="text-sm text-red-500">Invalid username/email</p>
            )}
            <input onChange={(e) => setUser(e.target.value)} placeholder="Email/username" type="text" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            {!!invalidPassword && (
                <p className="text-sm text-red-500">Invalid password {"(must be > 7 characters)"}</p>
            )}
            <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            <SubmitButton alt type="submit" disabled={loading}>{loading ? (<Loader2 className="mr-1 h-4 w-4 animate-spin" />) : null}Login</SubmitButton>
        </form >
    )
}

function SSOLogin({ prefill = { email: '', code: '' } }) {
    const { query } = useRouter()

    const [codeRequested, setCodeRequested] = useState(false)
    const [email, setEmail] = useState(prefill.email)
    const [code, setCode] = useState(prefill.code)
    const [loading, setLoading] = useState(false)
    async function ssoLogin() {
        if (!email) return
        try {
            if (!code) {
                await pb.send(`/api/auth/sso?email=${email}&linkUrl=https://${window.location.hostname}`, { method: "POST" })
                toaster.info(`Code sent to ${email}`)
                setCodeRequested(true)
                return
            } else {
                setLoading(true)
                const req = await pb.send(`/api/auth/sso/login?email=${email}&token=${code}`, { method: "POST" })
                window.localStorage.setItem('pocketbase_auth', JSON.stringify(req))
                if (query?.redirect) {
                    Router.push(query.redirect)
                } else {
                    Router.push('/page/firstopen')
                }
                return
            }
        } catch (err) {
            toaster.error(err.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={(e) => { e.preventDefault(); ssoLogin() }} className="w-[300px] grid gap-2">
            <input defaultValue={email} required onChange={(e) => setEmail(e.target.value)} placeholder="Email | me@example.com" type="email" className="bg-zinc-50 flex h-9 w-full rounded-md border border-zinc-300 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            {codeRequested || code ? (
                <>
                    <input defaultValue={code} required onChange={(e) => setCode(e.target.value)} placeholder="Code" type="text" className="bg-zinc-50 flex h-9 w-full rounded-md border border-zinc-300 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                    <SubmitButton type="submit" disabled={loading}>{loading ? (<Loader2 className="mr-1 h-4 w-4 animate-spin" />) : null}Login</SubmitButton>
                </>
            ) : (
                <SubmitButton type="submit">Request code</SubmitButton>
            )}

        </form >
    )
}