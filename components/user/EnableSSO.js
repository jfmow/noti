import { Gap, Modal, ModalContent, ModalTrigger } from "@/lib/Modals/Modal";
import { DropDownItem } from "@/lib/Pop-Cards/DropDown";
import { Input, Paragraph, SubmitButton } from "../UX-Components";
import { useEditorContext } from "@/pages/page/[...id]";
import { useEffect, useState } from "react";
import { toaster } from "@/components/toast";

export default function EnableSSOItem() {
    const { pb } = useEditorContext()
    const [ssoState, setSSOState] = useState(false)
    const [newPassword, setNewPassword] = useState({ newPass: '', confNewPass: '', required: false })
    useEffect(() => {
        async function CheckSSOState() {
            try {
                const record = await pb.collection('user_flags').getFirstListItem(`user="${pb.authStore.model.id}"`);
                setSSOState(record.sso)
            } catch {

            }
        }
        CheckSSOState()
    }, [pb])
    async function ToggleSSO(reqNewPassword) {
        const loadingToast = await toaster.loading(ssoState ? 'Disabling sso' : 'Enabling sso')
        if (reqNewPassword && (!newPassword.newPass || !newPassword.confNewPass)) {
            return toaster.info('Please fill out all displayed fields')
        }
        try {
            const state = await pb.send(reqNewPassword ? `/api/auth/sso/toggle?np=${newPassword.newPass}` : `/api/auth/sso/toggle`, { method: 'POST' })
            setSSOState(!ssoState)
            toaster.dismiss(loadingToast)
        } catch (err) {
            console.log(err.data)
            if (err.data.message === "You must set a password before disabling SSO.") {
                setNewPassword({ ...newPassword, required: true })
            }
            toaster.dismiss(loadingToast)
            toaster.error(err.data.message)
        }

    }
    return (
        <Modal>
            {ssoState ? (
                <>
                    <ModalTrigger>
                        <DropDownItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-square"><path d="M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z" /><path d="m14 7 3 3" /><path d="M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4" /></svg>
                            Disable SSO
                        </DropDownItem>
                    </ModalTrigger>
                    <ModalContent>
                        {newPassword.required ? (
                            <>
                                <form onSubmit={(e) => { e.preventDefault(); ToggleSSO(true); }}>
                                    <Input autocomplete='new-password' placeholder='New password' type='password' required onChange={(e) => setNewPassword({ ...newPassword, newPass: e.target.value })} />
                                    <Input autocomplete='new-password' placeholder='Confirm new password' type='password' required onChange={(e) => setNewPassword({ ...newPassword, confNewPass: e.target.value })} />
                                    <SubmitButton type='submit'>Disable</SubmitButton>

                                </form>
                            </>
                        ) : (
                            <SubmitButton onClick={() => ToggleSSO()}>Disable</SubmitButton>
                        )}

                    </ModalContent>
                </>
            ) : (
                <>
                    <ModalTrigger>
                        <DropDownItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-square"><path d="M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z" /><path d="m14 7 3 3" /><path d="M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4" /></svg>
                            Enable SSO
                        </DropDownItem>
                    </ModalTrigger>
                    <ModalContent>
                        <h1>✨ Say goodbye to passwords!</h1>
                        <Gap>10</Gap>
                        <Paragraph>
                            🌟 Upgrade your login experience! Enable Single Sign-On (SSO) for password-free access using just your email, with the convenience of magic links or codes. Effortless, secure, and compatible with OAuth providers like GitHub. 🚀
                        </Paragraph>
                        <Gap>20</Gap>
                        <SubmitButton onClick={() => ToggleSSO()}>Enable</SubmitButton>
                    </ModalContent>
                </>
            )}
        </Modal>
    )
}