import styles from '@/styles/pop/popdrop.module.css';
import { useEffect, useState, useRef } from 'react';
import UAParser from 'ua-parser-js';

export function PopCardDropMenu({ event, style, children }) {
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [xPos, setX] = useState(0);
    const [yPos, setY] = useState(0);
    const node = useRef(null)
    const cardWidth = 200;
    const cardHeight = 400;
    const minGap = 7;
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
    }, [event]);

    useEffect(() => {
        if (visible) {
            document.getElementById("createcon").style.overflow = 'hidden'
        } else {
            document.getElementById("createcon").style.overflow = 'auto'
        }
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

                    className={` ${!visible && styles.hidden} ${styles.PopCardDropMenu} `}
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
                }}

                className={` ${!visible && styles.hidden} ${styles.PopCardDropMenu} `}
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
export function PopCardDropMenuStaticPos({ event, ref, style, children }) {
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
                        top: `50px`,
                        left: `0`,
                        width: `100%`,
                    }}

                    className={` ${!visible && styles.hidden} ${styles.PopCardDropMenu} `}
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
                className={` ${!visible && styles.hidden} ${styles.PopCardDropMenu} `}
                ref={node}
            >
                {children}
            </div>

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
        if (parserResults.device.type === "mobile" && window.innerWidth < 600 || window.innerWidth < 600) {
            setIsMobile(true)
        }
    }, [])
    if (isMobile) {
        return (
            <>
                <div
                    style={{ ...style, left: '0', width: '100%', top: '110%' }}
                    className={` ${styles.PopCardDropMenu} `}
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
                className={` ${styles.PopCardDropMenu} `}
            >
                {children}
            </div>
        </>
    )
}

export function PopCardDropMenuSectionTitle({ children }) {
    return (
        <div className={styles.PopCardDropMenuSectionTitle}>
            {children}
        </div>
    )
}

export function PopCardDropMenuSection({ onHover, style, children }) {
    return (
        <>
            <div onMouseEnter={onHover} style={style} className={styles.PopCardDropMenuSection}>
                {children}
            </div>
        </>
    )
}

export function PopCardDropMenuSectionItem({ onClick, onHover, onHoverLeave, children }) {
    return (
        <div onClick={onClick} onMouseEnter={onHover} onMouseLeave={onHoverLeave} className={styles.PopCardDropMenuSectionItem}>
            {children}
        </div>
    )
}