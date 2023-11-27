import { useEffect, useState, useRef } from "react";
import emojis from 'emoji-datasource-twitter';
import styles from '@/styles/Single/emojis.module.css';
import { PopUpCardsGlobalButton } from "@/lib/Pop-Cards/Popup";

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
        if (loadedIndex === -1) {
            const emojisToDisplay = filteredEmojis
            setVisibleEmojis(emojisToDisplay)
            return
        }
        const emojisToDisplay = filteredEmojis.slice(0, loadedIndex);
        setVisibleEmojis(emojisToDisplay);
    }, [filteredEmojis, loadedIndex]);


    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    function setNewIcon(e) {
        Select(e);
    }

    return (
        <>
            <div className={styles.sinputcontainer}>
                <input
                    placeholder="Search for a emoji"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            debouncedSearch();
                        }
                    }}
                    type="text"
                    className={styles.sinput}
                    id={styles.sinput}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className={styles.sunderline}></div>
            </div>
            <div className={styles.categories}>
                <button
                    type="button"
                    className={`${styles.categoryButton}`}
                    onClick={() => handleCategoryClick('')}
                >All</button>
                {categories.map((category) => (
                    <button
                        aria-label={`${category} category filter button`}
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
                {visibleEmojis.map((emoji, index) => {
                    try {
                        if (emoji.has_img_twitter) {
                            //const { sheet_x, sheet_y } = emoji;
                            //const sheet_size = 32;
                            //const x = (sheet_x * (sheet_size + 2)) + 1;
                            //const y = (sheet_y * (sheet_size + 2)) + 1;
                            //const style = {
                            //    backgroundImage: `url(/32.png)`,
                            //    backgroundPosition: `-${x}px -${y}px`,
                            //};
                            return (
                                <div
                                    key={emoji.unified}
                                    className={styles.icon}
                                    onClick={() => setNewIcon(emoji)}
                                    title={emoji.short_name}
                                >
                                    <img
                                        loading={index > 250 ? "lazy" : "eager"}
                                        className={` ${styles.emojiIcon}`}
                                        src={`/emoji/twitter/64/${emoji.image}`}
                                    />
                                </div>
                            );
                        }
                    } catch (err) {
                        return null;
                    }
                })}
            </div>
            <PopUpCardsGlobalButton disabled={loadedIndex >= filteredEmojis.length} style={{ width: '100%', marginTop: '15px', marginBottom: '15px' }} click={() => setLoadedIndex(loadedIndex + 250)}>Load more</PopUpCardsGlobalButton>
        </>
    );
}
