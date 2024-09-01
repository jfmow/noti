import OAuth2LoginButtons from "@/components/Auth/OAuth2/methods";
import LoginPage, { LoginButton, LoginInput, LoginShortcutLink } from "@/components/Auth/login";
import { toaster } from "@/components/toast";
import Router from "next/router";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase"
import { Button, NumberInput, TextInput } from "@/components/UI";

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [codeRequested, setCodeRequested] = useState(false)
    const [twofaCodeRequired, set2FARequired] = useState(false)
    const [defaultData, setDefaultData] = useState({})

    const [queryParams, setQueryParams] = useState(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        setQueryParams(urlParams)
        if (urlParams.has("token") && urlParams.has("email")) {
            const formData = new FormData()
            formData.set("token", urlParams.get("token"))
            formData.set("email", urlParams.get("email"))
            setCodeRequested(true)
            setDefaultData({ email: urlParams.get("email"), code: urlParams.get("token") })
            if (urlParams.has("2fa")) {
                if (urlParams.get("2fa") === "1") {
                    set2FARequired(true)
                }
            } else {
                LoginWithCode(formData)
            }
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
            window.location.replace("/page")
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
            const req = await pb.send("/api/collections/users/auth-with-sso/startlogin", { method: "POST", body: formData })
            toaster.info(`A code has been emailed to ${formData.get("email")}`)
            setCodeRequested(true)
            if (req["2fa"] === "required") {
                toaster.info("Please also enter your 2FA code in the next step!")
                set2FARequired(true)
            }
        } catch (err) {
            toaster.error(err.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <LoginPage method={"Login"}>
            <form onSubmit={HandleForm}>
                <div className="w-full flex items-center justify-between">
                    <div />
                    <LoginShortcutLink href={"/auth/signup"}>Signup</LoginShortcutLink>
                </div>
                <TextInput className="w-full my-2" defaultValue={defaultData?.email || ""} readonly={codeRequested} placeholder="Email | hi@example.com" type="email" name="email" required />
                {codeRequested ? (
                    <>
                        <TextInput className="w-full mb-2" defaultValue={defaultData?.code || ""} placeholder="Emailed code" name="token" required type="text" />
                    </>
                ) : null}
                {codeRequested && twofaCodeRequired ? (
                    <>
                        <NumberInput className="w-full mb-2" placeholder="2FA Code: e.g 123456" name="2fa" required type="number" minlength={6} />
                    </>
                ) : null}
                <Button className="w-full" filled loading={loading}>{codeRequested ? "Login" : "Request magic link"}</Button>
            </form>
            <OAuth2LoginButtons />
        </LoginPage>
    )
}