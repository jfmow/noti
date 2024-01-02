import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
const PopUpCardDropMenuContext = React.createContext();
const ExtensionContext = React.createContext();

export function DropDownContainer({ children }) {
    const [dropDownVisible, _setDropDownVisible] = useState(false)
    const [eTransformOrgin, setETransformOrgin] = useState('')
    const containerRef = useRef(null)
    const dropDownRef = useRef(null)
    const triggerRef = useRef(null)
    const padding = 5; // Padding value in pixels
    async function setDropDownVisible(value) {
        if (!value) {
            if (dropDownRef.current) {
                const animationDuration = 250;
                // Define keyframes as an array of objects representing CSS properties and values
                const keyframes = [
                    {
                        opacity: 0,
                        transform: 'translateY(-5px) scale(0.7)',
                        overflow: 'hidden',
                        transformOrigin: eTransformOrgin
                    },
                    {
                        opacity: 1,
                        transformOrigin: eTransformOrgin
                    },
                    {
                        opacity: 1,
                        transform: 'translateY(0) scale(1)',
                        overflow: 'hidden',
                        height: 'fit-content',
                        transformOrigin: eTransformOrgin
                    }
                ];

                // Set up animation options
                const animationOptions = {
                    duration: animationDuration - 50,
                    easing: 'ease-in-out', // You can adjust the easing function as needed
                    fill: 'both', // Keeps the final state of the animation after it completes
                    direction: 'reverse'
                };

                // Apply the animation using the animate method
                dropDownRef.current.animate(keyframes, animationOptions);
                setTimeout(() => {
                    _setDropDownVisible(value)
                }, animationDuration - 50);
                return
            }
        }
        return _setDropDownVisible(value)
    }
    useEffect(() => {
        if (dropDownRef.current && triggerRef.current) {
            const trigger = triggerRef.current.getBoundingClientRect();
            const dropdown = dropDownRef.current.getBoundingClientRect();
            const viewPortHeight = window.innerHeight;
            const viewPortWidth = window.innerWidth;
            let x
            let y
            let transformOrigin = ''
            if (trigger.y > viewPortHeight / 2 && trigger.x < viewPortWidth / 2) {
                x = trigger.right + padding
                y = trigger.top - padding - dropdown.height
                transformOrigin = 'bottom left'
            }
            if (trigger.y < viewPortHeight / 2 && trigger.x > viewPortWidth / 2) {
                y = trigger.bottom + padding
                x = trigger.right - padding - dropdown.width
                transformOrigin = 'top right'
            }
            if (trigger.y < viewPortHeight / 2 && trigger.x < viewPortWidth / 2) {
                y = trigger.bottom + padding
                x = trigger.right
                transformOrigin = 'top left'
            }
            if (trigger.y > viewPortHeight / 2 && trigger.x > viewPortWidth / 2) {
                y = trigger.top - padding - dropdown.height
                x = trigger.left - padding - dropdown.width
                transformOrigin = 'bottom right'
            }
            dropDownRef.current.style.left = x + 'px';
            dropDownRef.current.style.top = y + 'px';

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
            dropDownRef.current.animate(keyframes, animationOptions);
            setETransformOrgin(transformOrigin)

        }
    }, [dropDownRef, triggerRef, dropDownVisible])
    return (
        <PopUpCardDropMenuContext.Provider value={{ dropDownVisible, setDropDownVisible, containerRef, dropDownRef, triggerRef }}>

            <div onMouseLeave={() => dropDownVisible === 'hover' && setDropDownVisible(false)} ref={containerRef}>
                {children}
            </div>
        </PopUpCardDropMenuContext.Provider >
    )
}

export function DropDownTrigger({ hover, children }) {
    const { setDropDownVisible, triggerRef } = useContext(PopUpCardDropMenuContext)
    if (hover) {
        return (
            <div ref={triggerRef} onMouseEnter={() => setDropDownVisible('hover')} className="flex items-center justify-center w-fit h-fit">
                {children}
            </div>
        )
    }
    return (
        <div ref={triggerRef} onClick={() => setDropDownVisible(true)} className="flex items-center justify-center w-fit h-fit">
            {children}
        </div>
    )
}

export function DropDown({ children }) {
    const { dropDownVisible, dropDownRef, setDropDownVisible } = useContext(PopUpCardDropMenuContext)
    return (
        <>
            {dropDownVisible && (
                <>
                    {createPortal(
                        <>
                            <div onClick={() => setDropDownVisible(false)} className={"fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[10]"} />

                            <div ref={dropDownRef} className="fixed flex flex-col w-[200px] bg-[var(--popupBackground)] z-[11] shadow-sm rounded-lg border">
                                {children}
                            </div>
                        </>,
                        document.body
                    )}
                </>
            )}
        </>
    )
}

