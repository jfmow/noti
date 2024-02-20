import LoginPage, { LoginButton, LoginInput } from "@/components/Auth/login";
import { Link } from "@/components/UX-Components";
import { toaster } from "@/components/toast";
import Router from "next/router";
import PocketBase from 'pocketbase'
import { useEffect, useState } from "react";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [codeRequested, setCodeRequested] = useState(false)

    const [queryParams, setQueryParams] = useState(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        setQueryParams(urlParams)
        if (urlParams.has("token") && urlParams.has("user")) {
            const formData = new FormData()
            formData.set("token", urlParams.get("token"))
            formData.set("email", urlParams.get("user"))
            LoginWithCode(null, formData)
        }
    }, [])

    async function HandleForm(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        if (codeRequested) {
            LoginWithCode(formData)
        } else {
            RequestCode(e)
        }
    }

    async function LoginWithCode(formData) {
        try {
            setLoading(true)
            const req = await pb.send("/api/collections/users/auth-with-sso/login", { method: "POST", body: formData })
            window.localStorage.setItem("pocketbase_auth", JSON.stringify(req))
            Router.push("/page/firstopen")
        } catch (err) {
            toaster.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function RequestCode(e) {
        const formData = new FormData(e.target)
        try {
            setLoading(true)
            await pb.send("/api/collections/users/auth-with-sso/code", { method: "POST", body: formData })
            toaster.info("A code has been emailed to the email below")
            setCodeRequested(true)
        } catch (err) {
            toaster.error(err.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <LoginPage method={"Login"}>
            <form onSubmit={HandleForm}>
                <div className="w-full grid grid-cols-2">
                    <span className="text-xs text-gray-500 text-left w-full">Email-Auth (SSO)</span>
                    <Link href="/auth/login/oauth2" className="text-xs text-gray-600 underline text-right w-full">Use OAuth2</Link>
                </div>
                <LoginInput readonly={codeRequested} placeholder="Email | hi@example.com" type="email" name="email" required />
                {codeRequested ? (
                    <>
                        <LoginInput placeholder="Code" name="token" required type="text" />

                    </>
                ) : null}
                <LoginButton loading={loading}>Login</LoginButton>
            </form>
            <div className="w-full mt-4 bg-gray-100 text-gray-400 text-xs p-3 rounded-lg">
                As of 20/02/2024, password based accounts are no longer supported.
            </div>
        </LoginPage>
    )
}