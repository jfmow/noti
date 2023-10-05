import styles from '@/styles/pop/Tabbed.module.css';
import { useEffect, useState, useRef } from 'react';
import UAParser from 'ua-parser-js';
export function TabbedDropMenuStaticPos({ event, ref, style, mobilepos, children }) {
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
                    style={mobilepos}
                    className={` ${!visible && styles.hidden} ${styles.TabbedDropMenu} `}
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
                className={` ${!visible && styles.hidden} ${styles.TabbedDropMenu} `}
                ref={node}
            >
                {children}
            </div>

        </>
    )
}

export function TabbedDropMenuStaticPosSelectorSurround({ children }) {
    return (
        <div className={styles.TabbedDropMenuSelectorSurround}>
            {children}
        </div>
    )
}

export function TabbedDropMenuSelectorOptions({ click, active, itemSet, children }) {
    return (
        <button aria-label={children + " tab button"} type='button' className={`${active && styles.TabbedDropMenuSelectorOptionsActive} ${styles.TabbedDropMenuSelectorOptions}`} onClick={click}>
            {children}
        </button>
    )
}

export function TabbedDropMenuItemSurround({ activeItem, children }) {
    return (
        <div className={styles.TabbedDropMenuItemSurround}>
            {children}
        </div>
    )
}

export function TabbedDropMenuItem({ active, children }) {
    if (!active) {
        return (<></>)
    }
    return (
        <div className={styles.TabbedDropMenuItem}>
            {children}
        </div>
    )
}