export function DropDownSection({ children }) {
    return (
        <div className={"border-t w-full h-fit p-[4px] text-[14px] font-[500]"}>
            {children}
        </div>
    )
}

export function DropDownSectionTitle({ ...props }) {
    return (
        <h1 className="font-[600] text-[14px] p-4 text-[var(--modalTextColor)]" {...props}>{props.children}</h1>
    )
}

export function DropDownItem({ ...props }) {
    return (
        <div className="flex items-center px-[8px] py-[6px] text-[var(--modalTextColor)] break-all [&>svg]:w-4 [&>svg]:h-4 [&>svg]:mr-2 [&>svg]:flex cursor-pointer hover:bg-[var(--popupButtonBg)] rounded" {...props}>
            {props.children}
        </div>
    )
}

export function DropDownExtensionContainer({ children }) {
    const { dropDownRef } = useContext(PopUpCardDropMenuContext);
    const triggerRef = useRef(null)
    const [eTransformOrgin, setETransformOrgin] = useState('')
    const dropDownRef2 = useRef(null);
    const [visible, _setVisible] = useState(false)
    const padding = 5; // Padding value in pixels
    function setVisible(value) {
        if (!value) {
            if (dropDownRef2.current) {
                const animationDuration = 250;
                // Define keyframes as an array of objects representing CSS properties and values
                const keyframes = [
                    {
                        opacity: 0,
                        transform: 'translateY(-5px) scale(0.7)',
                        overflow: 'hidden',
                        transformOrigin: eTransformOrgin
                    },
                    {
                        opacity: 1,
                        transformOrigin: eTransformOrgin
                    },
                    {
                        opacity: 1,
                        transform: 'translateY(0) scale(1)',
                        overflow: 'hidden',
                        height: 'fit-content',
                        transformOrigin: eTransformOrgin
                    }
                ];

                // Set up animation options
                const animationOptions = {
                    duration: animationDuration - 50,
                    easing: 'ease-in-out', // You can adjust the easing function as needed
                    fill: 'both', // Keeps the final state of the animation after it completes
                    direction: 'reverse'
                };

                // Apply the animation using the animate method
                dropDownRef2.current.animate(keyframes, animationOptions);
                setTimeout(() => {
                    _setVisible(value)
                }, animationDuration - 50);
                return
            }
        } else {
            return _setVisible(value)
        }
    }
    useEffect(() => {
        if (dropDownRef2.current && triggerRef.current) {
            const trigger = triggerRef.current.getBoundingClientRect();
            const dropdown = dropDownRef2.current.getBoundingClientRect();
            const viewPortHeight = window.innerHeight;
            const viewPortWidth = window.innerWidth;
            let x
            let y
            let transformOrigin = ''
            if (trigger.y > viewPortHeight / 2 && trigger.x < viewPortWidth / 2) {
                x = trigger.right
                y = trigger.bottom + padding - dropdown.height
                transformOrigin = 'bottom left'
            }
            if (trigger.y < viewPortHeight / 2 && trigger.x > viewPortWidth / 2) {
                y = trigger.top
                x = trigger.right - padding - 185 - dropDownRef.current.getBoundingClientRect().width
                transformOrigin = 'top right'
            }
            if (trigger.y < viewPortHeight / 2 && trigger.x < viewPortWidth / 2) {
                y = trigger.bottom
                x = trigger.right
                transformOrigin = 'top left'
            }
            if (trigger.y + trigger.width > viewPortHeight / 2 && trigger.x > viewPortWidth / 2) {
                y = trigger.top - padding - dropdown.height
                x = trigger.left - padding - dropdown.width
                transformOrigin = 'bottom right'
            }
            //TODO: fix this mess
            if (x < 0 || x + dropdown.width > viewPortWidth) {
                x = trigger.x - 5
                if (dropDownRef.current.getBoundingClientRect().bottom + dropdown.height > viewPortHeight) {
                    y = dropDownRef.current.getBoundingClientRect().top - dropdown.height - padding
                    transformOrigin = 'bottom'
                } else {
                    y = dropDownRef.current.getBoundingClientRect().bottom + padding
                    transformOrigin = 'top'
                }

            }

            dropDownRef2.current.style.left = x + 'px';
            dropDownRef2.current.style.top = y + 'px';

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
            dropDownRef2.current.animate(keyframes, animationOptions);
            setETransformOrgin(transformOrigin)
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
    const { dropDownRef } = useContext(PopUpCardDropMenuContext)
    return (
        <>
            {visible && (
                <>
                    {createPortal(
                        <div ref={dropDownRef2} className="fixed flex flex-col w-[200px] bg-[var(--popupBackground)] z-[18] shadow-sm rounded-lg border">
                            {children}
                        </div>,
                        document.body
                    )}
                </>
            )}
        </>
    )
}