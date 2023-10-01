import styles from '@/styles/modal.module.css'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
export function ModalContainer({ events, noanimate, noblur, children }) {
    if (noanimate) {
        return (
            <div className={`${styles.modal_container} ${noblur && styles.noblur}`} onClick={!noblur ? (events) : (null)}>
                <div className={styles.modal_container_layout} onClick={(event) => event.stopPropagation()}>
                    <button type='button' onClick={events} className={styles.modal_close_button}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                    {children}
                </div>
            </div>
        )
    }
    useEffect(() => {
        document.body.style.overflow = 'hidden !important';
    }, [])
    return (
        <motion.div initial={{ opacity: 0.5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }} className={`${styles.modal_container} ${noblur && styles.noblur}`} onClick={!noblur ? (events) : (null)}>

            <div className={styles.modal_container_layout} onClick={(event) => event.stopPropagation()}>
                <button aria-label='Close' type='button' onClick={events} className={styles.modal_close_button}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                {children}
            </div>
        </motion.div>
    )
}

export function ModalButton({ events, classnm, children }) {
    return (
        <button type='button' onClick={events} className={`${styles.default_modal_button} ${classnm}`}>{children}</button>
    )
}


export function ModalForm({ chngevent, children }) {
    return (
        <>
            <div className={styles.modalform} onChange={chngevent} onSubmit={(e) => e.preventDefault()}>
                {children}
            </div>
        </>
    )
}
export function ModalOverflowBlock({ className, children }) {
    return (
        <>
            <div className={`${styles.modal_content} ${className}`}>
                {children}
            </div>
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
        <div className={styles.default_modal_input}>
            <input className={styles.input} autoCorrect='false' autoCapitalize='false' onChange={(event) => chngevent(event.target.value)} type={type} placeholder={place} />
        </div>
    )
}

export function ModalCheckBox({ chngevent, checked, children }) {
    return (
        <div className={styles.cbxcon}>
            <p>{children}</p>
            <input type="checkbox" onChange={chngevent} checked={checked} className={styles.modal_checkbox} />
        </div>
    )
}

export function ModalCheckBoxSlider({ chngevent, checked }) {
    const id = useState(self.crypto.randomUUID()) // Generate a unique id
    return (
        <div className={styles.modal_toggle_switch}>
            <input
                className={styles.modal_toggle_input}
                onChange={chngevent}
                checked={checked}
                id={id[0]} // Use the generated id as the input's id
                type="checkbox"
            />
            <label className={styles.modal_toggle_label} htmlFor={id[0]}></label> {/* Use htmlFor instead of for */}
        </div>
    );
}

export function AlternateButton({ click, isLink, children }) {
    if (isLink) {
        return (
            <Link className={styles.secondary_modal_button} href={click}>
                {children}
            </Link>
        )
    }
    return (
        <button onClick={click} type='button' className={styles.secondary_modal_button}>{children}</button>
    )
}

export function AlternateInput({ click, type, classn, children }) {
    if (type === 'file') {
        return (
            <label className={`${styles.secondary_modal_button}`}>
                <input style={{ display: 'none' }} type="file" name="file" id="fileInput" accept="image/*" onChange={(e) => click(e)} className={`${styles.secondary_modal_button} ${styles.input} ${classn}`} />
                <p>{children}</p>
            </label>
        )
    }
    return (
        <input onClick={click} type={type} className={`${styles.secondary_modal_button} ${classn}`} />
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

export function CopyPasteTextArea({ click, className, children }) {
    return (
        <>
            <div className={`${className} ${styles.copy_paste_textarea}`}>
                <span>{children}</span>
                <button aria-label='Copy text' type='button' onClick={click}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg></button>
            </div>
        </>
    )
}
