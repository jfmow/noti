import styles from '@/styles/pop/poptabs.module.css';
import { useEffect, useState, useRef } from 'react';
import UAParser from 'ua-parser-js';
export function PopTabsDropMenuStaticPos({ event, ref, style, children }) {
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const node = useRef();

    const handleButtonClick = () => {
        setVisible(true);
    };

    useEffect(() => {
        const parser = new UAParser(navigator.userAgent); // Pass the user-agent string from the browser
        const parserResults = parser.getResult();
        if (parserResults.device.type === "mobile" && window.innerWidth < 600 || window.innerWidth < 600) {
            setIsMobile(true);
        }

        // Handle clicks outside the component
        const handleClickOutside = (event) => {
            if (node.current && !node.current.contains(event.target)) {
                setVisible(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (event !== null) {
            handleButtonClick(event);
        }
    }, [event]);

    useEffect(() => {
        try {
            if (visible) {
                document.getElementById("createcon").style.overflow = 'hidden'
                document.body.style.overflow = 'hidden'
            } else {
                document.getElementById("createcon").style.overflow = 'auto'
                document.body.style.overflow = 'auto'
            }
        } catch { }
    }, [visible])

    if (isMobile) {
        return (
            <>
                <div
                    style={{
                        top: `50px`,
                        left: `0`,
                        width: `100%`,
                    }}

                    className={` ${!visible && styles.hidden} ${styles.PopTabsDropMenu} `}
                    ref={ref}
                >
                    {children}
                </div>
                {visible && (
                    <div onClick={() => setVisible(false)} className={styles.clickBox} />
                )}

            </>
        )
    }
    return (
        <>
            <div
                style={style
                }
                className={` ${!visible && styles.hidden} ${styles.PopTabsDropMenu} `}
                ref={node}
            >
                {children}
            </div>

        </>
    )
}

export function PopTabsDropMenuStaticPosSelectorSurround({ children }) {
    return (
        <div className={styles.PopTabsDropMenuSelectorSurround}>
            {children}
        </div>
    )
}

export function PopTabsDropMenuSelectorOptions({ click, active, itemSet, children }) {
    return (
        <button aria-label={children + " tab button"} type='button' className={`${active && styles.PopTabsDropMenuSelectorOptionsActive} ${styles.PopTabsDropMenuSelectorOptions}`} onClick={click}>
            {children}
        </button>
    )
}

export function PopTabsDropMenuItemSurround({ activeItem, children }) {
    return (
        <div className={styles.PopTabsDropMenuItemSurround}>
            {children}
        </div>
    )
}

export function PopTabsDropMenuItem({ active, children }) {
    if (!active) {
        return (<></>)
    }
    return (
        <div className={styles.PopTabsDropMenuItem}>
            {children}
        </div>
    )
}