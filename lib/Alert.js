import styles from '@/styles/Alert.module.css'
import { useEffect, useState } from 'react';
export function AlertContainer({ children }) {
    return (
        <div className={styles.container}>
            <div className={styles.alert}>
                {children}
            </div>
        </div>
    )
}

export function AlertButtons({ children }) {
    return (
        <div className={styles.alertbuttons}>
            {children}
        </div>
    )
}

export function AlertButton({ onClick, disabled, children }) {

    const [internalDisabled, setInternalDisabled] = useState(disabled);
    const [remainingSeconds, setRemainingSeconds] = useState(4);

    useEffect(() => {
        if (disabled === 'delay') {
            setInternalDisabled(true);
            const countdownInterval = setInterval(() => {
                if (remainingSeconds > 1) {
                    setRemainingSeconds(prevSeconds => prevSeconds - 1);
                } else {
                    setInternalDisabled(false);
                    clearInterval(countdownInterval);
                }
            }, 1000);

            return () => {
                clearInterval(countdownInterval);
            };
        } else {
            setInternalDisabled(disabled);
        }
    }, [disabled, remainingSeconds]);

    return (
        <button type='button' onClick={onClick} className={styles.alertbutton} disabled={internalDisabled}>{children}{internalDisabled && `(${remainingSeconds}s)`}</button>
    )
}