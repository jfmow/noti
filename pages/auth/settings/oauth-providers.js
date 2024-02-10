import Link from "@/components/Link"
import Loader from "@/components/Loader"
import { Input, SubmitButton } from "@/components/UX-Components"
import { ToolTip, ToolTipCon, ToolTipTrigger } from "@/components/UX-Components/Tooltip"
import { toaster } from "@/components/toast"
import { Modal, ModalContent } from "@/lib/Modals/Modal"
import { ArrowLeft, LinkIcon, Loader2, Unlink, X } from "lucide-react"
import Router, { useRouter } from "next/router"
import PocketBase from 'pocketbase'
import { useEffect, useState } from "react"
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)
export default function OAuthManager() {

    return (
        <>

            <div className="relative w-full h-[100dvh] text-zinc-800 bg-zinc-50">
                <Link href={"/page/firstopen"} className="absolute z-[5] top-7 left-7 cursor-pointer">
                    <ArrowLeft className="w-6 h-6 text-zinc-600" />
                </Link>
                <div class="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="relative z-[2] w-full h-[100dvh] flex flex-col gap-5 items-center justify-center">
                    <Content />
                </div>

            </div>

        </>
    )
}

function Content() {
    const [providers, setProviders] = useState([])
    const [loading, setLoading] = useState(true)
    const Router = useRouter()
    const { msg } = Router.query

    useEffect(() => {
        async function UpdateAuth() {
            if (pb.authStore.isValid) {
                try {
                    const authData = await pb.collection('users').authRefresh();
                } catch {
                    window.location.replace("/auth/login")
                }
            } else {
                window.location.replace("/auth/login")
            }
        }
        async function getProviders() {
            await UpdateAuth()
            const result = await pb.collection('users').listAuthMethods();
            const providers = result.authProviders
            const data = providers.map((item) => {
                return { ...item, linked: "loading" }
            })
            setProviders(data)
            setLoading(false)
            return data
        }
        async function getUsersAuthMethods() {
            const providers = await getProviders()
            const linkedProviders = await pb.collection('users').listExternalAuths(
                pb.authStore.model.id
            );

            //Sorting logic, for if they use provider or not
            const data = providers.map((item) => {
                if (linkedProviders.some((aitem) => aitem.provider === item.name)) {
                    return { ...item, linked: true }
                } else {
                    return { ...item, linked: false }
                }
            })
            console.log(data)
            setProviders(data)
        }
        getUsersAuthMethods()
    }, [])


    if (loading) {
        return (
            <div className="w-full max-w-[400px]">
                <div aria-label="oauth2 provider" className="my-6 w-full min-h-[55px] bg-zinc-100 shadow-lg py-2 px-6 rounded-xl flex items-center font-semibold text-md justify-between">
                    <div className="inline-flex items-center">
                        <span className="animate-pulse h-4 w-4 bg-zinc-300 rounded-[99999px] mr-2"></span>
                        <span className="animate-pulse h-4 max-w-full w-[100px] bg-zinc-300 rounded"></span>
                    </div>
                    <div className="inline-flex items-center">
                        <span className="animate-pulse h-4 w-4 bg-zinc-300 rounded-[99999px]"></span>
                    </div>
                </div>
                <div aria-label="oauth2 provider" className="my-6 w-full min-h-[55px] bg-zinc-100 shadow-lg py-2 px-6 rounded-xl flex items-center font-semibold text-md justify-between">
                    <div className="inline-flex items-center">
                        <span className="animate-pulse h-4 w-4 bg-zinc-300 rounded-[99999px] mr-2"></span>
                        <span className="animate-pulse h-4 max-w-full w-[100px] bg-zinc-300 rounded"></span>
                    </div>
                    <div className="inline-flex items-center">
                        <span className="animate-pulse h-4 w-4 bg-zinc-300 rounded-[99999px]"></span>
                    </div>
                </div>
                <div aria-label="oauth2 provider" className="my-6 w-full min-h-[55px] bg-zinc-100 shadow-lg py-2 px-6 rounded-xl flex items-center font-semibold text-md justify-between">
                    <div className="inline-flex items-center">
                        <span className="animate-pulse h-4 w-4 bg-zinc-300 rounded-[99999px] mr-2"></span>
                        <span className="animate-pulse h-4 max-w-full w-[100px] bg-zinc-300 rounded"></span>
                    </div>
                    <div className="inline-flex items-center">
                        <span className="animate-pulse h-4 w-4 bg-zinc-300 rounded-[99999px]"></span>
                    </div>
                </div>
                <div aria-label="oauth2 provider" className="my-6 w-full min-h-[55px] bg-zinc-100 shadow-lg py-2 px-6 rounded-xl flex items-center font-semibold text-md justify-between">
                    <div className="inline-flex items-center">
                        <span className="animate-pulse h-4 w-4 bg-zinc-300 rounded-[99999px] mr-2"></span>
                        <span className="animate-pulse h-4 max-w-full w-[100px] bg-zinc-300 rounded"></span>
                    </div>
                    <div className="inline-flex items-center">
                        <span className="animate-pulse h-4 w-4 bg-zinc-300 rounded-[99999px]"></span>
                    </div>
                </div>

            </div>
        )
    }

    return (
        <div className="w-full max-w-[400px]">
            {msg ? (
                <div className="font-semibold text-red-500 mt-6 mb-6 bg-red-100 p-4 rounded-xl">
                    {msg}
                </div>
            ) : null}
            {providers.map((item) => (
                <div aria-label="oauth2 provider" className="my-6 w-full min-h-[55px] bg-zinc-100 shadow-lg py-2 px-6 rounded-xl flex items-center font-semibold text-md justify-between">
                    <div className="inline-flex items-center">
                        <img aria-label="oauth2 provider icon" src={`/icons/oauth/${item.name}.svg`} className="w-4 h-4 mr-2" />
                        <span>{item.name}</span>
                    </div>
                    <div className="inline-flex items-center">
                        {item.linked === "loading" ? (<Loader2 className="h-4 w-4 animate-spin" />) : (
                            <>
                                {item.linked ? (
                                    <UNLink provider={item.name} />
                                ) : (
                                    <LinkProvider provider={item.name} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

function UNLink({ provider }) {
    async function handleUnLinkProvider(e) {
        e.preventDefault()
        try {
            await pb.send(`/api/collections/users/records/${pb.authStore.model.id}/external-auths/${provider}`, { method: "DELETE" })
            window.location.replace(`${window.location.pathname}?msg=${encodeURIComponent(`You just un-linked ${provider}! If you did not set a password/don't know your password, please use the password reset form on the login page.`)}`)
        } catch (err) {
            toaster.error(err.message)
        }
    }

    return (
        <>
            <ToolTipCon>
                <ToolTipTrigger>
                    <button type="submit" onClick={handleUnLinkProvider} aria-haspopup="dialog" aria-label="unlink oauth2 provider">
                        <Unlink className="w-4 h-4" />
                    </button>
                </ToolTipTrigger>
                <ToolTip>
                    Un-link {provider}
                </ToolTip>
            </ToolTipCon>
        </>
    )
}

function LinkProvider({ provider }) {
    async function handleLinkProvider(e) {
        e.preventDefault()
        if (!confirm("The email for the OAuth provider's account must match the one for this account or else the accounts will not link and a new account will be created!")) return
        try {
            const authData = await pb.collection('users').authWithOAuth2({ provider: provider });
            window.location.reload()
        } catch (err) {
            toaster.error(err.message)
        }
    }
    return (
        <ToolTipCon>
            <ToolTipTrigger>
                <button type="submit" onClick={handleLinkProvider} aria-haspopup="dialog" aria-label="link oauth2 provider">
                    <LinkIcon className="w-4 h-4" />
                </button>
            </ToolTipTrigger>
            <ToolTip>
                Link {provider}
            </ToolTip>
        </ToolTipCon>
    )
}