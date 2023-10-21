import styles from '@/styles/modal2.module.css'
import React from 'react';
import ReactDOM from 'react-dom'; // Import your CSS module

export function Modal({ style, close, children }) {
    return ReactDOM.createPortal(
        (
            <div onClick={close} className={styles.modal}>
                <div onClick={(e) => e.stopPropagation()} style={style} className={styles.modalContent}>
                    {children}
                </div>
            </div>
        ),
        document.body
    );
}


export function ModalButton({ alt, ...props }) {
    return (
        <button type='button' {...props} className={`${styles.button} ${alt && styles.buttonAlt}`}>
            {props.children}
        </button>
    )
}
export function ModalInput({ type, accept, onChange, ...props }) {
    return (
        <label className={`${styles.button}`}>
            <input style={{ display: 'none' }} type={type} accept={accept} onChange={onChange} />
            {props.children}
        </label>
    )
}

export function ModalLoader() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1em' }}>
            <div className={styles.loader}></div>
        </div>
    )
}
