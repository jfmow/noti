import React, { useContext, useRef, useState, useEffect } from "react";
import ReactDom from "react-dom"
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
        <popupContext.Provider value={{ visible, setVisible, triggerRef, popUpRef, setPopTransformOrigin, closePopUp }}>
            <>
                {children}
            </>
        </popupContext.Provider>
    )
}

export function Popup({ ...props }) {
    const { visible, triggerRef, popUpRef, setPopTransformOrigin, closePopUp } = useContext(popupContext)
    const [dragOffset, setdragOffset] = useState({ x: 0, y: 0 })
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
            if (innerWidth < 640) {
                x = 0
                popUpRef.current.style.width = "100vw"
                y = innerHeight - 400
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
                        <>
                            <div onDragOver={e => {
                                e.dataTransfer.dropEffect = "move";
                                e.preventDefault()
                            }}
                                onDragEnter={e => {
                                    e.preventDefault()
                                }} onClick={() => closePopUp()} className="fixed top-0 left-0 right-0 bottom-0 h-screen w-full z-[15] select-none" />
                            <div draggable onDragStart={(e) => {
                                const offsetX = e.clientX - e.target.getBoundingClientRect().x
                                const offsetY = e.clientY - e.target.getBoundingClientRect().y
                                setdragOffset({ x: offsetX, y: offsetY })
                            }} onDragEnd={(e) => {
                                popUpRef.current.style.left = e.clientX - dragOffset.x + 'px';
                                popUpRef.current.style.top = e.clientY - dragOffset.y + 'px';
                            }} ref={popUpRef} className="fixed bg-[var(--popupBackground)] shadow-sm z-[16] border rounded-lg p-[1.5rem] flex flex-col items-center w-fit min-w-[200px] min-h-[200px] h-[400px] max-h-[400px] text-[var(--modalTextColor)] [&>h1]:text-[18px]" {...props}>
                                {props.children}
                            </div>
                        </>,
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
        <div ref={triggerRef} {...props} onClick={(e) => {
            e.preventDefault()
            setVisible(true)
        }}>
            {props.children}
        </div>
    )
}

export function PopUpCardsGlobalButton({ click, style, classname, disabled, children }) {
    return (
        <button style={style} disabled={disabled} className="flex items-center justify-center min-w-[60px] h-[30px] rounded border-none cursor-pointer bg-zinc-100 text-zinc-800 px-[8px] py-[16px]" type="button" onClick={click}>
            {children}
        </button >
    )
}