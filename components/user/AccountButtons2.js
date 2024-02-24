import Router from 'next/router';
import { DropDownItem, DropDownSection, DropDownSectionTitle } from '@/lib/Pop-Cards/DropDown';
import { useEditorContext } from '@/pages/page';
import AccountDetails from './AccountInfoSection';
import SecuritySettings from './SecuritySettings';
export default function AccountButtons() {
    const { pb, showArchivedPages, setShowArchivedPages } = useEditorContext()
    return (
        <>
            <DropDownSectionTitle>
                Settings
            </DropDownSectionTitle>
            <AccountDetails />

            <DropDownSection>
                <SecuritySettings />
                <DropDownItem onClick={() => setShowArchivedPages(prev => !prev)}>
                    {showArchivedPages ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-open"><path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z" /><path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z" /><line x1="12" x2="12" y1="22" y2="13" /><path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5" /></svg>
                            Hide archived pages
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>
                            Show archived pages
                        </>
                    )}
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

