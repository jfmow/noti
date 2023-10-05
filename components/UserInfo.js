import { ModalTempLoader } from '@/lib/Modal';
import { PopUpCardDropMenuSection, PopUpCardDropMenuSectionItem, PopUpCardDropMenuSectionTitle, PopUpCardDropMenuStaticPos } from '@/lib/Pop-Cards/PopDropMenu';
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>)}

                </div>
                <div className={styles.email}>
                    <span>{user.email}</span>
                </div>
                <div className={styles.icons}>
                    <span className={styles.icon} onClick={(e) => {
                        themePickerEvent ? setThemePickerEvent(null) : setThemePickerEvent(e)
                    }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-moon"><path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.9 4.9 1.4 1.4" /><path d="m17.7 17.7 1.4 1.4" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.3 17.7-1.4 1.4" /><path d="m19.1 4.9-1.4 1.4" /></svg></span>
                    <span className={styles.icon} onClick={() => setAccountSettingsModal(true)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg></span>
                    <PopUpCardDropMenuStaticPos mobilepos={{
                        bottom: `70px`,
                        right: `-30px`,
                        width: `200px`,
                        position: 'absolute',
                        zIndex: '5',
                    }} style={{ position: 'absolute', right: '0', bottom: '50px', zIndex: '5' }} event={themePickerEvent}>
                        <PopUpCardDropMenuSectionTitle>
                            Themes
                        </PopUpCardDropMenuSectionTitle>
                        <UserHelpModal />
                    </PopUpCardDropMenuStaticPos>
                </div>
            </div>
            {accountSettingsModal && (
                <AccountSettings usageOpenDefault={usageOpenDefault} Close={() => setAccountSettingsModal(false)} />
            )}
        </>
    )
}
