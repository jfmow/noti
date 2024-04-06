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

    const [queryParams, setQueryParams] = useState(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        setQueryParams(urlParams)
    }, [])

    async function HandleForm(e) {
        e.preventDefault()

        Signup(e.target)
    }

    async function Signup(form) {
        const formData = new FormData(form)
        try {
            setLoading(true)
            const req = await pb.send("/api/collections/users/auth-with-sso/startsignup", { method: "POST", body: formData })
            Router.push(`/auth/signup/confirm?email=${formData.get("email")}`)
        } catch (err) {
            toaster.error(err.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <LoginPage method={"Signup"}>
            <form onSubmit={HandleForm}>
                <div className="w-full grid grid-cols-2">
                    <LoginShortcutLink>Email-Auth (SSO)</LoginShortcutLink>
                    <LoginShortcutLink href="/auth/login/oauth2">Use OAuth2</LoginShortcutLink>
                </div>
                <LoginInput placeholder="Email | hi@example.com" type="email" name="email" required />
                <LoginButton loading={loading}>Continue</LoginButton>
            </form>
            <LoginMessage>
                As of 20/02/2024, password based accounts are no longer supported.
            </LoginMessage>
        </LoginPage>
    )
}