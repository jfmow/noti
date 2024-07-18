import LoginPage, { LoginButton, LoginInput, LoginMessage } from "@/components/Auth/login";
import { toaster } from "@/components/toast";
import Router from "next/router";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase"

export default function Login() {
    const [loading, setLoading] = useState(false)

    const [queryData, setQueryData] = useState({})

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const data = {
            "email": urlParams.get("email"),
            "token": urlParams.get("token"),
            "username": urlParams.get("username")
        }
        setQueryData(data)
    }, [])

    async function HandleForm(e) {
        e.preventDefault()

        Signup(e.target)
    }

    async function Signup(form) {
        const formData = new FormData(form)
        try {
            setLoading(true)
            const req = await pb.send("/api/collections/users/auth-with-sso/finishsignup", { method: "POST", body: formData })
            window.localStorage.setItem("pocketbase_auth", JSON.stringify(req))
            window.location.replace("/page")
        } catch (err) {
            toaster.error(err.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <LoginPage method={"Signup"}>
            <div className="w-full mb-4 bg-red-100 text-red-400 text-xs p-3 rounded-lg">
                Paste the token from the email sent to <strong>{queryData?.email}</strong> to complete the signup form below
            </div>
            <form onSubmit={HandleForm}>
                <LoginInput minlength={15} placeholder="Token" name="token" required type="text" defaultValue={queryData?.token} />
                <LoginInput placeholder="Email | hi@example.com" type="email" name="email" required defaultValue={queryData?.email} disabled />
                <LoginInput placeholder="Email | hi@example.com" type="email" name="email" required defaultValue={queryData?.email} hidden />
                <LoginInput minlength={3} placeholder="Username | mom" name="username" required type="text" defaultValue={queryData?.username} />
                <LoginButton loading={loading}>Signup</LoginButton>
                <LoginMessage>
                    By completing the signup process, you are acknowledging your agreement to comply with the terms and conditions, as well as the privacy policy, of this website. You can find links to these documents provided above for your convenience.
                </LoginMessage>
            </form>

        </LoginPage>
    )
}