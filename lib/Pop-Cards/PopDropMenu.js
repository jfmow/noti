import styles from '@/styles/pop/popdrop.module.css';
import { debounce } from 'lodash';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import UAParser from 'ua-parser-js';

//Goes where mouse is
export function PopUpCardDropMenu({ event, style, minGap, animationOrgin, children }) {
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [xPos, setX] = useState(0);
    const [yPos, setY] = useState(0);
    const node = useRef(null)
    const cardWidth = 200;
    const cardHeight = 400;
    const handleButtonClick = (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        //min gap = min gap from edge of screen
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
        if (window.innerWidth < 600) {
            setIsMobile(true)
        }

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

    }, [])

    useEffect(() => {
        if (event !== null) {
            handleButtonClick(event);
        }
        if (event === null) {
            setVisible(false)
        }
    }, [event]);

    useEffect(() => {
        try {
            if (visible) {
                document.getElementById("createcon").style.overflow = 'hidden'
            } else {
                document.getElementById("createcon").style.overflow = 'auto'
            }
        } catch { }
    }, [visible])
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

                    className={` ${!visible && styles.hidden} ${styles.PopUpCardDropMenu} `}
                    ref={node}
                >
                    {children}
                </div>

            </>
        )
    }
    return (
        <>
            <div
                style={{
                    ...style,
                    top: `calc(${yPos}px + 37px)`,
                    left: `${xPos}px`,
                    width: `${cardWidth}px`,
                    transformOrigin: animationOrgin,
                    WebkitTransformOrigin: animationOrgin
                }}

                className={` ${!visible && styles.hidden} ${styles.PopUpCardDropMenu} `}
                ref={node}
            >
                {children}
            </div>
            {visible && (
                <div onClick={() => setVisible(false)} className={styles.clickBox} />
            )}

        </>
    )
}

//Must have defined pos with style
export function PopUpCardDropMenuStaticPos({ event, ref, style, mobilepos, animationOrgin, children }) {
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const parser = new UAParser(navigator.userAgent); // Pass the user-agent string from the browser
        const parserResults = parser.getResult();
        if (parserResults.device.type === "mobile" && window.innerWidth < 600 || window.innerWidth < 600) {
            setIsMobile(true);
        }
    }, []);

    useEffect(() => {
        if (event !== null) {
            if (visible) {
                setVisible(false)
                return
            }
            setVisible(true)
        }
    }, [event]);

    useEffect(() => {
        try {
            if (visible) {
                document.getElementById("createcon").style.overflow = 'hidden'
            } else {
                document.getElementById("createcon").style.overflow = 'auto'
            }
        } catch { }
    }, [visible])
    return (
        <>
            {visible && (
                <div onClick={() => setVisible(false)} className={styles.clickBox}>
                </div>
            )}

            <div
                style={{
                    ...style,
                    transformOrigin: isMobile
                        ? event?.clientX > window.innerWidth / 2
                            ? animationOrgin.includes('bottom')
                                ? 'bottom right'
                                : 'top right'
                            : animationOrgin.includes('bottom')
                                ? 'bottom left'
                                : 'top left'
                        : animationOrgin,
                    WebkitTransformOrigin: animationOrgin,
                    ...(isMobile
                        ? {
                            right: event?.clientX > window.innerWidth / 2 ? 0 : '',
                            left: event?.clientX < window.innerWidth / 2 ? 0 : '',
                        }
                        : {}),
                }}
                className={` ${!visible && styles.hidden} ${styles.PopUpCardDropMenu} `}
            >
                {children}
            </div >
        </>
    )
}

//Must have defined pos with style and in pos rel container
export function PopDropMenuStatic({ style, children }) {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        let parser = new UAParser("user-agent"); // you need to pass the user-agent for nodejs
        //console.log(parser); // {}
        let parserResults = parser.getResult();
        //console.log(parserResults);
        if (parserResults.device.type === "mobile" && window.innerWidth < 600 || window.innerWidth < 600) {
            setIsMobile(true)
        }
    }, [])

    if (isMobile) {
        return (
            <>
                <div
                    style={{ ...style, left: '0', width: '100%', top: '-110%' }}
                    className={` ${styles.PopUpCardDropMenu} `}
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
                className={` ${styles.PopUpCardDropMenu} ${styles.PopUpCardDropMenuSectionStatic} `}
            >
                {children}
            </div>
        </>
    )
}

//items
export function PopUpCardDropMenuSectionTitle({ children }) {
    return (
        <div className={styles.PopUpCardDropMenuSectionTitle}>
            {children}
        </div>
    )
}

export function PopUpCardDropMenuSection({ onHover, style, children }) {
    return (
        <>
            <div onMouseEnter={onHover} style={style} className={styles.PopUpCardDropMenuSection}>
                {children}
            </div>
        </>
    )
}

export function PopUpCardDropMenuSectionItem({ onClick, onMouseEnter, onMouseLeave, onMouseOver, red, children }) {
    return (
        <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onMouseOver={onMouseOver} className={`${styles.PopUpCardDropMenuSectionItem} ${red ? styles.red : ''}`}>
            {children}
        </div>
    )
}