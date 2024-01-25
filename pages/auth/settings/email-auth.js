import { Link } from "@/components/UX-Components"
import { Input, Paragraph, SubmitButton } from "@/components/UX-Components"
import { toaster } from "@/components/toast"
import { ArrowLeft } from "lucide-react"
import Router, { useRouter } from "next/router"
import PocketBase from 'pocketbase'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function EmailAuth() {
    const { query } = useRouter()
    const disabling = Boolean(+query?.state)

    async function handleDisable(e) {
        e.preventDefault()
        if (disabling) {
            const form = new FormData(e.target)
            const passwordA = form.get("passwordA").trim()
            const passwordB = form.get("passwordB").trim()
            if (passwordA !== passwordB) {
                return toaster.error("Passwords must match")
            }
            if (passwordB.length < 8) {
                return toaster.error("Password must be at least 8 characters long")
            }
            try {
                const req = await pb.send('/api/auth/sso/toggle', { method: "POST", body: form })
                pb.authStore.clear()
                Router.push("/auth/login")
            } catch (err) {
                toaster.error(err.message)
            }
        } else {
            try {
                const req = await pb.send('/api/auth/sso/toggle', { method: "POST" })
                pb.authStore.clear()
                Router.push("/auth/login")
            } catch (err) {
                toaster.error(err.message)
            }
        }

    }

    return (
        <>
            <div className="w-full h-[100dvh] bg-zinc-50 text-zinc-800 relative">
                <div class="absolute top-0 h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
                <div className="relative z-[2] w-full h-[100dvh] flex flex-col items-center justify-center px-5 ">
                    <Link onClick={() => Router.back()} className="absolute top-7 left-7 cursor-pointer">
                        <ArrowLeft className="w-6 h-6 text-zinc-600" />
                    </Link>
                    <div className="w-full max-w-[400px] flex-col">
                        <h1 className="mb-2 text-left">{disabling ? "Disable Email Auth" : "Enable Email Auth"}</h1>
                        <form tabIndex={1} onSubmit={handleDisable}>
                            {disabling ? (
                                <>
                                    <p className="font-semibold text-red-500 mt-6 mb-6 p-4 bg-red-100 rounded-xl">
                                        Important: If you choose to disable "Email Auth," you will no longer be able to use your email to log in with a code. This security feature enhances account protection by replacing traditional passwords. Feel free to reach out to our support team if you have any questions or need assistance. Thank you for your understanding as we work to maintain a secure environment for your account.
                                    </p>
                                    <Input name="passwordA" type="password" placeholder="New password" />
                                    <Input name="passwordB" type="password" placeholder="Confirm new password" />
                                    <SubmitButton type="submit">Confirm</SubmitButton>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold text-green-500 mt-6 mb-6 bg-green-100 p-4 rounded-xl">
                                        Enabling "Email Auth" will replace your current password with a secure email-based authentication system. This enhances account security by providing a unique code via email for access. If you have any questions, contact our support team. Thank you for prioritizing the security of your account.
                                    </p>
                                    <SubmitButton type="submit">Confirm</SubmitButton>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}