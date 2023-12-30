import React, { use, useContext, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
const tabsContextProvider = React.createContext()
export function TabsProvider({ children }) {
    const tabgroupRef = useRef(null)
    const triggerRef = useRef(null)
    const [visible, setVisible] = useState(false)
    const [items, setItems] = useState([])
    const [visibleItem, setVisibleItem] = useState([])

    return (
        <tabsContextProvider.Provider value={{ tabgroupRef, triggerRef, visible, setVisible, items, setItems, visibleItem, setVisibleItem }}>
            <div>
                {children}
            </div>
        </tabsContextProvider.Provider>
    )
}

export function Tabtrigger({ children }) {
    const { setVisible, triggerRef } = useContext(tabsContextProvider)
    return (
        <div ref={triggerRef} onClick={() => setVisible(true)}>
            {children}
        </div>
    )
}

export function TabGroup({ ...props }) {
    const { tabgroupRef, triggerRef, visible, setVisible } = useContext(tabsContextProvider);
    const padding = 15

    useEffect(() => {
        if (tabgroupRef.current && triggerRef.current) {
            const trigger = triggerRef.current.getBoundingClientRect();
            const dropdown = tabgroupRef.current.getBoundingClientRect();
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

            //Temp precaution:
            //make max height dist between trigger and viewport btm
            tabgroupRef.current.style.maxHeight = viewPortHeight - trigger.bottom - (padding * 2) + "px"

            if (window.matchMedia("(max-width: 600px)").matches) {


                tabgroupRef.current.style.top = ""
                //TODO: fix why it won't go to bottom of scrn
                //tabgroupRef.current.style.bottom = "0"
                tabgroupRef.current.style.width = "100vw"
                transformOrigin = 'bottom'
            } else {
                tabgroupRef.current.style.left = x + 'px';
                tabgroupRef.current.style.top = y + 'px';
            }







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
            tabgroupRef.current.animate(keyframes, animationOptions);

        }
    }, [tabgroupRef, triggerRef, visible])

    return (
        <>
            {visible && (
                <>
                    {createPortal(
                        <>
                            <div onClick={() => setVisible(false)} className="w-full h-screen fixed top-0 left-0 z-[13]" />
                            <div className="fixed top-0 left-0 bg-[var(--popupBackground)] shadow z-[14] border rounded-lg flex flex-col items-center w-[400px] min-h[200px] text-[var(--modalTextColor)] overflow-hidden max-h-[50dvh] " ref={tabgroupRef} {...props}>
                                {props.children}
                            </div>
                        </>,
                        document.body
                    )}
                </>
            )}
        </>
    );
}

export function TabMenu({ ...props }) {
    const tabMenuRef = useRef(null)
    const { items, setItems, setVisibleItem } = useContext(tabsContextProvider)
    const [gridLength, setGridLength] = useState(1)
    useEffect(() => {
        if (tabMenuRef && tabMenuRef.current) {
            var tempItems = []
            Array.from(tabMenuRef.current.children).map((item) => {
                const itemId = Array.from(item.attributes).find(item => item.name === 'for')?.value
                tempItems.push(itemId)
            })
            setItems(tempItems)
            setVisibleItem(tempItems[0])
            setGridLength(Array.from(tabMenuRef.current.children).length)
        }
    }, [])
    return (
        <div className="grid justify-items-center items-center w-full p-3" style={{ gridTemplateColumns: `repeat(${gridLength}, minmax(0, 1fr))` }} ref={tabMenuRef} {...props}>
            {props.children}
        </div>
    )
}

export function TabMenuItem({ ...props }) {
    const { setVisibleItem, visibleItem } = useContext(tabsContextProvider)
    return (
        <div onClick={(e) => {
            e.preventDefault()
            setVisibleItem(props.for)
        }} className={`${visibleItem === props.for ? "bg-[var(--popupButtonBg)]" : ''} ${"w-full flex items-center justify-center p-2 cursor-pointer rounded-lg font-[600] text-[14px] min-h-[37px]"}`} {...props}>
            {props.children}
        </div>
    )
}

export function TabContent({ ...props }) {
    const { visibleItem } = useContext(tabsContextProvider)
    return (
        <>
            {visibleItem === props.name && (
                <div className="p-4 overflow-y-scroll overflow-x-hidden max-h-[50svh] relative" {...props}>
                    {props.children}
                </div>
            )}
        </>
    )
}