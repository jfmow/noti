import { Link, Paragraph, SubmitButton } from "@/components/UX-Components";
import { ToolTip, ToolTipCon, ToolTipTrigger } from "@/components/UX-Components/Tooltip";
import { toaster } from "@/components/toast";
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase'
import Router, { useRouter } from "next/router";
import { Github, Key, Twitch } from "lucide-react";
import { Modal, ModalContent, ModalTrigger } from "@/lib/Modals/Modal";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)

export default function Login() {
    const [authMethod, setAuthMethod] = useState('password')
    const [idenity, setIdentity] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    async function normalLogin() {
        const loadingToast = await toaster.loading('Working...')
        try {
            await pb.collection('users').create({
                "username": username,
                "email": idenity,
                "emailVisibility": false,
                "password": password,
                "passwordConfirm": password,
            })
            await pb.collection('users').authWithPassword(idenity, password)
            toaster.dismiss(loadingToast)
            Router.push('/page/firstopen')
        } catch (err) {
            toaster.update(loadingToast, "Invalid username/email or password.", "error")
        }
    }

    async function ssoLogin() {
        const loadingToast = await toaster.loading("Working...")
        try {
            if (!idenity || !username) {
                toaster.dismiss(loadingToast)
                return
            }
            const authData = await pb.send(`/api/auth/sso/signup?email=${idenity}&username=${username}&linkUrl=${process.env.NEXT_PUBLIC_CURRENTURL}`, { method: 'POST' })
            window.localStorage.setItem('pocketbase_auth', JSON.stringify(authData))
            toaster.dismiss(loadingToast)
            Router.push('/page/firstopen')
        } catch {
            toaster.update(loadingToast, `Invalid username/email`, "error")
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

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    return (
        <div className="bg-zinc-50 w-full h-screen grid relative">
            <div className="w-[100vw] sm:w-[100%] h-full p-3 bg-zinc-100 border-r border-zinc-200 shadow-lg flex flex-col items-center justify-center">
                <div class="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="z-2 relative  flex flex-col items-center justify-center ">
                    <div className="flex items-center justify-center flex-col mb-4">
                        <h1 className="underline decoration-zinc-300 mb-2  font-[600] text-[28px] text-zinc-800">Signup</h1>
                        <Paragraph>Enter your details to signup</Paragraph>
                        <div className="flex gap-3">
                            <Link href="/auth/terms-and-conditions">Terms and conditions</Link>
                            <Link href="/auth/privacy-policy">Privacy policy</Link>
                        </div>

                    </div>
                    {authMethod === "password" || !authMethod ? (
                        <>
                            <form onSubmit={(e) => { e.preventDefault(); normalLogin() }} className="w-[300px] grid gap-2">
                                <input defaultValue={idenity} required onChange={(e) => setIdentity(e.target.value)} placeholder="Email" type="email" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                {isValidEmail(idenity) ? (
                                    <>
                                        <input required onChange={(e) => setUsername(e.target.value)} placeholder="username" type="text" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                        <input required onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                    </>
                                ) : null}
                                <SubmitButton type="submit">Signup</SubmitButton>
                            </form >
                            <Link onClick={() => setAuthMethod('sso')} className="mt-4 underline cursor-pointer">Use Email Auth</Link>
                        </>
                    ) : null}
                    {authMethod === "sso" ? (
                        <>
                            <form onSubmit={(e) => { e.preventDefault(); ssoLogin() }} className="w-[300px] grid gap-2">
                                <input defaultValue={idenity} required onChange={(e) => setIdentity(e.target.value)} placeholder="Email | me@example.com" type="email" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                {isValidEmail(idenity) ? (
                                    <input required onChange={(e) => setUsername(e.target.value)} placeholder="Username" type="text" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                ) : null}
                                <SubmitButton type="submit">Signup</SubmitButton>
                            </form >
                            <Link onClick={() => setAuthMethod('password')} className="mt-4 underline cursor-pointer">Use password</Link>
                        </>
                    ) : null}




                    <div className="w-[400px] mt-5 flex flex-col items-center justify-center border-t">
                        <div className="w-[300px] mt-3 grid grid-cols-2 gap-3">
                            <SubmitButton alt onClick={() => OAuthLogin('github')}>
                                <Github className="w-5 h-5" />
                                Github
                            </SubmitButton>
                            <SubmitButton alt onClick={() => OAuthLogin('twitch')}>
                                <Twitch className="w-5 h-5" />
                                Twitch
                            </SubmitButton>
                        </div>

                    </div>
                </div>

            </div >
            <Link className="absolute bottom-5 w-full text-center cursor-pointer" href="/auth/login">Login</Link>


        </div >
    )
}