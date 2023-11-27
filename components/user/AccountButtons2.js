
import { useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';
import Router from 'next/router';
import AvatarModal from './AvatarModal';
import { toaster } from "@/components/toasty";
import { DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle } from '@/lib/Pop-Cards/DropDown';
import { Modal, ModalContent, ModalTrigger } from '@/lib/Modals/Modal';
import { useEditorContext } from '@/pages/page/[...id]';
import { updateListedPages } from '../Item';
import { Paragraph } from '../UX-Components';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function AccountButtons({ event }) {
    const { listedPageItems, setListedPageItems } = useEditorContext()
    const [totalUsage, setTotalUsage] = useState(0)
    const [usageLimit, setUsageLimit] = useState(10)
    const [itemLoading, setItemLoading] = useState([])


    useEffect(() => {
        getTotalUsage()
    }, [event])

    async function getTotalUsage() {
        let filesSize = 0
        let imagesSize = 0
        try {
            const record = await pb.collection('total_files_per_user').getOne(pb.authStore.model.id);
            filesSize = record.total_size;
            //console.log(filesSize)
        } catch { }
        try {
            const record = await pb.collection('Total_img_per_user').getOne(pb.authStore.model.id);
            imagesSize = record.total_size;
            //console.log(imagesSize)
        } catch { }
        setTotalUsage(Math.round(Math.max((filesSize + imagesSize) / 1000000)))
        try {
            const record = await pb.collection('user_flags').getFirstListItem(`user="${pb.authStore.model.id}"`, {
                skipTotal: true
            });
            setUsageLimit(record.quota / 1048576)
        } catch {

        }
    }

    async function authUpdate() {
        try {
            const authData = await pb.collection('users').authRefresh();
            if (pb.authStore.isValid == false) {
                pb.authStore.clear();
                return window.location.replace("/auth/login");
            }
            setIsLoading(false)
        } catch (error) {
            pb.authStore.clear();
            return window.location.replace('/auth/login');
        }
    }
    async function deleteAccount(e) {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete your account?')) {
            return
        }
        const toastA = toaster.toast('Deleting account...', "loading", { id: "deleteaccount" })

        try {
            await pb.collection('users').delete(pb.authStore.model.id)
            toaster.dismiss("deleteaccount")
            toaster.toast('Deleted account', "success")

            pb.authStore.clear();
            location.replace('/');
        } catch (error) {
            toaster.dismiss("deleteaccount")
            toaster.toast('Error while deleting account', "error")
            //console.log(error);
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
            //console.log(error)
            toaster.toast("Failed to request email change, please try again.", "error")
            return
        }
    }
    async function changeUsername() {
        const newUsername = prompt('Enter a new username', pb.authStore.model.username)
        if (newUsername.length <= 2) {
            return toaster.toast('Must be longer than 3 letters/numbers', "error");
        }
        const data = {
            "username": newUsername
        };
        await pb.collection('users').update(pb.authStore.model.id, data);
        toaster.toast(`Your username has been updated: ${newUsername}`, "success")
        return authUpdate();

    }
    return (
        <>
            <DropDownSectionTitle>
                Settings
            </DropDownSectionTitle>
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
                                Username: {pb.authStore.model.username}
                            </DropDownItem>
                            <DropDownItem>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-at-sign"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                                Email: {pb.authStore.model.email}
                            </DropDownItem>
                            <DropDownItem>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                Joined: {pb.authStore.model.created}
                            </DropDownItem>
                            <DropDownItem>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" /></svg>
                                UUID: {pb.authStore.model.id}
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
                                {totalUsage}MB
                            </DropDownItem>
                            <DropDownItem>
                                Limit: {usageLimit || '10'}MB
                            </DropDownItem>
                        </DropDownSection>
                    </DropDownExtension>
                </DropDownExtensionContainer>
            </DropDownSection>
            <DropDownSection>
                <Modal>
                    <ModalTrigger>
                        <DropDownItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                            Recover pages
                        </DropDownItem>
                    </ModalTrigger>
                    <ModalContent>
                        <h1>Deleted pages</h1>
                        <Paragraph>Recover your deleted pages here</Paragraph>
                        <div style={{ maxHeight: '50svh', overflowY: 'scroll', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {listedPageItems.filter(item => item.deleted).map((item) => (
                                <div style={{ display: 'grid', gridTemplateColumns: '9fr 1fr' }}>
                                    <div>
                                        <div aria-label='Page icon' style={{ display: 'flex' }}>
                                            {item.icon && item.icon.includes('.png') ? (<img width={18} src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}
                                        </div>
                                        {item.title || item.id}
                                    </div>
                                    <DropDownItem onClick={async () => {
                                        setItemLoading([...itemLoading, item.id])
                                        if (!itemLoading.includes(item.id)) {
                                            await pb.collection("pages").update(item.id, { deleted: false })
                                            setListedPageItems(updateListedPages(item.id, { deleted: false }, listedPageItems))
                                            setItemLoading([...itemLoading.filter(item2 => item2 !== item.id)])
                                        }
                                    }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg style={{ margin: 0 }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                    </DropDownItem>
                                </div>
                            )
                            )}
                        </div>
                    </ModalContent>
                </Modal>


            </DropDownSection>
            <DropDownSection>
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

