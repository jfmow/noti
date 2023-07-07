import { useEffect, useState } from "react";
import emojis from 'emoji-datasource';
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
                            return (
                                <button
                                    key={emoji.unified}
                                    type="button"
                                    onClick={() => setNewIcon(emoji)}
                                    className={styles.icon}
                                    title={emoji.short_name}
                                >
                                    {String.fromCodePoint(`0x${emoji.unified}`)}
                                </button>
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
