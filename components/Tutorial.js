import { ModalContainer, ModalForm, ModalTitle, ModalButton } from "@/lib/Modal"
import { useState, useEffect } from "react"
import styles from '@/styles/Auth.module.css'
export default function Tut({ setHidden }) {
    const cards = [
        { name: "Welcome to Noti", info: "Click next to get started with the tutorial" },
        { name: "Creating a page", info: "To create the first page click the '+ Create Page'. To create a page in a page, select the page you want to add a sub page to an click the + on the right hand side" },
        { name: "Managing pages", info: "Every option you could need is one of the little white buttons on the right, click them to see what they do. But DO NOT click the trash can unless you want the page to be deleted, they cannot be recovered" },
    ];
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const handleNextCard = () => {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
    };

    const handlePrevCard = () => {
        setCurrentCardIndex((prevIndex) => prevIndex - 1);
    };
    const currentCard = cards[currentCardIndex];
    const isLastCard = currentCardIndex === cards.length - 1;
    const isFirstCard = currentCardIndex === 0;
    return (
        <>
            <ModalContainer events={() => setHidden(true)} noblur={true}>
                <ModalForm>
                    <ModalTitle>
                        {currentCard.name}
                    </ModalTitle>
                    <p className={styles.warn} style={{ maxHeight: '40dvh', overflowY: 'scroll', overflowX: 'hidden' }}>
                        {currentCard.info}
                    </p>
                    <ModalButton events={isLastCard ? (() => setHidden(true)) : (handleNextCard)}>{isLastCard ? ('Close') : ('Next')}</ModalButton>
                </ModalForm>
            </ModalContainer>
        </>
    )
}