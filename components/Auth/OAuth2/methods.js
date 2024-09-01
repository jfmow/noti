import { toaster } from "@/components/toast";
import Router from "next/router";
import pb from "@/lib/pocketbase"
import { Github } from "lucide-react"
import { Button } from "@/components/UI";
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
            <Button className="w-full" filled onClick={() => OAuthLogin("github")}>
                <Github className="w-5 h-5" />
                Github
            </Button>
        </div>
    )
}