import styles from '@/styles/Acc.module.css'
export default function disabledAcc() {
    return (
        <div className={styles.container}>
            <div className={styles.disabled}>
                <h1>This account is currently disabled!</h1>
                <h5>Please contact {process.env.NEXT_PUBLIC_SUPPORT_EMAIL} if you think this is a mistake</h5>
            </div>
        </div>
    )
}