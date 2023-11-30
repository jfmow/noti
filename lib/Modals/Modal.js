import styles from '@/styles/modal2.module.css'
import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom'; // Import your CSS module
const modalContext = React.createContext()
export function Modal({ style, close, children }) {
    const [visible, setVisible] = useState(false)
    return (
        <modalContext.Provider value={{ visible, setVisible }}>
            {children}
        </modalContext.Provider>
    );
}

export function ModalContent({ ...props }) {
    const { visible, setVisible } = useContext(modalContext)
    if (visible) {
        return ReactDOM.createPortal(
            <div onClick={() => setVisible(false)} className={styles.modal}>
                <div onClick={(e) => e.stopPropagation()} style={props.style} className={styles.modalContent}>
                    {props.children}
                </div>
            </div>,
            document.body
        )
    }
    return <></>
}

export function ModalTrigger({ ...props }) {
    const { setVisible } = useContext(modalContext)
    return (
        <div onClick={() => setVisible(true)} {...props}>
            {props.children}
        </div>
    )
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


export function Gap({ ...props }) {
    return (
        <div style={{ width: '100%', height: props.children + 'px' }} />
    )
}