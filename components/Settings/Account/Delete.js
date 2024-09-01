import { Button } from "@/components/UI"
import { toaster } from "@/components/toast"
import pb from "@/lib/pocketbase"
export default function DeleteAccount() {

    async function handleDeleteAccount() {
        const confirmPropmt = prompt("Please type DELETE to confirm")
        if (confirmPropmt === "DELETE") {
            const toastA = await toaster.loading('Deleting account...')

            try {
                await pb.collection('users').delete(pb.authStore.model.id)
                toaster.update(toastA, 'Deleted account', "success")
                pb.authStore.clear();
                setTimeout(() => {
                    window.location.replace('/');
                }, 1500);
            } catch (error) {
                toaster.toast(toastA, 'A problem occured while deleting your account.', "error")
            }
        } else {
            toaster.info("Canceled")
        }
    }

    return (
        <div className="grid p-1 gap-4">
            <div className="border-t pt-2">
                <h3 className="text-sm w-full">Delete account</h3>
            </div>
            <div className="flex justify-between items-center">
                <div className="grid">
                    <span className="font-bold text-sm text-red-600 underline">This action cannot be undone!</span>
                </div>
                <Button onClick={handleDeleteAccount}>
                    Delete
                </Button>
            </div>
        </div>
    )
}



