import { ModalTempLoader } from '@/lib/Modal';
import { PopCardDropMenuSection, PopCardDropMenuSectionItem, PopCardDropMenuSectionTitle, PopCardDropMenuStaticPos } from '@/lib/Pop-Cards/PopDropMenu';
import styles from '@/styles/Useroption.module.css'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const AccountSettings = dynamic(() => import("./user/AccountButtons"), {
    ssr: true,
});
const UserHelpModal = dynamic(() => import("./user/ThemePicker"), {
    ssr: true,
});
export default function UserOptions({ user, clss, usageOpenDefault }) {
    const [accountSettingsModal, setAccountSettingsModal] = useState(usageOpenDefault ? true : false)
    const [userHelpModal, setUserHelpModal] = useState(false)
    const [themePickerEvent, setThemePickerEvent] = useState(null)
    return (
        <>
            <div className={`${styles.container} ${clss}`}>
                <div className={styles.usricon}>
                    {user.avatar ? (
                        <img src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${user.id}/${user.avatar}?thumb=100x100`} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><path d="M10.25,13c0,0.69-0.56,1.25-1.25,1.25S7.75,13.69,7.75,13S8.31,11.75,9,11.75S10.25,12.31,10.25,13z M15,11.75 c-0.69,0-1.25,0.56-1.25,1.25s0.56,1.25,1.25,1.25s1.25-0.56,1.25-1.25S15.69,11.75,15,11.75z M22,12c0,5.52-4.48,10-10,10 S2,17.52,2,12S6.48,2,12,2S22,6.48,22,12z M20,12c0-0.78-0.12-1.53-0.33-2.24C18.97,9.91,18.25,10,17.5,10 c-3.13,0-5.92-1.44-7.76-3.69C8.69,8.87,6.6,10.88,4,11.86C4.01,11.9,4,11.95,4,12c0,4.41,3.59,8,8,8S20,16.41,20,12z" /></g></svg>)}

                </div>
                <div className={styles.email}>
                    <span>{user.email}</span>
                </div>
                <div className={styles.icons}>
                    <span className={styles.icon} onClick={(e) => setThemePickerEvent(e)}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24" /></g><g><g><g><g><path d="M12,22C6.49,22,2,17.51,2,12S6.49,2,12,2s10,4.04,10,9c0,3.31-2.69,6-6,6h-1.77c-0.28,0-0.5,0.22-0.5,0.5 c0,0.12,0.05,0.23,0.13,0.33c0.41,0.47,0.64,1.06,0.64,1.67C14.5,20.88,13.38,22,12,22z M12,4c-4.41,0-8,3.59-8,8s3.59,8,8,8 c0.28,0,0.5-0.22,0.5-0.5c0-0.16-0.08-0.28-0.14-0.35c-0.41-0.46-0.63-1.05-0.63-1.65c0-1.38,1.12-2.5,2.5-2.5H16 c2.21,0,4-1.79,4-4C20,7.14,16.41,4,12,4z" /><circle cx="6.5" cy="11.5" r="1.5" /><circle cx="9.5" cy="7.5" r="1.5" /><circle cx="14.5" cy="7.5" r="1.5" /><circle cx="17.5" cy="11.5" r="1.5" /></g></g></g></g></svg></span>
                    <span className={styles.icon} onClick={() => setAccountSettingsModal(true)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg></span>
                    <PopCardDropMenuStaticPos style={{ position: 'absolute', right: '0', bottom: '50px', zIndex: '5' }} event={themePickerEvent}>
                        <PopCardDropMenuSectionTitle>
                            Themes
                        </PopCardDropMenuSectionTitle>
                        <UserHelpModal />
                    </PopCardDropMenuStaticPos>
                </div>
            </div>
            {accountSettingsModal && (
                <AccountSettings usageOpenDefault={usageOpenDefault} Close={() => setAccountSettingsModal(false)} />
            )}
        </>
    )
}
