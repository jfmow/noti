import styles from '@/styles/Single/PlainLoader.module.css'
export default function PlainLoader() {
    return (
        <div className={styles.loadercontainer}>

            <h1 className={styles.title}>Noti</h1>
            <div className={styles.loader}></div>
        </div>
    )
}