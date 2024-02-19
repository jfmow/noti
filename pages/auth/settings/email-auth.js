import Loader from "@/components/Loader";
import Head from "next/head";
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase'
import { toaster } from "@/components/toast";
import { Link, SubmitButton } from "@/components/UX-Components";
import Router from "next/router";
import { Modal, ModalContent } from "@/lib/Modals/Modal";
import { Clipboard, ClipboardCheck } from "lucide-react";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)
export default function ToggleEmailAuth() {
    const [emailAuthState, setEmailAuthState] = useState("loading")
    useEffect(() => {
        async function GetAccountFlags() {
            try {
                if (pb.authStore.isValid && await pb.collection("users").authRefresh()) {
                    const record = await pb.collection("user_flags").getFirstListItem(`user = "${pb.authStore.model.id}" && collection = "${pb.authStore.model.collectionId}"`)
                    setEmailAuthState(record.sso)
                } else {
                    window.location.replace("/auth/login")
                }
            } catch {
                window.location.replace("/auth/login")
            }

        }
        GetAccountFlags()
    }, [])

    if (emailAuthState === "loading") {
        return <Loader />
    }

    return (
        <>
            <Head>
                <title>Email auth</title>
            </Head>

            <div className="relative w-full h-[100dvh] bg-zinc-50"><div class="absolute z-[1] h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                {emailAuthState ? (
                    <Disable />
                ) : (
                    <Enable />
                )}
            </div >
        </>
    )
}

function Enable() {
    async function EnableAuth(e) {
        e.preventDefault()
        try {
            await pb.send("/api/collections/users/auth-with-sso/toggle", { method: "POST" })
            Router.push("/auth/login")
        } catch {
            toaster.error("Failed to enable sso")
        }
    }

    return (
        <>
            <div className="z-[2] relative w-full h-[100dvh] max-h-full inline-flex items-center justify-center text-zinc-800">
                <div className="w-[400px] max-w-[80%] flex-col items-center flex">
                    <p className="bg-green-300 rounded-xl p-4 text-green-600 mb-2">
                        <span className="font-semibold">Enable email auth</span>
                        <br />
                        Enabling email token authentication enhances security by adding an additional layer of verification, mitigating the risk of unauthorized access to sensitive information or accounts.
                        <br />
                        <span className="font-semibold">Your current password will also be removed.</span>
                    </p>
                    <SubmitButton onClick={EnableAuth}>Enable</SubmitButton>
                    <Link href="/page/firstopen" className="mt-4">Back</Link>
                </div>
            </div>
        </>
    )
}
function Disable() {
    const [newPassword, setNewPassword] = useState("")
    const [coppied, setCoppied] = useState(false)
    async function EnableAuth(e) {
        e.preventDefault()
        try {
            const req = await pb.send("/api/collections/users/auth-with-sso/toggle", { method: "POST" })
            if (req?.password != "") {
                setNewPassword(req.password)
            } else {
                Router.push("/auth/login")
            }

        } catch {
            toaster.error("Failed to enable sso")
        }
    }

    async function CopyText(e) {
        e.preventDefault()
        navigator.clipboard.writeText(newPassword)
        setCoppied(true)
        setTimeout(() => {
            setCoppied(false)
        }, 1000);
    }

    return (
        <>
            <div className="z-[2] relative w-full h-[100dvh] max-h-full inline-flex items-center justify-center text-zinc-800">
                <div className="w-[400px] max-w-[80%] flex-col items-center flex">
                    <p className="bg-red-300 rounded-xl p-4 text-red-600 mb-2">
                        <span className="font-semibold">Disable email auth</span>
                        <br />
                        Email auth enhances security by adding an additional layer of verification, mitigating the risk of unauthorized access to sensitive information or accounts.
                    </p>
                    <SubmitButton onClick={EnableAuth}>Disable</SubmitButton>
                    <Link href="/page/firstopen" className="mt-4">Back</Link>
                </div>
                {newPassword ? (
                    <Modal visibleDef>
                        <ModalContent>
                            <h1 className="text-3xl text-red-800 mb-2">Account password</h1>
                            <p className="font-semibold text-red-500 mb-4">This is the new password to your account. It is only visible now, so please copy it and save it somewhere.</p>
                            <div className="grid w-full grid-cols-[1fr_40px] bg-zinc-100 p-3 rounded-xl items-center border">
                                {newPassword}
                                <div onClick={CopyText} className="w-full h-full flex items-center justify-center cursor-pointer border-l pl-2">
                                    {coppied ? (
                                        <ClipboardCheck className="w-5 h-5" />
                                    ) : (
                                        <Clipboard className="w-5 h-5 " />
                                    )}
                                </div>
                            </div>
                            <SubmitButton onClick={() => Router.push("/auth/login")}>Done</SubmitButton>
                        </ModalContent>
                    </Modal>
                ) : null}

            </div>
        </>
    )
}