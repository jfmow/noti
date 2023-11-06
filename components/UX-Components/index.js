import styles from '@/styles/UX.module.css'
export function Input({ label, ...props }) {
    const id = crypto.randomUUID()
    return (
        <div className={styles.ux_input_default}>
            {label && (
                <label for={id}>{label}</label>
            )}
            <input name={id} {...props} />
        </div>
    )
}

export function FileInput({ alt, ...props }) {
    const className = `${styles.ux_submitButton} ${alt ? styles.ux_submitButton_alt : ''}`
    return (
        <label className={className}>
            <input onChange={props.onChange} accept={props.accept} style={{ display: 'none' }} type={'file'} />
            {props.children}
        </label>
    )
}

export function SubmitButton({ alt, ...props }) {
    const className = `${styles.ux_submitButton} ${alt ? styles.ux_submitButton_alt : ''}`
    if (!props?.type) {
        return (
            <>
                <button type='button' {...props} className={className} >{props?.children}</button>
            </>
        )
    }
    return (
        <>
            <button {...props} className={className} >{props?.children}</button>
        </>
    )
}

export function Paragraph({ ...props }) {
    return (
        <p {...props} className={styles.ux_paragraph}>
            {props?.children}
        </p>
    )
}

export function Link({ ...props }) {
    return (
        <a {...props} className={styles.ux_link}>{props.children}</a>
    )
}

export function ToggleSwitch({ ...props }) {
    return (
        <div className={styles.ux_toggleSwitch_container}>
            <label style={{ fontSize: props?.size || '' }} {...props} className={styles.ux_toggleSwitch}>
                <input defaultChecked={props?.enabled} type="checkbox" />
                <span className={styles.ux_toggleSwitch_slider}></span>
            </label >
            <span>{props.children}</span>
        </div>
    )
}