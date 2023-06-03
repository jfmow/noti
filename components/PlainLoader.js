import styles from '@/styles/Single/PlainLoader.module.css'
export default function PlainLoader(){
    return(
        <div className={styles.loadercontainer}>
        <div className={styles.loader}></div>
        </div>
    )
}