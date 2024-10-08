import Avatar from "@/components/Settings/Account/Avatar"
import { useSettingsPopoverContext } from "@/components/Settings"
import Details from "@/components/Settings/Account/Details"
import Pages from "@/components/Settings/Account/Pages"
import DeleteAccount from "@/components/Settings/Account/Delete"
import { Button } from "@/components/UI"
import pb from "@/lib/pocketbase"

export default function AccountTab() {

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4">
            <div className="border-b pb-2">
                <h3 className="text-md w-full mb-1">Account</h3>
                <p className="text-sm text-gray-500">Customise your accounts look and update your details.</p>
            </div>
            <div className="flex gap-2 items-center">
                <Avatar />
                <div className="flex flex-col">
                    <p className="text-xs">{pb.authStore.model.username}</p>
                    <p className="underline text-sm font-medium">{pb.authStore.model.email}</p>
                </div>
            </div>
            <Details />
            <Pages />
            <DeleteAccount />
            <Button onClick={() => { pb.authStore.clear(); window.location.replace("/") }}>Logout</Button>
        </div>
    )
}