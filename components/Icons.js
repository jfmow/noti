import { useEffect, useState } from "react";
import emojis from 'emoji-datasource';
import styles from '@/styles/emojis.module.css';
import { AlternateButton, ModalContainer, ModalForm, ModalInput, ModalTitle } from "@/lib/Modal";

export default function Icons({ Select, Selected, Close }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmojis, setFilteredEmojis] = useState([]);

    useEffect(() => {
        emojis.sort((a, b) => a.category.localeCompare(b.category));
    }, []);

    useEffect(() => {
        const filtered = emojis.filter((emoji) => {
            const shortName = emoji.short_name.toLowerCase();
            return shortName.includes(searchTerm.toLowerCase());
        });
        setFilteredEmojis(filtered);
    }, [searchTerm]);

    function setNewIcon(e) {
        Select(e);
    }

    return (
        <ModalContainer events={Close}>
            <ModalForm>
                <ModalTitle>Icons</ModalTitle>
                <ModalInput chngevent={setSearchTerm} place={"Search by short name..."}></ModalInput>
                <div className={styles.emojigrid}>
                    {filteredEmojis.map((emoji) => {
                        try {
                            return (
                                <button
                                    key={emoji.unified}
                                    type="button"
                                    onClick={() => setNewIcon(emoji)}
                                    className={styles.icon}
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
