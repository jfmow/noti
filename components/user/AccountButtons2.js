import { Modal, ModalButton, ModalLoader } from '@/lib/Modals/Modal';
import styles from '@/styles/Acc.module.css';
import { useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';
import { toast } from 'sonner';
import Head from 'next/head';
import Link from '@/components/Link';
import compressImage from '@/lib/CompressImg';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { PopDropMenuStatic, PopUpCardDropMenuSection, PopUpCardDropMenuSectionItem, PopUpCardDropMenuSectionTitle, PopUpCardDropMenuStaticPos } from '@/lib/Pop-Cards/PopDropMenu';
import AvatarModal from './AvatarModal';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function AccountButtons({ event, setpopUpClickEventSettingsModal }) {
    const [usageModal, setUsageModal] = useState(false)
    const [avatarModal, setAvatarModal] = useState(false)
    const [userInfoModal, setUserInfoModal] = useState(false)
    const [totalUsage, setTotalUsage] = useState(0)

    useEffect(() => {
        setUserInfoModal(false)
        getTotalUsage()
    }, [event])

    async function getTotalUsage() {
        let filesSize = 0
        let imagesSize = 0
        try {
            filesSize = await pb.collection('total_files_per_user').getOne(pb.authStore.model.id);
        } catch { }
        try {
            imagesSize = await pb.collection('Total_img_per_user').getOne(pb.authStore.model.id);
        } catch { }
        setTotalUsage((filesSize.total_size
            + imagesSize.total_size
        ) / 1000000)
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

        try {
            const response = await toast.promise(
                pb.collection('users').delete(pb.authStore.model.id),
                {
                    pending: 'Deleting account...',
                    success: 'Account deleted successfuly. 👌',
                    error: 'Failed to delete account 🤯'
                }
            );

            pb.authStore.clear();
            location.replace('/');
        } catch (error) {
            //console.log(error);
        }
    }

    async function ChangeEmail() {
        const newEmail = prompt('Enter a new email address', pb.authStore.model.email)
        try {
            await pb.collection('users').requestEmailChange(newEmail);
            toast('Email change request sent! 👍')
            return
        } catch (error) {
            //console.log(error)
            toast.error('Failed to send email change request!', {
                action: {
                    label: 'Retry',
                    onClick: () => ChangeEmail()
                },
            })
            return
        }
    }
    async function changeUsername() {
        const newUsername = prompt('Enter a new username', pb.authStore.model.username)

        if (newUsername.length <= 2) {
            return toast.error('Must be longer than 3 char');

        }
        const data = {
            "username": newUsername
        };
        await pb.collection('users').update(pb.authStore.model.id, data);
        toast.success(`Username updated to ${newUsername} 👍`)
        return authUpdate();

    }
    return (
        <>

            <Head>
                <title>Settings</title>
            </Head>

            <PopUpCardDropMenuStaticPos animationOrgin={'bottom right'} mobilepos={{
                bottom: `30px`,
                right: `20px`,
                width: `200px`,
                position: 'absolute',
                zIndex: '5',
            }} style={{ position: 'absolute', right: '0', bottom: '20px', zIndex: 999 }} event={event}>
                <PopUpCardDropMenuSectionTitle>
                    Settings
                </PopUpCardDropMenuSectionTitle>
                <PopUpCardDropMenuSection>
                    <div>
                        <PopUpCardDropMenuSectionItem onClick={() => setUserInfoModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-user"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><circle cx="12" cy="8" r="2" /><path d="M15 13a3 3 0 1 0-6 0" /></svg>
                            Account details
                        </PopUpCardDropMenuSectionItem>
                        {userInfoModal && (
                            <PopDropMenuStatic close={() => setUserInfoModal(false)} style={{ width: '200px', minHeight: '100px', position: 'absolute', zIndex: '999', right: `-210px`, top: '-90px' }} >
                                <PopUpCardDropMenuSectionTitle>
                                    Details
                                </PopUpCardDropMenuSectionTitle>
                                <PopUpCardDropMenuSection>
                                    <PopUpCardDropMenuSectionItem>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-form-input"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
                                        Username: {pb.authStore.model.username}
                                    </PopUpCardDropMenuSectionItem>
                                    <PopUpCardDropMenuSectionItem>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-at-sign"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                                        Email: {pb.authStore.model.email}
                                    </PopUpCardDropMenuSectionItem>
                                    <PopUpCardDropMenuSectionItem>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        Joined: {pb.authStore.model.created}
                                    </PopUpCardDropMenuSectionItem>
                                    <PopUpCardDropMenuSectionItem>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" /></svg>
                                        UUID: {pb.authStore.model.id}
                                    </PopUpCardDropMenuSectionItem>
                                </PopUpCardDropMenuSection>
                                <PopUpCardDropMenuSection>
                                    <PopUpCardDropMenuSectionItem onClick={() => ChangeEmail()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-at-sign"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                                        Update email
                                    </PopUpCardDropMenuSectionItem>
                                    <PopUpCardDropMenuSectionItem onClick={() => changeUsername()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-form-input"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
                                        Update username
                                    </PopUpCardDropMenuSectionItem>
                                </PopUpCardDropMenuSection>
                            </PopDropMenuStatic>
                        )}
                    </div>
                    <PopUpCardDropMenuSectionItem onClick={() => setAvatarModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>
                        Avatar
                    </PopUpCardDropMenuSectionItem>
                    <div>
                        <PopUpCardDropMenuSectionItem onClick={() => setUsageModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pie-chart"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
                            Usage
                        </PopUpCardDropMenuSectionItem>
                        {usageModal && (
                            <PopDropMenuStatic close={() => setUsageModal(false)} style={{ width: '200px', minHeight: '100px', position: 'absolute', zIndex: '999', right: `-210px`, top: '-0px' }}>
                                <PopUpCardDropMenuSectionTitle>
                                    Usage
                                </PopUpCardDropMenuSectionTitle>
                                <PopUpCardDropMenuSection>
                                    <PopUpCardDropMenuSectionItem>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
                                        {totalUsage}MB
                                    </PopUpCardDropMenuSectionItem>
                                </PopUpCardDropMenuSection>
                            </PopDropMenuStatic>
                        )}
                    </div>
                </PopUpCardDropMenuSection>
                <PopUpCardDropMenuSection>
                    <PopUpCardDropMenuSectionItem onClick={(e) => deleteAccount(e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-x-2"><path d="M14 19a6 6 0 0 0-12 0" /><circle cx="8" cy="9" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg>
                        Delete account
                    </PopUpCardDropMenuSectionItem>
                    <PopUpCardDropMenuSectionItem onClick={(e) => {
                        pb.authStore.clear()
                        Router.push('/')
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        Logout
                    </PopUpCardDropMenuSectionItem>
                </PopUpCardDropMenuSection>
            </PopUpCardDropMenuStaticPos>
            <>
                {/**
             * Modals
             */}

                {avatarModal && <AvatarModal close={() => setAvatarModal(false)} pb={pb} />}

            </>

        </>

    )
}

