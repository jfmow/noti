import { useEffect, useState, useRef } from "react";
import emojis from 'emoji-datasource-twitter';
import styles from '@/styles/emojis.module.css';
import { AlternateButton, ModalContainer, ModalForm, ModalInput, ModalTitle } from "@/lib/Modal";

export default function Icons({ Select, Selected, Close }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmojis, setFilteredEmojis] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [visibleEmojis, setVisibleEmojis] = useState([]);
    const [loadedIndex, setLoadedIndex] = useState(250);
    const containerRef = useRef(null);

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
        setLoadedIndex(250);
    }, [searchTerm, selectedCategory]);

    useEffect(() => {
        const emojisToDisplay = filteredEmojis.slice(0, loadedIndex);
        setVisibleEmojis(emojisToDisplay);
    }, [filteredEmojis, loadedIndex]);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (container) {
                const { scrollTop, scrollHeight, clientHeight } = container;
                ////console.log(scrollHeight - scrollTop - 3, clientHeight)
                if (scrollHeight - scrollTop - 3 <= clientHeight) {
                    setLoadedIndex((prevIndex) => prevIndex + 250);
                }
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

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
                <div className={styles.emojigrid} ref={containerRef}>
                    {visibleEmojis.map((emoji) => {
                        try {
                            if (emoji.has_img_twitter) {
                                const { sheet_x, sheet_y } = emoji;
                                const sheet_size = 64;
                                const x = (sheet_x * (sheet_size + 2)) + 1;
                                const y = (sheet_y * (sheet_size + 2)) + 1;
                                const style = {
                                    backgroundImage: `url(/64.png)`,
                                    backgroundPosition: `-${x}px -${y}px`,
                                };
                                return (
                                    <div
                                        key={emoji.unified}
                                        className={styles.icon}
                                        onClick={() => setNewIcon(emoji)}
                                        title={emoji.short_name}
                                    >
                                        <span
                                            className={` ${styles.emojiIcon}`}
                                            loading="lazy"
                                            style={style}
                                        />
                                    </div>
                                );
                            }
                        } catch (err) {
                            return null;
                        }
                    })}
                </div>
            </ModalForm>
        </ModalContainer>
    );
}
