import { ModalContainer, ModalForm, ModalTitle, ModalButton } from "@/lib/Modal"
import { useState} from "react"
import styles from '@/styles/Auth.module.css'
export default function Tut({ setHidden }) {
    const cards = [
        { name: "Welcome to Noti", info: "Click 'Next' to start the tutorial. (Instructions are for desktop users. Mobile users may have a slightly different layout, but it's essentially the same.)" },
        { name: "Creating a page", info: "To create a page, click '+ Create Page'. To create a subpage within a page, select the desired page and click the '+' icon on the right." },
        { name: "Managing pages", info: "All the options you need are to manage the page are the small white buttons on the right. Click them to see their functions. Do not click the trash can icon, as it permanently deletes the page and cannot this can not undone." },
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