import { useEffect, useState } from "react";
import emojis from 'emoji-datasource-twitter';
import styles from '@/styles/emojis.module.css';
import { AlternateButton, ModalContainer, ModalForm, ModalInput, ModalTitle } from "@/lib/Modal";

export default function Icons({ Select, Selected, Close }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmojis, setFilteredEmojis] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        emojis.sort((a, b) => a.sort_order - b.sort_order);
        const uniqueCategories = [...new Set(emojis.map((emoji) => emoji.category))];
        setCategories(uniqueCategories);
    }, []);

    useEffect(() => {
        const filtered = emojis.filter((emoji) => {
            const shortName = emoji.short_name.toLowerCase();
            return (
                shortName.includes(searchTerm.toLowerCase()) &&
                (!selectedCategory || emoji.category === selectedCategory)
            );
        });
        setFilteredEmojis(filtered);
    }, [searchTerm, selectedCategory]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    function setNewIcon(e) {
        Select(e);
    }

    return (
        <ModalContainer events={Close}>
            <ModalForm>
                <ModalTitle>Icons</ModalTitle>
                <ModalInput chngevent={setSearchTerm} place={"Search by name..."}></ModalInput>
                <div className={styles.categories}>
                    <button
                        type="button"
                        className={`${styles.categoryButton}`}
                        onClick={() => handleCategoryClick('')}
                    >All</button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''
                                }`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className={styles.emojigrid}>
                    {filteredEmojis.map((emoji) => {
                        try {
                            const { sheet_x, sheet_y } = emoji;
                            const sheet_size = 32;
                            const x = (sheet_x * (sheet_size + 2)) + 1;
                            const y = (sheet_y * (sheet_size + 2)) + 1;
                            const style = {
                                backgroundImage: `url(/32.png)`,
                                backgroundPosition: `-${x}px -${y}px`,
                            };

                            return (
                                <div className={styles.icon} onClick={() => setNewIcon(emoji)} 
                                title={emoji.short_name}>
                                    <img
                                        key={emoji.unified}
                                        type="button"
                                        className={` ${styles.emojiIcon}`}
                                        style={style}
                                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                    />
                                </div>
                            );
                        } catch (err) {
                            return null;
                        }
                    })}
                </div>


                <AlternateButton click={Close}>Close</AlternateButton>
            </ModalForm>
        </ModalContainer>
    );
}
