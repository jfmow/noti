import { useSettingsPopoverContext } from "@/components/Settings"
import { toaster } from "@/components/toast"
import { Button } from "@/components/UI"
import pb from "@/lib/pocketbase"
export default function Details() {
    const { rerenderPage } = useSettingsPopoverContext()

    function handleChangeUsername() {
        const currentUsername = pb.authStore.model.username
        const newusername = prompt("Enter a new username", currentUsername)
        /**Null if cancled, blank is just not allowed, current = no change */
        if (newusername === null || newusername === "" || newusername === currentUsername) {
            return
        }
        if (newusername.length < 3) {
            return toaster.error("A username must be longer than 3 charters")
        }

        const data = {
            "username": newusername
        };
        pb.collection('users').update(pb.authStore.model.id, data).then(((successRes) => {
            toaster.success(`Your username has been changed to ${successRes.username}`)
            pb.collection('users').authRefresh()
            rerenderPage()
        }));
    }


    function handleChangeEmail() {
        function isValidEmail(email) {
            // Regular expression for basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        const currentUsername = pb.authStore.model.email;
        const newemail = prompt("Enter a new email");

        // Null if canceled, blank is just not allowed, current = no change
        if (newemail === null || newemail === "" || newemail === currentUsername) {
            return;
        }
        // Validate the new email
        if (!isValidEmail(newemail)) {
            return toaster.error("Please enter a valid email address");
        }

        pb.collection('users').requestEmailChange(newemail).then((successRes) => {
            toaster.success(`An email change request has been emailed to ${newemail}`);
            pb.collection('users').authRefresh();
            rerenderPage();
        });
    }




    return (
        <div className="grid p-1 gap-4">
            <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleChangeEmail}>
                    Change email
                </Button>
                <Button onClick={handleChangeUsername}>
                    Change username
                </Button>
            </div>
            <div className="border-t pt-2">
                <h3 className="text-sm w-full">Information</h3>
            </div>
            <div className="flex justify-between items-center">
                <div className="grid">
                    <span className="font-medium text-xs text-zinc-600">Account created</span>
                    <span className="font-medium text-sm">{new Date(pb.authStore.model.created).toLocaleDateString()}</span>
                </div>
                <div className="grid">
                    <span className="font-medium text-xs text-zinc-600">Account id</span>
                    <span className="font-medium text-sm">{pb.authStore.model.id}</span>
                </div>
            </div>

        </div>
    )
}



