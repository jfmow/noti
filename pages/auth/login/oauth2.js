import LoginPage, { LoginButton, LoginInput } from "@/components/Auth/login";
import { Link } from "@/components/UX-Components";
import { toaster } from "@/components/toast";
import Router from "next/router";
import PocketBase from 'pocketbase'
import { useEffect, useState } from "react";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

export default function Login() {
    const [oAuthProviders, setOAuthProviders] = useState([])

    const [queryParams, setQueryParams] = useState(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        setQueryParams(urlParams)
        async function getOauthMethods() {
            const result = await pb.collection('users').listAuthMethods();
            const providers = result.authProviders.map((item) => {
                return item.name
            })
            setOAuthProviders(providers)
        }
        getOauthMethods()
    }, [])

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
        <LoginPage method={"Login"}>
            <div>
                <div className="w-full grid grid-cols-2 mb-2">
                    <span className="text-xs text-gray-500 text-left w-full">OAuth2 auth</span>
                    <Link href="/auth/login" className="text-xs text-gray-600 underline text-right w-full">Use Email-Auth (SSO)</Link>
                </div>
                {oAuthProviders.map((item) => (
                    <>
                        <button className="my-2 flex w-full min-h-[37px] rounded-lg bg-zinc-300 items-center justify-center gap-3 px-3 py-2 font-semibold text-zinc-800 hover:bg-zinc-200 transition-all duration-300" onClick={() => OAuthLogin(item)}>
                            <img className="w-5 h-5" src={`/icons/oauth/${item}.svg`} />
                            {item.slice(0, 1).toUpperCase()}{item.slice(1)}
                        </button>
                    </>
                ))}
            </div>
        </LoginPage>
    )
}