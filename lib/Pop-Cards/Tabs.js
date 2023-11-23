import React, { use, useContext, useEffect, useRef, useState } from "react"
import styles from '@/styles/Tabs.module.css'
const tabsContextProvider = React.createContext()
export function TabsProvider({ children }) {
    const tabgroupRef = useRef(null)
    const triggerRef = useRef(null)
    const [visible, setVisible] = useState(false)
    const [items, setItems] = useState([])
    const [visibleItem, setVisibleItem] = useState([])
    const containerRef = useRef(null)

    return (
        <tabsContextProvider.Provider value={{ tabgroupRef, triggerRef, visible, setVisible, items, setItems, visibleItem, setVisibleItem, containerRef }}>
            <div ref={containerRef}>
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
    const { tabgroupRef, triggerRef, visible, setVisible, containerRef } = useContext(tabsContextProvider);
    const padding = 15
    const handleClickOutside = (event) => {
        if (tabgroupRef.current && containerRef.current && !containerRef.current.contains(event.target)) {
            // Clicked outside the TabGroup, hide it
            setVisible(false);
        }
    };

    useEffect(() => {
        const handleDocumentClick = (event) => {
            handleClickOutside(event);
        };

        if (visible) {
            document.addEventListener('click', handleDocumentClick);
        }

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [visible]);

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
            tabgroupRef.current.style.left = x + 'px';
            tabgroupRef.current.style.top = y + 'px';


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
                <div className={styles.container} ref={tabgroupRef} {...props}>
                    {props.children}
                </div>
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
        <div className={styles.menu} style={{ gridTemplateColumns: `repeat(${gridLength}, minmax(0, 1fr))` }} ref={tabMenuRef} {...props}>
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
        }} className={`${visibleItem === props.for ? styles.active : ''} ${styles.item}`} {...props}>
            {props.children}
        </div>
    )
}

export function TabContent({ ...props }) {
    const { visibleItem } = useContext(tabsContextProvider)
    return (
        <>
            {visibleItem === props.name && (
                <div className={styles.content} {...props}>
                    {props.children}
                </div>
            )}
        </>
    )
}