import styles from '@/styles/pop/popdrop.module.css';
import { useEffect, useState } from 'react';


export function PopCardDropMenu({ event, children }) {
    const [visible, setVisible] = useState(false)
    const [xPos, setX] = useState(0);
    const [yPos, setY] = useState(0);
    const cardWidth = 200;
    const cardHeight = 400;
    const minGap = 37;
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
    return (
        <>
            <div
                style={{
                    top: `calc(${yPos + 'px'} + 37px)`,
                    left: xPos + 'px',
                    width: cardWidth + 'px',
                }}
                className={` ${!visible && styles.hidden} ${styles.PopCardDropMenu} `}
            >
                {children}
            </div>
            {visible && (
                <div onClick={() => setVisible(false)} className={styles.clickBox} />
            )}

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

export function PopCardDropMenuSection({ children }) {
    return (
        <>
            <div className={styles.PopCardDropMenuSection}>
                {children}
            </div>
        </>
    )
}

export function PopCardDropMenuSectionItem({ children }) {
    return (
        <div className={styles.PopCardDropMenuSectionItem}>
            {children}
        </div>
    )
}