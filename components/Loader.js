import styles from '@/styles/Loader.module.css'
export default function Loader() {
    return (
        <div className={styles.container}>
            <div className={styles.loader}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </div>
        </div>
    )
}