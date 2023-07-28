import styles from '@/styles/modal.module.css'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
export function ModalContainer({ events, noanimate, noblur, children }) {
    if (noanimate) {
        return (
            <div className={`${styles.default_settings_modal_container} ${noblur && styles.noblur}`} onClick={!noblur ? (events) : (null)}>
                <div className={styles.default_settings_modal_container_usrname_bg}>
                    <div className={styles.default_settings_modal_container_usrname_block} onClick={(event) => event.stopPropagation()}>
                        <button type='button' onClick={events} className={styles.default_settings_modal_container_usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
    useEffect(() => {
        document.body.style.overflow = 'hidden !important';
    }, [])
    return (
        <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} className={`${styles.default_settings_modal_container} ${noblur && styles.noblur}`} onClick={!noblur ? (events) : (null)}>
            <div className={styles.default_settings_modal_container_usrname_bg}>
                <div className={styles.default_settings_modal_container_usrname_block} onClick={(event) => event.stopPropagation()}>
                    <button type='button' onClick={events} className={styles.default_settings_modal_container_usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                    {children}
                </div>
            </div>
        </motion.div>
    )
}

export function ModalButton({ events, classnm, children }) {
    return (
        <button type='button' onClick={events} className={`${styles.buttondefault} ${classnm}`}>{children}</button>
    )
}

export function ModalForm({ chngevent, children }) {
    return (
        <>
            <form onChange={chngevent}>
                {children}
            </form>
        </>
    )
}

export function ModalTitle({ children }) {
    return (
        <h2>{children}</h2>
    )
}

export function ModalInput({ chngevent, place, type }) {
    return (
        <div className={styles.default_settings_modal_container_usrname_edit_form}>
            <input autoCorrect='false' autoCapitalize='false' onChange={(event) => chngevent(event.target.value)} type={type} placeholder={place} />
        </div>
    )
}

export function ModalCheckBox({ chngevent, checked, children }) {
    return (
        <div className={styles.cbx}>
            <span className={styles.cbxlabel}>
                {children}
            </span>
        <input onChange={(e) => chngevent(e.target.checked)} type="checkbox" id={styles.cbx} checked={checked} style={{display: 'none'}}/>
        <label htmlFor={styles.cbx} className={styles.chbxcontainer}>
            <svg width="18px" height="18px" viewBox="0 0 18 18">
                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
        </label>
    </div>
    )
}

export function AlternateButton({ click, isLink, children }) {
    if (isLink) {
        return (
            <Link className={styles.acc_button} href={click}>
                {children}
            </Link>
        )
    }
    return (
        <button onClick={click} type='button' className={styles.acc_button}>{children}</button>
    )
}
export function AlternateInput({ click, type, classn, children }) {
    if (type === 'file') {
        return (
            <label className={`${styles.acc_button}`}>
                <input style={{display: 'none'}} type="file" name="file" id="fileInput" accept="image/*" onChange={(e) => click(e)} className={`${styles.acc_button} ${classn}`} />
                <p>{children}</p>
            </label>
        )
    }
    return (
        <input onClick={click} type={type} className={`${styles.acc_button} ${classn}`} />
    )
}


export function ModalTempLoader() {
    return (
        <div
            className={styles.loadercontainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} // Increased duration to 1.5 seconds
        >
            <svg className={styles.load1} viewBox="25 25 50 50">
                <circle className={styles.load2} r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    )
}
