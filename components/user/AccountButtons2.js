import Router from 'next/router';
import { toaster } from "@/components/toast";
import { DropDownItem, DropDownSection, DropDownSectionTitle } from '@/lib/Pop-Cards/DropDown';
import { useEditorContext } from '@/pages/page/[...id]';
import AccountDetails from './AccountInfoSection';
import DeletedPagesManager from './DeletedPagesManager';
import EnableSSOItem from './EnableSSO';
export default function AccountButtons() {
    const { pb } = useEditorContext()


    async function deleteAccount(e) {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete your account?')) {
            return
        }
        const toastA = await toaster.loading('Deleting account...')

        try {
            await pb.collection('users').delete(pb.authStore.model.id)
            toaster.dismiss(toastA)
            toaster.toast('Deleted account', "success")
            pb.authStore.clear();
            window.location.replace('/');
        } catch (error) {
            toaster.dismiss(toastA)
            toaster.toast('Error while deleting account', "error")
        }
    }



    return (
        <>
            <DropDownSectionTitle>
                Settings
            </DropDownSectionTitle>
            <AccountDetails />
            <DeletedPagesManager />
            <DropDownSection>
                <EnableSSOItem />
                <DropDownItem onClick={(e) => deleteAccount(e)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-x-2"><path d="M14 19a6 6 0 0 0-12 0" /><circle cx="8" cy="9" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg>
                    Delete account
                </DropDownItem>
                <DropDownItem onClick={(e) => {
                    pb.authStore.clear()
                    Router.push('/')
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                    Logout
                </DropDownItem>
            </DropDownSection>

        </>

    )
}

