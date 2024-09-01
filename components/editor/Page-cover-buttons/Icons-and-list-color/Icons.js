import { useEffect, useState, useRef } from "react";
import emojis from 'emoji-datasource-twitter';
import { PopUpCardsGlobalButton } from "@/lib/Pop-Cards/Popup";
import { TextInput } from "@/components/UI";

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
            <TextInput
                type="text"
                placeholder="Search for a emoji"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full my-2"
            />
            <div className="flex items-center flex-wrap gap-2 mb-1">
                <button
                    type="button"
                    className="flex items-center justify-center bg-slate-100 p-1 text-[12px] font-[600] rounded text-slate-800"
                    onClick={() => handleCategoryClick('')}
                >All</button>
                {categories.map((category) => (
                    <button
                        aria-label={`${category} category filter button`}
                        key={category}
                        type="button"
                        className={`${"flex items-center justify-center p-1 text-[12px] font-[600] rounded text-slate-800"} ${selectedCategory === category ? "bg-slate-300 " : 'bg-slate-100'
                            }`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div >
            <div className="relative flex flex-wrap h-full justify-between items-center" ref={containerRef}>
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
                                    style={{ transform: 'scale(0.8)' }}
                                    onClick={() => setNewIcon(emoji)}
                                    title={emoji.short_name}
                                    className={((Selected === emoji || Selected === emoji.image) ? "bg-red-300 rounded-md" : "") + " p-1 cursor-pointer m-[-5px]"}
                                >
                                    <img
                                        loading={index > 250 ? "lazy" : "eager"}
                                        className="flex cursor-pointer w-[32px] h-[32px] cursor-pointer"
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
