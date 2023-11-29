import { useState, useEffect } from 'react';
import AvatarModal from './AvatarModal';
import { DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle } from '@/lib/Pop-Cards/DropDown';
import { useEditorContext } from '@/pages/page/[...id]';
export default function AccountDetails() {
    const { pb } = useEditorContext()
    const [totalUsage, setTotalUsage] = useState(0)
    const [usageLimit, setUsageLimit] = useState(10)


    useEffect(() => {
        getTotalUsage()
    }, [])

    async function getTotalUsage() {
        try {
            const getTotalSize = async (collectionName) => {
                try {
                    const record = await pb.collection(collectionName).getOne(pb.authStore.model.id);
                    return record ? record.total_size : 0;
                } catch { return 0 }
            };

            const totalSize = await Promise.all([
                getTotalSize('total_files_per_user'),
                getTotalSize('Total_img_per_user'),
            ]).then(sizes => sizes.reduce((acc, size) => acc + size, 0));

            setTotalUsage(Math.round(totalSize / 1000000));

            const userFlagsRecord = await pb.collection('user_flags').getFirstListItem(`user="${pb.authStore.model.id}"`, {
                skipTotal: true
            });

            if (userFlagsRecord) {
                setUsageLimit(userFlagsRecord.quota / 1048576);
            }
        } catch {
            // Handle errors if needed
        }
    }

    async function ChangeEmail() {
        const newEmail = prompt('Enter a new email address', pb.authStore.model.email)
        try {
            await pb.collection('users').requestEmailChange(newEmail);
            toast('Email change request sent! 👍')
            toaster.toast("Please check your email (new) for a request form.", "success")
            return
        } catch (error) {
            toaster.toast("Failed to request email change, please try again.", "error")
            return
        }
    }
    async function changeUsername() {
        try {
            const newUsername = prompt('Enter a new username', pb.authStore.model.username)
            if (newUsername.length <= 2) {
                return toaster.toast('Must be longer than 3 letters/numbers', "error");
            }
            const data = {
                "username": newUsername
            };
            await pb.collection('users').update(pb.authStore.model.id, data);
            toaster.toast(`Your username has been updated: ${newUsername}`, "success")
            await pb.collection('users').authRefresh()
        } catch {

        }
    }
    return (
        <DropDownSection>
            <DropDownExtensionContainer>
                <DropDownExtensionTrigger>
                    <DropDownItem>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-user"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><circle cx="12" cy="8" r="2" /><path d="M15 13a3 3 0 1 0-6 0" /></svg>
                        Account details
                    </DropDownItem>
                </DropDownExtensionTrigger>
                <DropDownExtension>
                    <DropDownSectionTitle>
                        Details
                    </DropDownSectionTitle>
                    <DropDownSection>
                        <DropDownItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-form-input"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
                            Username: {pb.authStore?.model?.username}
                        </DropDownItem>
                        <DropDownItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-at-sign"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                            Email: {pb.authStore?.model?.email}
                        </DropDownItem>
                        <DropDownItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            Joined: {pb.authStore?.model?.created}
                        </DropDownItem>
                        <DropDownItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" /></svg>
                            UUID: {pb.authStore?.model?.id}
                        </DropDownItem>
                    </DropDownSection>
                    <DropDownSection>
                        <DropDownItem onClick={() => ChangeEmail()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-at-sign"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                            Update email
                        </DropDownItem>
                        <DropDownItem onClick={() => changeUsername()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-form-input"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
                            Update username
                        </DropDownItem>
                    </DropDownSection>
                </DropDownExtension>
            </DropDownExtensionContainer>
            <AvatarModal pb={pb} />
            <DropDownExtensionContainer>
                <DropDownExtensionTrigger hover>
                    <DropDownItem>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pie-chart"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
                        Usage
                    </DropDownItem>
                </DropDownExtensionTrigger>
                <DropDownExtension>
                    <DropDownSectionTitle>
                        Usage
                    </DropDownSectionTitle>
                    <DropDownSection>
                        <DropDownItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
                            {totalUsage === 'loading' ? ('loading...') : (
                                <>
                                    {totalUsage}MB
                                </>
                            )}
                        </DropDownItem>
                        <DropDownItem>
                            Limit: {usageLimit || '10'}MB
                        </DropDownItem>
                    </DropDownSection>
                </DropDownExtension>
            </DropDownExtensionContainer>
        </DropDownSection>
    )
}