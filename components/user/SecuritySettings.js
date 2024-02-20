import { DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle } from "@/lib/Pop-Cards/DropDown";
import { useEditorContext } from "@/pages/page/[...id]";
import { toaster } from "@/components/toast";
import { Github } from "lucide-react";
import Router from "next/router";

export default function SecuritySettings() {
    const { pb } = useEditorContext()

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
                        <DropDownItem onClick={() => Router.push("/auth/settings/oauth-providers")}>
                            <Github />
                            OAuth providers
                        </DropDownItem>
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