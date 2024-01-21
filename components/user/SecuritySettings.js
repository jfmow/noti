import { Gap, Modal, ModalContent, ModalTrigger } from "@/lib/Modals/Modal";
import { DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle } from "@/lib/Pop-Cards/DropDown";
import { Input, Paragraph, SubmitButton } from "../UX-Components";
import { useEditorContext } from "@/pages/page/[...id]";
import { useEffect, useState } from "react";
import { toaster } from "@/components/toast";

export default function SecuritySettings() {
    const { pb } = useEditorContext()
    const [ssoState, setSSOState] = useState(false)
    const [newPassword, setNewPassword] = useState({ newPass: '', confNewPass: '', required: false })
    useEffect(() => {
        async function CheckSSOState() {
            try {
                //Get all the users profile flags from the db
                const record = await pb.collection('user_flags').getFirstListItem(`user="${pb.authStore.model.id}"`);
                setSSOState(record.sso)
            } catch { }
        }
        CheckSSOState()
    }, [pb])
    async function ToggleSSO(reqNewPassword) {
        const loadingToast = await toaster.loading(ssoState ? 'Disabling Email Auth' : 'Enabling Email Auth')
        if (reqNewPassword && (!newPassword.newPass || !newPassword.confNewPass)) {
            return toaster.info('Please fill out all displayed fields')
        }
        try {
            const state = await pb.send(reqNewPassword ? `/api/auth/sso/toggle?np=${newPassword.newPass}` : `/api/auth/sso/toggle`, { method: 'POST' })
            setSSOState(!ssoState)
            toaster.update(loadingToast, ssoState ? 'Email Auth disabled' : 'Email Auth enabled', "info")
        } catch (err) {
            console.log(err.data)
            if (err.data.message === "You must set a password before disabling Email Auth.") {
                setNewPassword({ ...newPassword, required: true })
            }
            toaster.update(loadingToast, err.data.message, "error")
        }

    }

    async function deleteAccount(e) {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete your account?')) {
            return
        }
        const toastA = await toaster.loading('Deleting account...')

        try {
            await pb.collection('users').delete(pb.authStore.model.id)
            toaster.update(toastA, 'Deleted account', "success")
            pb.authStore.clear();
            window.location.replace('/');
        } catch (error) {
            toaster.toast(toastA, 'Error while deleting account', "error")
        }
    }
    return (
        <>
            <DropDownExtensionContainer>
                <DropDownExtensionTrigger>
                    <DropDownItem>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" /></svg>
                        Security
                    </DropDownItem>
                </DropDownExtensionTrigger>
                <DropDownExtension>
                    <DropDownSectionTitle>
                        Security
                    </DropDownSectionTitle>
                    <DropDownSection>
                        <Modal>
                            {ssoState ? (
                                <>
                                    <ModalTrigger>
                                        <DropDownItem>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-square"><path d="M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z" /><path d="m14 7 3 3" /><path d="M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4" /></svg>
                                            Disable Email Auth
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
                        <DropDownItem onClick={(e) => deleteAccount(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-x-2"><path d="M14 19a6 6 0 0 0-12 0" /><circle cx="8" cy="9" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg>
                            Delete account
                        </DropDownItem>
                    </DropDownSection>
                </DropDownExtension>
            </DropDownExtensionContainer>

        </>
    )
}