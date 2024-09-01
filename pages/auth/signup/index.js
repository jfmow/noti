import OAuth2LoginButtons from "@/components/Auth/OAuth2/methods";
import LoginPage, { LoginButton, LoginInput, LoginShortcutLink } from "@/components/Auth/login";
import { toaster } from "@/components/toast";
import Router from "next/router";
import { useState } from "react";
import pb from "@/lib/pocketbase"
import { Button, TextInput } from "@/components/UI";

export default function Login() {
    const [loading, setLoading] = useState(false)

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
                <TextInput className="my-2 w-full" placeholder="Email | hi@example.com" type="email" name="email" required />
                <Button filled className="w-full" loading={loading}>Continue</Button>
            </form>
            <OAuth2LoginButtons />
        </LoginPage>
    )
}