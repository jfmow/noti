import { ModalContainer, ModalForm, ModalTitle, ModalButton, AlternateButton } from "@/lib/Modal"
import { useEffect, useState } from "react"
import styles from '@/styles/Auth.module.css'
import Router from "next/router";
export default function Tut({ setHidden }) {
    const cards = [
        { name: "Welcome to Noti", info: "Click 'Next' to start the tutorial. (Instructions are for desktop users. Mobile users may have a slightly different layout, but it's essentially the same.)", img: '/tut/welcome.svg' },
        { name: "Creating a page", info: "To create a page, click '+ Create Page'. To create a subpage within a page, select the desired page and click the '+' icon on the right.", img: '/tut/menu.svg' },
        { name: "Managing pages", info: "All the options you need are to manage the page are the small white buttons on the right. Click them to see their functions. Do not click the trash can icon, as it permanently deletes the page and cannot this can not undone.", img: '/tut/pages.svg' },
        { name: "Setting a title", info: "1) Click on the title text. 2) Make your changes. 3) Save by clicking out on to something else", img: '/tut/title.svg' },
    ];
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    useEffect(() => {
        if (currentCardIndex === 1) {
            document.getElementById('createnewpageid').classList.add('tut')
        } else if (currentCardIndex === 2) {
            document.getElementById('createnewpageid').classList.remove('tut')
            document.getElementById('tut_title_btns_id').classList.add('tut')
        } else if (currentCardIndex === 3) {
            document.getElementById('tut_title_btns_id').classList.remove('tut')
            document.getElementById('tuttitle').classList.add('tut')
        }
        try {
            Router.prefetch(cards[currentCardIndex + 1].img)
        } catch { }
    }, [currentCardIndex])

    function Hide() {
        setHidden(true);
        document.getElementById('createnewpageid').classList.remove('tut')
        document.getElementById('tuttitle').classList.remove('tut')
        document.getElementById('tut_title_btns_id').classList.remove('tut')
    }
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
            <ModalContainer events={Hide} noblur={true}>
                <ModalForm>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <img loading="egar" style={{ width: 'auto', height: '50px', minWidth: '70px' }} src={currentCard.img} />
                        <ModalTitle>
                            {currentCard.name}
                        </ModalTitle>
                    </div>
                    <p className={styles.warn} style={{ maxHeight: '40dvh', overflowY: 'scroll', overflowX: 'hidden' }}>
                        {currentCard.info}
                    </p>
                    <AlternateButton click={isLastCard ? (Hide) : (handleNextCard)}>{isLastCard ? ('Close') : ('Next')}</AlternateButton>
                </ModalForm>
            </ModalContainer>
        </>
    )
}