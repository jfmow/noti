import styles from '@/styles/modal.module.css'

export function ModalContainer({ events, children }) {
    return (
        <div className={styles.default_settings_modal_container} onClick={events}>
            <div className={styles.default_settings_modal_container_usrname_bg}>
                <div className={styles.default_settings_modal_container_usrname_block} onClick={(event) => event.stopPropagation()}>
                    <button type='button' onClick={events} className={styles.default_settings_modal_container_usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                    {children}
                </div>
            </div>
        </div>
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