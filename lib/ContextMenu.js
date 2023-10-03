import styles from '@/styles/pop/contextmenu.module.css';
import { useEffect, useState, useRef } from 'react';
import UAParser from 'ua-parser-js';

export function ContextMenuDropMenu({ event, ref, style, children }) {
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [xPos, setX] = useState(0);
    const [yPos, setY] = useState(0);
    const cardWidth = 200;
    const cardHeight = 400;
    const minGap = 7;
    const contextMenu = useRef(null)
    const handleButtonClick = (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;

        // Calculate the position of the card to keep it within the window bounds
        const maxX = window.innerWidth - cardWidth - minGap;
        const maxY = window.innerHeight - cardHeight - minGap;

        // Ensure xPos and yPos stay within bounds
        const clampedX = Math.min(maxX, Math.max(minGap, clickX));
        const clampedY = Math.min(maxY, Math.max(minGap, clickY));

        setX(clampedX);
        setY(clampedY);
        setVisible(true); // Always make the card visible on click
    };

    useEffect(() => {
        const parser = new UAParser("user-agent"); // you need to pass the user-agent for nodejs
        //console.log(parser); // {}
        const parserResults = parser.getResult();
        //console.log(parserResults);
        if (parserResults.device.type === "mobile" || parserResults.device.type === "tablet") {
            setIsMobile(true)
        }
        if (!isMobile && window.innerWidth < 800) {
            setIsMobile(true)
        }

    }, [])

    useEffect(() => {
        if (event !== null) {
            handleButtonClick(event.eventData);
            if (contextMenu) {
                event.data.map((item) => {
                    contextMenu.current.setAttribute(item.key, item.value)
                })
            }
        }
    }, [event]);
    if (isMobile) {
        return (
            <>
                <div
                    style={{
                        ...style,
                        top: `50px`,
                        left: `0`,
                        width: `100%`,
                    }}

                    className={` ${!visible && styles.hidden} ${styles.ContextMenuDropMenu} `}
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
                style={{
                    ...style,
                    top: `calc(${yPos}px + -5px)`,
                    left: `${xPos}px`,
                    width: `${cardWidth}px`,
                    height: 'fit-content',
                }}

                className={` ${!visible && styles.hidden} ${styles.ContextMenuDropMenu} `}
                ref={contextMenu}
                onMouseLeave={() => {
                    setVisible(false)
                }}
            >
                {children}
            </div>
            {visible && (
                <div onClick={() => setVisible(false)} className={styles.clickBox} />
            )}

        </>
    )
}

export function PopDropMenuStatic({ style, children }) {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        let parser = new UAParser("user-agent"); // you need to pass the user-agent for nodejs
        //console.log(parser); // {}
        let parserResults = parser.getResult();
        //console.log(parserResults);
        if (parserResults.device.type === "mobile" || parserResults.device.type === "tablet") {
            setIsMobile(true)
        }
        if (!isMobile && window.innerWidth < 800) {
            setIsMobile(true)
        }
    }, [])
    if (isMobile) {
        return (
            <>
                <div
                    style={{ ...style, left: '10', width: '100%', top: '110%' }}
                    className={` ${styles.ContextMenuDropMenu} `}
                >
                    {children}
                </div>
            </>
        )
    }
    return (
        <>
            <div
                style={style}
                className={` ${styles.ContextMenuDropMenu} `}
            >
                {children}
            </div>
        </>
    )
}

export function ContextMenuDropMenuSection({ onHover, style, children }) {
    return (
        <>
            <div onMouseEnter={onHover} style={style} className={styles.ContextMenuDropMenuSection}>
                {children}
            </div>
        </>
    )
}

export function ContextMenuDropMenuSectionItem({ onClick, onHover, onHoverLeave, children }) {
    return (
        <div onClick={onClick} onMouseEnter={onHover} onMouseLeave={onHoverLeave} className={styles.ContextMenuDropMenuSectionItem}>
            {children}
        </div>
    )
}