import Link from "@/components/Link"
import Loader from "@/components/Loader"
import { Input, SubmitButton } from "@/components/UX-Components"
import { ToolTip, ToolTipCon, ToolTipTrigger } from "@/components/UX-Components/Tooltip"
import { toaster } from "@/components/toast"
import { ArrowLeft, LinkIcon, Loader2, X } from "lucide-react"
import { useRouter } from "next/router"
import PocketBase from 'pocketbase'
import { useEffect, useState } from "react"
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)
export default function ResetPassword() {
    const { query } = useRouter()
    const [loading, setLoading] = useState(true)
    const token = query?.token
    const [oAuthAccounts, setLinkedAccounts] = useState([])

    useEffect(() => {
        async function UpdateAuth() {
            if (pb.authStore.isValid) {
                try {
                    const authData = await pb.collection('users').authRefresh();
                    setLoading(false)
                } catch {
                    window.location.replace("/auth/login")
                }
            } else {
                window.location.replace("/auth/login")
            }
        }
        UpdateAuth()
    }, [])

    if (loading) {
        return <Loader />
    }

    return (
        <>

            <div className="relative w-full h-[100dvh] text-zinc-800 bg-zinc-50">
                <Link href={"/page/firstopen"} className="absolute z-[5] top-7 left-7 cursor-pointer">
                    <ArrowLeft className="w-6 h-6 text-zinc-600" />
                </Link>
                <div class="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-[2] w-full h-[100dvh] flex gap-5 items-center justify-center">
                    <RemoveOAuthAccount oAuthAccounts={oAuthAccounts} setLinkedAccounts={setLinkedAccounts} />
                    <LinkOAuthAccount oAuthAccounts={oAuthAccounts} />
                </div>

            </div>

        </>
    )
}

function RemoveOAuthAccount({ oAuthAccounts, setLinkedAccounts }) {

    useEffect(() => {
        async function GetLinkedOAuthAccounts() {
            const result = await pb.collection('users').listExternalAuths(
                pb.authStore.model.id
            );
            setLinkedAccounts(result)
        }
        GetLinkedOAuthAccounts()
    }, [])

    async function handleUnLinkProvider(provider) {
        await pb.collection('users').unlinkExternalAuth(
            pb.authStore.model.id,
            provider
        );
    }
    return (
        <>
            {oAuthAccounts.length >= 1 ? (<>
                <div className="max-w-[80%] w-[400px]">
                    <h1 className="mb-2 font-semibold text-2xl text-left">Un-link OAuth provider</h1>
                    {oAuthAccounts.map((item) => (
                        <>
                            <div className="w-full min-h-[55px] bg-zinc-100 shadow-sm py-2 px-6 rounded-xl flex items-center font-semibold text-md justify-between">
                                <div className="flex items-center justify-center">
                                    <img src={`/icons/oauth/${item.provider}.svg`} className="w-4 h-4 mr-2" />
                                    {item.provider}
                                </div>
                                <ToolTipCon>
                                    <ToolTipTrigger>
                                        <div aria-haspopup aria-label={`Unlink ${item.provider} from your account`} onClick={() => handleUnLinkProvider(item.provider)} className="cursor-pointer">
                                            <X className="w-4 h-4" />
                                        </div>
                                    </ToolTipTrigger>
                                    <ToolTip>
                                        Un-link provider
                                    </ToolTip>
                                </ToolTipCon>
                            </div>
                        </>
                    ))}
                </div>
                <div className="h-full w-[1px] border border-zinc-200" />
            </>) : null}
        </>
    )
}

function LinkOAuthAccount({ oAuthAccounts }) {
    const [providers, setProviders] = useState([])
    useEffect(() => {
        async function getProviders() {
            const result = await pb.collection('users').listAuthMethods();
            const oAuthProviders = result.authProviders
            const filtered = oAuthProviders.map((item) => {
                if (!oAuthAccounts.find((aitem) => aitem.provider === item.name)) {
                    return item
                }
            })
            setProviders(filtered.filter((item) => item !== undefined))
        }
        getProviders()
    }, [oAuthAccounts])

    async function handleLinkProvider(provider) {
        if (!confirm("The email for the OAuth provider's account must match the one for this account or else the accounts will not link and a new account will be created!")) return
        try {
            const authData = await pb.collection('users').authWithOAuth2({ provider: provider });
            window.location.reload()
        } catch (err) {
            toaster.error(err.message)
        }
    }

    return (
        <>
            {providers.length >= 1 ? (
                <>
                    <div className="pt-2 max-w-[80%] w-[400px]">
                        <h1 className="mb-2 font-semibold text-2xl text-left">Link OAuth provider</h1>
                        {providers.map((item) => (
                            <>
                                <div className="w-full min-h-[55px] bg-zinc-100 shadow-sm py-2 px-6 rounded-xl flex items-center font-semibold text-md justify-between">
                                    <div className="flex items-center justify-center">
                                        <img src={`/icons/oauth/${item.name}.svg`} className="w-4 h-4 mr-2" />
                                        {item.displayName}
                                    </div>
                                    <ToolTipCon>
                                        <ToolTipTrigger>
                                            <div onClick={() => handleLinkProvider(item.name)} aria-haspopup aria-label={`Link ${item.displayName} oauth provider to account`} className="cursor-pointer">
                                                <LinkIcon className="w-4 h-4" />
                                            </div>
                                        </ToolTipTrigger>
                                        <ToolTip>
                                            Link provider
                                        </ToolTip>
                                    </ToolTipCon>
                                </div>
                            </>
                        ))}

                    </div>
                </>
            ) : null}
        </>
    )
}