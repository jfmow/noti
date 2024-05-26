import OAuth2LoginButtons from "@/components/Auth/OAuth2/methods";
import LoginPage, { LoginButton, LoginInput, LoginShortcutLink } from "@/components/Auth/login";
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
        //TODO: Support plans -> ?plan=pro / ?plan=normal
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
                <div className="w-full flex items-center justify-between">
                    <div />
                    <LoginShortcutLink href={"/auth/login"}>Login</LoginShortcutLink>
                </div>
                <LoginInput placeholder="Email | hi@example.com" type="email" name="email" required />
                <LoginButton loading={loading}>Continue</LoginButton>
            </form>
            <OAuth2LoginButtons />
        </LoginPage>
    )
}