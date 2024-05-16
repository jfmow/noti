import Head from "next/head";
import Link from "../Link";
import { Loader2 } from "lucide-react";

export default function LoginPage({ method, classname, children }) {
    return (

        <>
            <Head>
                <title>{method}</title>
            </Head>
            <div className={`w-full h-[100dvh] bg-zinc-50 text-zinc-800 dark:text-zinc-300 dark:bg-zinc-800 relative ${classname}`}>
                <div class="absolute h-full w-full bg-[radial-gradient(#e6bded_1px,transparent_1px)] dark:bg-[radial-gradient(#6f4b75_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="relative z-[2] w-full h-[100dvh] flex flex-col items-center justify-center">
                    <div className="flex flex-col w-[300px] max-w-[80%]">
                        <div className="flex flex-col items-center mb-2 border-b pb-2">
                            <h1 className="font-bold md:text-6xl pb-3">{method}</h1>
                            <div className="text-sm flex items-center justify-center gap-4">
                                <Link href="/auth/terms-and-conditions" className="underline">Terms and Conditions</Link>
                                <Link href="/auth/privacy-policy" className="underline">Privacy Policy</Link>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>

            </div>
        </>
    )
}

export function LoginInput({ ...props }) {
    return (
        <input {...props} className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-700 rounded-xl p-3 w-full outline-none my-2 text-[16px] sm:text-sm min-h-[46px] readonly:opacity-50 readonly:border-zinc-400 disabled:cursor-not-allowed" />
    )
}

export function LoginButton({ ...props }) {
    return (
        <button {...props} disabled={props.loading} className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-semibold p-3 rounded-xl flex items-center justify-center min-h-[50px]">
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

export function LoginMessage({ ...props }) {
    return (
        <div className="w-full mt-4 bg-gray-100 text-gray-400 dark:bg-gray-400 dark:text-gray-700 text-xs p-3 rounded-lg">
            {props.children}
        </div>
    )
}

export function LoginShortcutLink({ ...props }) {
    if (props.href && props.href != "") {
        return (
            <Link href={props.href} className="text-xs text-gray-600 dark:text-gray-300 underline text-right w-fit">{props.children}</Link>
        )
    }
    return (
        <span className="text-xs text-gray-500 dark:text-gray-300 text-left w-fit">{props.children}</span>
    )

}