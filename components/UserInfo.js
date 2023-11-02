import { PopUpCardDropMenuSection, PopUpCardDropMenuSectionItem, PopUpCardDropMenuSectionTitle, PopUpCardDropMenuStaticPos } from '@/lib/Pop-Cards/PopDropMenu';
import styles from '@/styles/Useroption.module.css'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import AccountButtons from './user/AccountButtons2';
const UserHelpModal = dynamic(() => import("./user/ThemePicker"), {
    ssr: true,
});
export default function UserOptions({ user, clss, usageOpenDefault }) {
    const [accountSettingsModal, setAccountSettingsModal] = useState(usageOpenDefault ? true : false)
    const [userHelpModal, setUserHelpModal] = useState(false)
    const [themePickerEvent, setThemePickerEvent] = useState(null)
    const [popUpClickEventSettingsModal, setpopUpClickEventSettingsModal] = useState(null)
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
                    <span className={styles.icon} aria-label='Theme picker button' onClick={(e) => setThemePickerEvent(e)
                    }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" /><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" /><path d="M14.5 17.5 4.5 15" /></svg>
                    </span>
                    <div>
                        <span aria-label='Accout settings button' aria-haspopup className={styles.icon} onClick={(e) => {
                            setpopUpClickEventSettingsModal(e)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                        </span>
                        <AccountButtons usageOpenDefault={usageOpenDefault} event={popUpClickEventSettingsModal} />

                    </div>
                    <PopUpCardDropMenuStaticPos animationOrgin={'bottom right'} mobilepos={{
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

        </>
    )
}
