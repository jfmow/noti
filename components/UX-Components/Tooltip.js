import React, { useContext, useEffect, useRef, useState } from "react"
import styles from '@/styles/Tooltip.module.css'
const toolTipContext = React.createContext();

export function ToolTipCon({ children }) {
    const [tooltipVisible, setToolTipVisible] = useState(false)
    const triggerRef = useRef(null)
    function handleMouseEnter() {
        setToolTipVisible(true)
    }
    function handleMouseLeave() {
        setToolTipVisible(false)
    }

    return (
        <>
            <toolTipContext.Provider value={{ handleMouseEnter, handleMouseLeave, tooltipVisible, setToolTipVisible, triggerRef }}>
                {children}
            </toolTipContext.Provider>
        </>
    );
}

export function ToolTipTrigger({ children }) {
    const { handleMouseEnter, handleMouseLeave, triggerRef } = useContext(toolTipContext)
    return (
        <div ref={triggerRef} onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
            {children}
        </div>
    )
}

export function ToolTip({ children }) {
    const tooltipRef = useRef(null)
    const { tooltipVisible, triggerRef } = useContext(toolTipContext)
    const padding = 10; // Padding value in pixels
    const triggerPadding = 10; // Minimum distance between tooltip and trigger in pixels

    useEffect(() => {
        if (tooltipRef?.current && triggerRef?.current) {
            const tip = tooltipRef.current.getBoundingClientRect();
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
            tooltipRef.current.style.left = x + 'px';
            tooltipRef.current.style.top = y + 'px';
        }
    }, [tooltipVisible]);
    return (
        <>
            {tooltipVisible && (
                <div aria-roledescription="tooltip" role="tooltip" ref={tooltipRef} className={styles.tooltip}>
                    {children}
                </div>
            )}
        </>
    )
}