import { Link, Paragraph, SubmitButton } from "@/components/UX-Components";
import { ToolTip, ToolTipCon, ToolTipTrigger } from "@/components/UX-Components/Tooltip";
import { toaster } from "@/components/toast";
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase'
import Router, { useRouter } from "next/router";
import { Modal, ModalContent, ModalTrigger } from "@/lib/Modals/Modal";
import { Github, Key, Twitch } from "lucide-react";
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
                await ssoLoginCode(password, idenity)
                toaster.dismiss(loadingToast)
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
        <div className="bg-zinc-50 w-full h-screen grid">

            <div className="w-[100vw] sm:w-[100%] h-full p-3 bg-zinc-100 border-r border-zinc-200 shadow-lg flex flex-col items-center justify-center">
                <div className="flex items-center justify-center flex-col mb-4">
                    <h1 className="underline decoration-zinc-300 mb-2  font-[600] text-[28px] text-zinc-800">Login</h1>
                    <Paragraph>Enter your account details to login</Paragraph>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); authMethod ? normalLogin() : ssoLogin() }} className="w-[300px] grid gap-2">
                    <input onChange={(e) => setIdentity(e.target.value)} placeholder="Email/username" type="text" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                    <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                    <SubmitButton type="submit">Login</SubmitButton>
                </form>

                <div className="w-[400px] mt-5 flex flex-col items-center justify-center border-t">
                    <div className="w-[300px] mt-3 grid grid-cols-3 gap-3">
                        <Modal>
                            <ModalTrigger>
                                <SubmitButton>
                                    <Key className="w-5 h-5" />
                                    SSO
                                </SubmitButton>
                            </ModalTrigger>
                            <ModalContent>
                                <h2 className="mb-2">Single-sign-on.</h2>
                                <form onSubmit={(e) => { e.preventDefault(); ssoLogin() }} className="w-full grid gap-2">
                                    <input required onChange={(e) => setIdentity(e.target.value)} placeholder="Email | me@example.com" type="email" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                    {codeRequested ? (
                                        <>
                                            <input required onChange={(e) => setPassword(e.target.value)} placeholder="Code" type="text" className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 text-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                            <SubmitButton type="submit">Login</SubmitButton>
                                        </>
                                    ) : (
                                        <SubmitButton type="submit">Request code</SubmitButton>
                                    )}

                                </form >
                            </ModalContent>
                        </Modal>
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

                <Link className="absolute bottom-5 cursor-pointer" href="/auth/signup">Signup</Link>
            </div>

        </div>
    )
}