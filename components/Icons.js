import { useEffect, useState } from "react";
import emojis from 'emoji-datasource';
import styles from '@/styles/emojis.module.css';
import { AlternateButton, ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";

export default function Icons({ Select, Selected, Close }) {
    useEffect(() => {
        emojis.sort((a, b) => a.category.localeCompare(b.category));
    }, []);

    function setNewIcon(e) {
        Select(e);
    }

    return (
        <ModalContainer events={Close}>
            <ModalForm>
                <ModalTitle>Click one to set it</ModalTitle>
                <div className={styles.emojigrid}>
                    {emojis.map((emoji) => {
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
