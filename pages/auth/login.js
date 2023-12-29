import { Link, Paragraph, SubmitButton } from "@/components/UX-Components";
import { ToolTip, ToolTipCon, ToolTipTrigger } from "@/components/UX-Components/Tooltip";
import { toaster } from "@/components/toast";
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase'
import Router, { useRouter } from "next/router";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)

export default function Login() {
    const [authMethod, setAuthMethod] = useState(true)
    const [idenity, setIdentity] = useState('')
    const [password, setPassword] = useState('')
    const [codeRequested, setCodeRequested] = useState(false)
    const { query } = useRouter()

    useEffect(() => {
        if (query.ssoToken && query.ssoEmail) {
            ssoLoginCode(query.ssoToken, query.ssoEmail)
        }
    }, [query])

    async function normalLogin() {
        const loadingToast = await toaster.loading('Working...')
        try {
            await pb.collection('users').authWithPassword(idenity, password)
            toaster.dismiss(loadingToast)
            Router.push('/page/firstopen')
        } catch (err) {
            toaster.update(loadingToast, "Invalid username/email or password.", "error")
        }
    }

    async function ssoLoginCode(code, email) {
        try {
            const authData = await pb.send(`/api/auth/sso/login?email=${email}&token=${code}`, { method: 'POST' })
            window.localStorage.setItem('pocketbase_auth', JSON.stringify(authData))
            Router.push('/page/firstopen')
        } catch {
            toaster.info("Invalid sso credentials")
        }
    }

    async function ssoLogin() {
        const loadingToast = await toaster.loading("Requesting code...")
        try {
            if (!idenity) {
                return
            }
            if (!codeRequested) {
                await pb.send(`/api/auth/sso?email=${idenity}&linkUrl=${process.env.NEXT_PUBLIC_CURRENTURL}`, { method: 'POST' })
                toaster.update(loadingToast, `Code sent to ${idenity}`, "success")
                setCodeRequested(true)
            } else {
                toaster.update(loadingToast, "Logging in...")
                ssoLoginCode(password, idenity)
            }
        } catch {
            toaster.update(loadingToast, `Error while sending code to ${idenity}`, "error")
        }
    }

    async function OAuthLogin(provider) {
        const loadingToast = await toaster.loading('Working...')
        try {
            await pb.collection('users').authWithOAuth2({ provider: provider })
            toaster.dismiss(loadingToast)
            Router.push('/page/firstopen')
        } catch (err) {
            toaster.update(loadingToast, "A problem has occured logging in.", "error")
        }
    }

    return (
        <div className="bg-zinc-50 w-full h-screen grid sm:grid-cols-2">

            <div className="hidden sm:flex items-center flex-col justify-center" >
                <h1 className="from-pink-600 via-orange-600 to-red-600 bg-gradient-to-r bg-clip-text text-transparent mb-2  font-[800] text-[38px]">Welcome back</h1>
                <Paragraph>It's a bit lonely here without you ☹️</Paragraph>
            </div>

            <div className="w-[100vw] sm:w-[100%] h-full p-3 bg-zinc-100 border-r border-zinc-200 shadow-lg flex flex-col items-center justify-center">
                <div className="flex items-center justify-center flex-col mb-4">
                    <h1 className="underline decoration-zinc-300 mb-2  font-[600] text-[28px] text-zinc-800">Login</h1>
                    <Paragraph>Enter your account details to login</Paragraph>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); authMethod ? normalLogin() : ssoLogin() }} className="w-[300px] grid gap-2">
                    {authMethod ? (
                        <>
                            <input onChange={(e) => setIdentity(e.target.value)} placeholder="Email/username" type="text" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                            <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                        </>) : (
                        <>
                            <input onChange={(e) => setIdentity(e.target.value)} placeholder="Email" type="email" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />

                            {codeRequested && (
                                <input onChange={(e) => setPassword(e.target.value)} placeholder="Code" type="text" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                            )}
                        </>
                    )}
                    <div className={`grid grid-cols-[1fr_45px] gap-1`}>
                        <SubmitButton type="submit" style={{ margin: 0 }}>Login</SubmitButton>
                        <ToolTipCon>
                            <ToolTipTrigger>
                                <SubmitButton onClick={() => { authMethod ? setAuthMethod(false) : normalLogin() }} type="button" style={{ margin: 0 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-square"><path d="M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z" /><path d="m14 7 3 3" /><path d="M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4" /></svg>
                                </SubmitButton>
                            </ToolTipTrigger>
                            <ToolTip>
                                SSO
                            </ToolTip>
                        </ToolTipCon>
                    </div>
                </form>

                <div className="w-[400px] mt-5 flex flex-col items-center justify-center">
                    <div className="grid grid-cols-[1fr_70px_1fr] items-center w-full justify-items-center select-none">
                        <div className="w-full h-[1px] bg-zinc-400 rounded-xl" />
                        <span className="text-zinc-800">OAuth</span>
                        <div className="w-full h-[1px] bg-zinc-400 rounded-xl" />
                    </div>
                    <div className="w-[300px] mt-3">
                        <SubmitButton alt onClick={() => OAuthLogin('github')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                            Github
                        </SubmitButton>
                        <SubmitButton alt onClick={() => OAuthLogin('twitch')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitch"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" /></svg>                            Twitch
                        </SubmitButton>
                    </div>
                    <Link href="/auth/signup" className="mt-3">Signup</Link>

                </div>
            </div>

        </div>
    )
}