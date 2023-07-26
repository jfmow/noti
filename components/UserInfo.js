import styles from '@/styles/Useroption.module.css'
import dynamic from 'next/dynamic';
import { useState } from 'react';
const AccountSettings = dynamic(() => import("./user/AccountButtons"), {
  ssr: true,
});
export default function UserOptions({user}) {
    const [accountSettingsModal, setAccountSettingsModal] = useState(false)
    return (
        <>
            <div className={styles.container}>

                <div className={styles.usricon}>
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z" /></g></svg>
                </div>
                <div className={styles.email}>
                    <span>{user.email}</span>
                </div>
                <div className={styles.icons}>
                    <span className={styles.icon}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><path d="M7.92,7.54C7.12,7.2,6.78,6.21,7.26,5.49C8.23,4.05,9.85,3,11.99,3c2.35,0,3.96,1.07,4.78,2.41c0.7,1.15,1.11,3.3,0.03,4.9 c-1.2,1.77-2.35,2.31-2.97,3.45c-0.15,0.27-0.24,0.49-0.3,0.94c-0.09,0.73-0.69,1.3-1.43,1.3c-0.87,0-1.58-0.75-1.48-1.62 c0.06-0.51,0.18-1.04,0.46-1.54c0.77-1.39,2.25-2.21,3.11-3.44c0.91-1.29,0.4-3.7-2.18-3.7c-1.17,0-1.93,0.61-2.4,1.34 C9.26,7.61,8.53,7.79,7.92,7.54z M14,20c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-1.1,0.9-2,2-2S14,18.9,14,20z" /></g></svg></span>
                    <span className={styles.icon} onClick={()=>setAccountSettingsModal(true)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg></span>
                </div>

            </div>
            {accountSettingsModal && (
                <AccountSettings Close={()=>setAccountSettingsModal(false)}/>
            )}
        </>
    )
}