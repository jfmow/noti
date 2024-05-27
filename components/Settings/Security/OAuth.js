import { Button, useSettingsPopoverContext } from "@/components/Settings";
import { toaster } from "@/components/toast";
import { Github, Skull } from "lucide-react"
import { useEffect, useState } from "react";
export default function OAuth() {
    const [externalAuths, setExternalAuths] = useState([])
    const { pb } = useSettingsPopoverContext()
    useEffect(() => {
        async function getUsersExternalAuths() {
            const linkedProviders = await pb.collection('users').listExternalAuths(
                pb.authStore.model.id
            );
            setExternalAuths(linkedProviders)
        }

        getUsersExternalAuths()

    }, [])

    async function handleLinkProvider(provider) {
        if (!confirm("The email for the OAuth provider's account must match the one for this account or else the accounts will not link and a new account will be created!")) return

        pb.collection('users').authWithOAuth2({ provider: provider }).then(((successRes) => {
            window.location.reload()
        }), (failedRes) => {
            toaster.error(failedRes.message)
        });
    }
    async function handleUnLinkProvider(provider) {
        const confirmPopup = confirm("Are you sure?")
        if (confirmPopup) {
            try {
                await pb.send(`/api/collections/users/records/${pb.authStore.model.id}/external-auths/${provider}`, { method: "DELETE" })
                window.location.replace(`${window.location.pathname}?msg=${encodeURIComponent(`You just un-linked ${provider}! If you did not set a password/don't know your password, please use the password reset form on the login page.`)}`)
            } catch (err) {
                toaster.error(err.message)
            }
        }

    }
    return (
        <div className="grid p-1 gap-4">
            <div className="">
                <h3 className="text-sm w-full mb-1">OAuth</h3>
            </div>
            <div className="flex justify-between items-center">
                <div className="grid">
                    <span className="font-medium text-sm text-zinc-600 flex items-center"><Github className="w-4 h-4 mr-1" />Github</span>
                </div>
                {externalAuths.find((item) => item.provider === "github") ? (
                    <Button onClick={() => handleUnLinkProvider("github")}>
                        Un-link
                    </Button>
                ) : (
                    <Button onClick={() => handleLinkProvider("github")}>
                        Link
                    </Button>
                )}
            </div>

        </div>
    )
}