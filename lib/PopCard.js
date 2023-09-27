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
    }, [event]);

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