import Head from "next/head";
import { Link } from "../UX-Components";
import { Loader2 } from "lucide-react";

export default function LoginPage({ method, classname, children }) {
    return (

        <>
            <Head>
                <title>{method}</title>
            </Head>
            <div className={`w-full h-[100dvh] bg-zinc-50 text-zinc-800 relative ${classname}`}>
                <div class="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="relative z-[2] w-full h-[100dvh] flex flex-col items-center justify-center">
                    <div className="flex flex-col w-[400px] max-w-[80%]">
                        <div className="flex flex-col items-center mb-4 border-b pb-2">
                            <h1 className="font-bold md:text-6xl pb-3">{method}</h1>
                            <div className="flex items-center justify-center gap-4">
                                <Link href="/auth/terms-and-conditions" className="underline">Terms and Conditions</Link>
                                <Link href="/auth/privacy-policy" className="underline">Privacy Policy</Link>

                            </div>
                        </div>
                        {children}
                        <Link href={`/auth/${method.toLowerCase() === "login" ? "signup" : ""}${method.toLowerCase() === "signup" ? "login" : ""}`} className="text-sm underline text-right w-full mt-4">{method === "Login" || method === "login" ? "Sign up" : null}{method === "signup" || method === "Signup" ? "Login" : null}</Link>
                    </div>
                </div>

            </div>
        </>
    )
}

export function LoginInput({ ...props }) {
    return (
        <input {...props} className="bg-zinc-50 text-zinc-600 border border-zinc-100 rounded-xl p-3 w-full outline-none my-2 sm:text-sm min-h-[46px] readonly:opacity-50 readonly:border-zinc-400 disabled:cursor-not-allowed" />
    )
}

export function LoginButton({ ...props }) {
    return (
        <button {...props} disabled={props.loading} className="w-full bg-zinc-100 border font-semibold p-3 rounded-xl flex items-center justify-center min-h-[50px]">
            {props.loading ? (
                <Loader2 className="mr-1 h-[16px] w-[16px] animate-spin" />
            ) : (
                <>
                    {props.children}
                </>
            )
            }
        </button >
    )
}