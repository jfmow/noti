import styles from '@/styles/popcard.module.css';
import { useEffect, useState } from 'react';
export default function PopCard({ className, style, event, children }) {
    const [xPos, setX] = useState(0);
    const [yPos, setY] = useState(0);
    const [visible, setVisible] = useState(false);

    // Set minimum width and height for the card
    const cardWidth = 520;
    const cardHeight = 400;

    // Set minimum gap from the edge of the screen
    const minGap = 30;

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

    const handleMouseLeave = (e) => {
        // Calculate the distance between the mouse and the card
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const cardCenterX = xPos + cardWidth / 2;
        const cardCenterY = yPos + cardHeight / 2;
        const distance = Math.sqrt(
            Math.pow(mouseX - cardCenterX, 2) + Math.pow(mouseY - cardCenterY, 2)
        );

        // Hide the card only if the mouse has moved more than 55px away from it
        if (distance > 200) {
            setVisible(false);
        }
    };

    useEffect(() => {
        if (event) {
            handleButtonClick(event);
        }
        return () => {
            setVisible(false)
        }
    }, [event]);

    useEffect(() => {
        if (visible) {
            document.getElementById("createcon").style.overflow = 'hidden'
        } else {
            document.getElementById("createcon").style.overflow = 'auto'
        }
        return () => {
            setVisible(false)
        }
    }, [visible])

    return (
        <>
            {visible && (
                <div
                    style={{
                        top: `calc(${yPos + 'px'} + 37px)`,
                        left: xPos + 'px',
                        width: cardWidth + 'px',
                        height: cardHeight + 'px',
                    }}
                    className={styles.PopCard}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className={styles.closebtn} onClick={() => setVisible(false)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg></div>
                    {children}
                </div>
            )}
        </>
    );
}



export function PopCardTitle({ children }) {
    return (
        <div className={styles.PopCardTitle}>
            <h2 className={styles.PopCardTitle_text}>{children}</h2>
        </div>
    )
}
export function PopCardSubTitle({ children }) {
    return (
        <div className={styles.PopCardSubTitle}>
            <h5 className={styles.PopCardSubTitle_text}>{children}</h5>
        </div>
    )
}
export function PopCardScrollCon({ children }) {
    return (
        <div className={styles.PopCardScrollCon}>
            {children}
        </div>
    )
}