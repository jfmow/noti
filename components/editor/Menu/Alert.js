import styles from '@/styles/Alert.module.css'
import { useEffect, useState } from 'react';

export default function Alert({ key, style, ref, classname, page, close, func }) {
    const [disabled, setDisabled] = useState(true);
    const [remainingSeconds, setRemainingSeconds] = useState(4);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            if (remainingSeconds > 0) {
                setRemainingSeconds(prevSeconds => prevSeconds - 1);
            } else {
                setDisabled(false);
                clearInterval(countdownInterval);
            }
        }, 1000);

        return () => {
            clearInterval(countdownInterval);
        };
    }, [remainingSeconds]);

    return (
        <div style={style} className={`${classname} ${styles.container}`}>
            <div className={styles.alert}>
                <h1>Delete page</h1>
                <p>Are you sure you want to delete this page?</p>
                <div className={styles.alertbuttons}>
                    <button className={styles.alertbutton} disabled={disabled} onClick={func}>
                        {disabled ? `Continue (${remainingSeconds})` : (<><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg> Continue</>)}
                    </button>
                    <button className={styles.alertbutton} onClick={close}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
