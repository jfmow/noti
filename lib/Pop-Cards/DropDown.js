import React, { useContext, useEffect, useRef, useState } from "react";
import styles from '@/styles/DropDown.module.css'
import { createPortal } from "react-dom";
const PopUpCardDropMenuContext = React.createContext();
const ExtensionContext = React.createContext();

export function DropDownContainer({ children }) {
    const [dropDownVisible, setDropDownVisible] = useState(false)
    const containerRef = useRef(null)
    const dropDownRef = useRef(null)
    const triggerRef = useRef(null)
    const padding = 10; // Padding value in pixels
    const triggerPadding = 10;
    useEffect(() => {
        if (dropDownRef.current && triggerRef.current) {
            const tip = dropDownRef.current.getBoundingClientRect();
            const trigger = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Calculate adjusted position for the tooltip with padding
            let x = trigger.left + trigger.width / 2 - tip.width / 2;
            let y = trigger.top - tip.height - triggerPadding;

            // Ensure minimum distance between tooltip and viewport edges
            x = Math.max(padding, Math.min(viewportWidth - tip.width - padding, x));

            // Adjust tooltip position if it's too close to the top of the page
            if (y < padding) {
                y = trigger.bottom + triggerPadding;
            }

            // Adjust tooltip position if it's too close to the right edge
            if (x + tip.width > viewportWidth - padding) {
                x = viewportWidth - tip.width - padding;
            }

            // Apply adjusted position to tooltip
            dropDownRef.current.style.left = x + 'px';
            dropDownRef.current.style.top = y + 'px';
            const animationDuration = 250; // Animation duration in milliseconds
            let transformOrigin = ''
            if (y < (viewportHeight / 2)) {
                transformOrigin = transformOrigin + 'top'
            } else {
                transformOrigin = transformOrigin + 'bottom'
            }
            if (trigger.right > (viewportWidth / 2)) {
                transformOrigin = transformOrigin + ' right'
            } else {
                transformOrigin = transformOrigin + ' left'
            }
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
            dropDownRef.current.animate(keyframes, animationOptions);
        }
    }, [dropDownRef, triggerRef, dropDownVisible])
    return (
        <PopUpCardDropMenuContext.Provider value={{ dropDownVisible, setDropDownVisible, containerRef, dropDownRef, triggerRef }}>

            <div onMouseLeave={() => dropDownVisible === 'hover' && setDropDownVisible(false)} ref={containerRef} className={styles.container}>
                {dropDownVisible && (
                    <div onClick={() => setDropDownVisible(false)} className={styles.clicker} />
                )}
                {children}
            </div>
        </PopUpCardDropMenuContext.Provider >
    )
}

export function DropDownTrigger({ hover, children }) {
    const { setDropDownVisible, triggerRef } = useContext(PopUpCardDropMenuContext)
    if (hover) {
        return (
            <div ref={triggerRef} onMouseEnter={() => setDropDownVisible('hover')} className={styles.trigger}>
                {children}
            </div>
        )
    }
    return (
        <div ref={triggerRef} onClick={() => setDropDownVisible(true)} className={styles.trigger}>
            {children}
        </div>
    )
}

export function DropDown({ children }) {
    const { dropDownVisible, dropDownRef } = useContext(PopUpCardDropMenuContext)
    return (
        <>
            {dropDownVisible && (
                <div ref={dropDownRef} className={styles.dropdown}>
                    {children}
                </div>
            )}
        </>
    )
}

export function DropDownSection({ children }) {
    return (
        <div className={styles.section}>
            {children}
        </div>
    )
}

export function DropDownSectionTitle({ ...props }) {
    return (
        <h1 className={styles.title} {...props}>{props.children}</h1>
    )
}

export function DropDownItem({ ...props }) {
    return (
        <div className={styles.item} {...props}>
            {props.children}
        </div>
    )
}

export function DropDownExtensionContainer({ children }) {
    const { dropDownRef } = useContext(PopUpCardDropMenuContext);
    const triggerRef = useRef(null)
    const dropDownRef2 = useRef(null);
    const [visible, setVisible] = useState(false)
    const padding = 10; // Padding value in pixels
    const triggerPadding = 10;
    useEffect(() => {
        if (dropDownRef2.current && triggerRef.current) {
            const tip = dropDownRef2.current.getBoundingClientRect();
            const trigger = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Calculate adjusted position for the tooltip with padding
            let x = trigger.left + trigger.width / 2 - tip.width / 2;
            let y = trigger.top - tip.height - triggerPadding + 10;

            // Ensure minimum distance between tooltip and viewport edges
            x = Math.max(padding, Math.min(viewportWidth - tip.width - padding, x));

            // Adjust tooltip position if it's too close to the top of the page
            if (y < padding) {
                y = trigger.bottom - 40
                if (y < 0) {
                    y = trigger.bottom + padding
                }
            }

            // Adjust tooltip position if it's too close to the right edge
            if (x + tip.width > viewportWidth - padding) {
                x = viewportWidth - tip.width - padding;
            }

            // Apply adjusted position to tooltip
            if (x > viewportWidth / 2 && dropDownRef.current.getBoundingClientRect().width < viewportWidth / 2) {
                const nx = x - 194
                x = nx
            }
            dropDownRef2.current.style.left = x + 'px';
            dropDownRef2.current.style.top = y + 'px';
            const animationDuration = 250; // Animation duration in milliseconds
            let transformOrigin = ''
            if (trigger.y < (viewportHeight / 2)) {
                transformOrigin = transformOrigin + 'top'
            } else {
                transformOrigin = transformOrigin + 'bottom'
            }
            if (trigger.right > (viewportWidth / 2)) {
                transformOrigin = transformOrigin + ' right'
            } else {
                transformOrigin = transformOrigin + ' left'
            }
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
            dropDownRef2.current.animate(keyframes, animationOptions);
        }
    }, [dropDownRef2, triggerRef, visible])
    return (
        <ExtensionContext.Provider value={{ triggerRef, dropDownRef2, visible, setVisible }}>
            <div onMouseLeave={() => setVisible(false)}>
                {children}
            </div>
        </ExtensionContext.Provider>
    )
}

export function DropDownExtensionTrigger({ hover, children }) {
    const { triggerRef, setVisible } = useContext(ExtensionContext)
    if (hover) {
        return (
            <div ref={triggerRef} onMouseEnter={() => setVisible(true)}>
                {children}
            </div>
        )
    }
    return (
        <div ref={triggerRef} onClick={() => setVisible(true)}>
            {children}
        </div>
    )
}

export function DropDownExtension({ children }) {
    const { dropDownRef2, visible } = useContext(ExtensionContext);
    const { containerRef } = useContext(PopUpCardDropMenuContext)
    return (
        <>
            {visible && (
                <>
                    {createPortal(
                        <div ref={dropDownRef2} className={styles.dropdown}>
                            {children}
                        </div>,
                        containerRef.current
                    )}
                </>
            )}
        </>
    )
}