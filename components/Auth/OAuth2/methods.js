import { toaster } from "@/components/toast";
import Router from "next/router";
import PocketBase from 'pocketbase'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
import { Github } from "lucide-react"
pb.autoCancellation(false)
export default function OAuth2LoginButtons() {

    async function OAuthLogin(provider) {
        const loadingToast = await toaster.loading('Working...')
        try {
            await pb.collection('users').authWithOAuth2({ provider: provider })
            Router.push('/page')
            toaster.dismiss(loadingToast)

        } catch (err) {
            toaster.update(loadingToast, "A problem has occured logging in.", "error")
        }
    }

    return (
        <div className="mt-2 grid gap-0 w-full">
            <button className="m-1 flex w-full min-h-[37px] rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 items-center justify-center gap-1 px-3 py-2 font-semibold text-sm text-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all duration-300" onClick={() => OAuthLogin("github")}>
                <Github className="w-5 h-5" />
                Github
            </button>
        </div>
    )
}