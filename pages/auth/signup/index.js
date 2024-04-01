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
                    <span className="text-xs text-gray-500 text-left w-full">Email-Auth (SSO)</span>
                    <Link href="/auth/login/oauth2" className="text-xs text-gray-600 underline text-right w-full">Use OAuth2</Link>
                </div>
                <LoginInput placeholder="Email | hi@example.com" type="email" name="email" required />
                <LoginButton loading={loading}>Continue</LoginButton>
            </form>
            <div className="w-full mt-4 bg-gray-100 text-gray-400 text-xs p-3 rounded-lg">
                As of 20/02/2024, password based accounts are no longer supported.
            </div>
        </LoginPage>
    )
}