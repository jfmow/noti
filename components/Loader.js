import styles from '@/styles/Single/PlainLoader.module.css'
export default function Loader() {
    return (
        <div className={styles.loadercontainer}>

            <svg className={styles.load1} viewBox="25 25 50 50">
                <circle className={styles.load2} r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    )
}