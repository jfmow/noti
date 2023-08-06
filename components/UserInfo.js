import { ModalTempLoader } from '@/lib/Modal';
import styles from '@/styles/Useroption.module.css'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const AccountSettings = dynamic(() => import("./user/AccountButtons"), {
    ssr: true,
});
const UserHelpModal = dynamic(() => import("./user/HelpModal"), {
    ssr: true,
});
export default function UserOptions({ user, clss, usageOpenDefault }) {
    const [accountSettingsModal, setAccountSettingsModal] = useState(usageOpenDefault ? true : false)
    const [userHelpModal, setUserHelpModal] = useState(false)
    return (
        <>
            <div className={`${styles.container} ${clss}`}>
                <div className={styles.usricon}>
                    {user.avatar ? (
                        <img src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${user.id}/${user.avatar}`} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><path d="M10.25,13c0,0.69-0.56,1.25-1.25,1.25S7.75,13.69,7.75,13S8.31,11.75,9,11.75S10.25,12.31,10.25,13z M15,11.75 c-0.69,0-1.25,0.56-1.25,1.25s0.56,1.25,1.25,1.25s1.25-0.56,1.25-1.25S15.69,11.75,15,11.75z M22,12c0,5.52-4.48,10-10,10 S2,17.52,2,12S6.48,2,12,2S22,6.48,22,12z M20,12c0-0.78-0.12-1.53-0.33-2.24C18.97,9.91,18.25,10,17.5,10 c-3.13,0-5.92-1.44-7.76-3.69C8.69,8.87,6.6,10.88,4,11.86C4.01,11.9,4,11.95,4,12c0,4.41,3.59,8,8,8S20,16.41,20,12z" /></g></svg>)}

                </div>
                <div className={styles.email}>
                    <span>{user.email}</span>
                </div>
                <div className={styles.icons}>
                    <span className={styles.icon} onClick={() => setUserHelpModal(true)}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><path d="M7.92,7.54C7.12,7.2,6.78,6.21,7.26,5.49C8.23,4.05,9.85,3,11.99,3c2.35,0,3.96,1.07,4.78,2.41c0.7,1.15,1.11,3.3,0.03,4.9 c-1.2,1.77-2.35,2.31-2.97,3.45c-0.15,0.27-0.24,0.49-0.3,0.94c-0.09,0.73-0.69,1.3-1.43,1.3c-0.87,0-1.58-0.75-1.48-1.62 c0.06-0.51,0.18-1.04,0.46-1.54c0.77-1.39,2.25-2.21,3.11-3.44c0.91-1.29,0.4-3.7-2.18-3.7c-1.17,0-1.93,0.61-2.4,1.34 C9.26,7.61,8.53,7.79,7.92,7.54z M14,20c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-1.1,0.9-2,2-2S14,18.9,14,20z" /></g></svg></span>
                    <span className={styles.icon} onClick={() => setAccountSettingsModal(true)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg></span>
                </div>

            </div>
            {accountSettingsModal && (
                <AccountSettings usageOpenDefault={usageOpenDefault} Close={() => setAccountSettingsModal(false)} />
            )}
            {userHelpModal && (
                <UserHelpModal CloseHelp={() => setUserHelpModal(false)} />
            )}
        </>
    )
}