
import { useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';
import Router from 'next/router';
import AvatarModal from './AvatarModal';
import { toaster } from "@/components/toasty";
import { DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle } from '@/lib/Pop-Cards/DropDown';
import { Modal } from '@/lib/Modals/Modal';
import { Link, Paragraph, SubmitButton, ToggleSwitch } from '../UX-Components';
import { EncryptionEnabled, PageEncryption } from '@/lib/Encryption';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function AccountButtons({ event }) {
    const [usageModal, setUsageModal] = useState(false)
    const [avatarModal, setAvatarModal] = useState(false)
    const [userInfoModal, setUserInfoModal] = useState(false)
    const [totalUsage, setTotalUsage] = useState(0)
    const [usageLimit, setUsageLimit] = useState(10)
    const [flagsModal, setFlagsModal] = useState(false)

    useEffect(() => {
        setUserInfoModal(false)
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


    async function handleToggleEncryption(e) {
        if (e.target.checked) {
            const prevFlags = window.localStorage.getItem('flags')
            window.localStorage.setItem('flags', JSON.stringify({ ...JSON.parse(prevFlags), encryption: true }))
            const testMsg = 'Test abc'
            const keyPair = await PageEncryption.generateKeyPair()
            //console.log(keyPair.publicKey, keyPair.privateKey)
            const exportedPublicKey = await PageEncryption.exportPublicKey(keyPair.publicKey)
            const exportedPrivateKey = await PageEncryption.exportPrivateKey(keyPair.privateKey)
            const importedPublicKey = await PageEncryption.importPublicKey(exportedPublicKey)
            const importedPrivateKey = await PageEncryption.importPrivateKey(exportedPrivateKey)
            //console.log(imprt)
            const encrypted = await PageEncryption.encrypt(testMsg, importedPublicKey)
            //console.log(encrypted)
            const decrypted = await PageEncryption.decrypt(encrypted, importedPrivateKey)
            console.log(decrypted)
            if (testMsg === decrypted && encrypted) {
                if (window.localStorage.getItem('encryption')) {
                    const continueA = confirm('You already have encryption keys stored. Do you wish to overide them?')
                    if (continueA) {
                        window.localStorage.setItem('encryption', JSON.stringify({ publickey: exportedPublicKey, privateKey: exportedPrivateKey }))
                    }
                }
                toaster.success('Page encryption is now enabled!\nPlease read the docs.')
            }
        } else {
            const continueE = confirm('Warning! All pages that are still encrypted will be unable to be decrypted! Are you sure you want to continue?')
            if (continueE) {
                const prevFlags = window.localStorage.getItem('flags')
                window.localStorage.setItem('flags', JSON.stringify({ ...JSON.parse(prevFlags), encryption: false }))
                toaster.success('Encryption disabled')
            }

        }

        return
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
                <DropDownItem onClick={() => setAvatarModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>
                    Avatar
                </DropDownItem>
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
                <DropDownItem onClick={() => setFlagsModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></svg>
                    Flags
                </DropDownItem>
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

            <>
                {/**
             * Modals
             */}

                {avatarModal && <AvatarModal close={() => setAvatarModal(false)} pb={pb} />}
                {flagsModal && (
                    <>
                        <Modal close={() => setFlagsModal(false)}>
                            <h1>Feature flags</h1>
                            <Paragraph style={{ fontSize: '14px', lineHeight: '18px', opacity: 0.7 }}>
                                All features (flags) within this system are considered highly experimental. Users are advised to exercise utmost caution when utilizing these features, as they may exhibit instability and potentially result in unintended data loss.
                            </Paragraph>
                            <ToggleSwitch enabled={EncryptionEnabled()} onChange={(e) => handleToggleEncryption(e)}>
                                On device encryption
                            </ToggleSwitch>
                            {EncryptionEnabled() && (
                                <Link style={{ cursor: 'pointer', marginTop: '12px' }} onClick={() => {
                                    // Retrieve data from localStorage
                                    const encryptedKeysString = localStorage.getItem('encryption');

                                    // Check if data exists
                                    if (!encryptedKeysString) {
                                        console.error('No data found in localStorage');
                                        return;
                                    }

                                    // Parse the JSON data
                                    const encryptedKeys = JSON.parse(encryptedKeysString);

                                    // Create a Blob containing the JSON data
                                    const blob = new Blob([JSON.stringify(encryptedKeys, null, 2)], { type: 'application/json' });

                                    // Create a link element
                                    const link = document.createElement('a');

                                    // Set the download attribute and file name
                                    link.download = 'keys.json';

                                    // Create a URL for the Blob and set it as the href attribute
                                    link.href = window.URL.createObjectURL(blob);

                                    // Append the link to the document
                                    document.body.appendChild(link);

                                    // Trigger a click on the link to initiate the download
                                    link.click();

                                    // Remove the link from the document
                                    document.body.removeChild(link);

                                }}>Download keys</Link>
                            )}
                            <SubmitButton onClick={() => Router.push('/docs/flags')}>Docs</SubmitButton>
                        </Modal>
                    </>
                )}

            </>

        </>

    )
}