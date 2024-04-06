import LoginPage, { LoginButton, LoginInput, LoginMessage, LoginShortcutLink } from "@/components/Auth/login";
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
            LoginWithCode(formData)
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
            const req = await pb.send("/api/collections/users/auth-with-sso/finishlogin", { method: "POST", body: formData })
            window.localStorage.setItem("pocketbase_auth", JSON.stringify(req))
            Router.push("/page")
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
            await pb.send("/api/collections/users/auth-with-sso/startlogin", { method: "POST", body: formData })
            toaster.info(`A code has been emailed to ${formData.get("email")}`)
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
                    <LoginShortcutLink>Email-Auth (SSO)</LoginShortcutLink>
                    <LoginShortcutLink href={"/auth/login/oauth2"}>Use OAuth2</LoginShortcutLink>
                </div>
                <LoginInput readonly={codeRequested} placeholder="Email | hi@example.com" type="email" name="email" required />
                {codeRequested ? (
                    <>
                        <LoginInput placeholder="Code" name="token" required type="text" />

                    </>
                ) : null}
                <LoginButton loading={loading}>Login</LoginButton>
            </form>
            <LoginMessage>
                As of 20/02/2024, password based accounts are no longer supported.
            </LoginMessage>
        </LoginPage>
    )
}