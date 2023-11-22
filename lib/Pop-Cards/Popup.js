import React, { useContext, useRef, useState, useEffect } from "react";
import ReactDom from "react-dom"
import styles from '@/styles/Popup.module.css'
const popupContext = React.createContext()
export function PopupContainer({ children }) {
    const [visible, setVisible] = useState(false)
    const triggerRef = useRef(null)
    const popUpRef = useRef(null)
    const [popTransformOrigin, setPopTransformOrigin] = useState('')

    async function closePopUp() {
        const animationDuration = 250;
        // Define keyframes as an array of objects representing CSS properties and values
        const keyframes = [
            {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                overflow: 'hidden',
                height: 'fit-content',
                transformOrigin: popTransformOrigin
            },
            {
                opacity: 1,
                transformOrigin: popTransformOrigin
            },
            {
                opacity: 0,
                transform: 'translateY(-5px) scale(0.7)',
                overflow: 'hidden',
                transformOrigin: popTransformOrigin
            }
        ];

        // Set up animation options
        const animationOptions = {
            duration: animationDuration,
            easing: 'ease-in-out', // You can adjust the easing function as needed
            fill: 'both' // Keeps the final state of the animation after it completes
        };

        // Apply the animation using the animate method
        popUpRef.current.animate(keyframes, animationOptions);
        setTimeout(() => {
            setVisible(false)
        }, 250);
    }

    return (
        <popupContext.Provider value={{ visible, setVisible, triggerRef, popUpRef, setPopTransformOrigin }}>
            <>
                {visible && (
                    ReactDom.createPortal(<div onClick={() => closePopUp()} className={styles.backdrop_trigger} />, document.body)
                )}
                {children}
            </>
        </popupContext.Provider>
    )
}

export function Popup({ ...props }) {
    const { visible, triggerRef, popUpRef, setPopTransformOrigin } = useContext(popupContext)
    const padding = 15; // Padding value in pixels
    useEffect(() => {
        if (popUpRef.current && triggerRef.current) {
            const trigger = triggerRef.current.getBoundingClientRect();
            const dropdown = popUpRef.current.getBoundingClientRect();
            const viewPortHeight = window.innerHeight;
            const viewPortWidth = window.innerWidth;
            let x
            let y
            let transformOrigin = ''
            if (trigger.x < viewPortWidth / 2) {
                //console.log('BL')
                x = padding
                y = padding
                transformOrigin = 'bottom'
            }
            if (trigger.x > viewPortWidth / 2) {
                //console.log('BR')
                y = viewPortHeight - dropdown.height - padding
                x = viewPortWidth - dropdown.width - padding * 2
                transformOrigin = 'bottom'
            }
            //console.log(trigger, x, y)
            popUpRef.current.style.left = x + 'px';
            popUpRef.current.style.top = y + 'px';

            const animationDuration = 250;
            // Define keyframes as an array of objects representing CSS properties and values
            const keyframes = [
                {
                    opacity: 0,
                    transform: 'translateY(-5px) scale(0.7)',
                    overflow: 'hidden',
                    transformOrigin: transformOrigin
                },
                {
                    opacity: 1,
                    transformOrigin: transformOrigin
                },
                {
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                    overflow: 'hidden',
                    height: 'fit-content',
                    transformOrigin: transformOrigin
                }
            ];

            // Set up animation options
            const animationOptions = {
                duration: animationDuration,
                easing: 'ease-in-out', // You can adjust the easing function as needed
                fill: 'both' // Keeps the final state of the animation after it completes
            };

            // Apply the animation using the animate method
            popUpRef.current.animate(keyframes, animationOptions);
            setPopTransformOrigin(transformOrigin)

        }
    }, [popUpRef, triggerRef, visible])
    return (
        <>
            {visible && (
                <>
                    {ReactDom.createPortal(
                        <div ref={popUpRef} className={styles.popup} {...props}>
                            {props.children}
                        </div>,
                        document.body
                    )}
                </>
            )}
        </>

    )
}

export function PopUpTrigger({ ...props }) {
    const { setVisible, triggerRef } = useContext(popupContext)
    return (
        <div className={styles.trigger} ref={triggerRef} {...props} onClick={(e) => {
            e.preventDefault()
            setVisible(true)
        }}>
            {props.children}
        </div>
    )
}

export function PopUpCardsGlobalButton({ click, style, classname, disabled, children }) {
    return (
        <button style={style} disabled={disabled} className={`${styles.pagebtn} ${styles.pagebtn_dark} ${classname}`} type="button" onClick={click}>
            {children}
        </button >
    )
}