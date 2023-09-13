import { AlternateButton, ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";
import Link from 'next/link'
import Head from "next/head";
import Router from "next/router";
import CustomThemePicker from "./CustomTheme";
import { useState } from "react";

export default function UserHelpModal({ CloseHelp }) {
    const [themePicker, setThemePicker] = useState(false);
    const themes = [{ displayName: 'Purple', key: 'purple' }, { displayName: 'Navy blue', key: 'navy blue' }, { displayName: 'Pro pink', key: 'pro pink' }, { displayName: 'Relax orange', key: 'relax orange' }, { displayName: 'Pro dark', key: 'pro dark' }, { displayName: 'Mid light', key: 'mid light' }, { displayName: 'Cool Gray', key: 'cool gray' }, { displayName: 'System', key: 'system' }]

    function disableCustomTheme() {
        try {
            const customTheme = window.localStorage.getItem('Custom_theme')
            window.localStorage.setItem('Custom_theme', JSON.stringify({ 'enabled': false, 'data': JSON.parse(customTheme).data }))
        } catch (err) { }
    }

    function updateTheme(theme) {
        disableCustomTheme();
        window.localStorage.setItem('theme', theme);

        // Create a storage event and dispatch it
        const storageEvent = new Event('storage');
        storageEvent.key = 'theme';
        storageEvent.newValue = theme;
        window.dispatchEvent(storageEvent);
    }

    return (
        <>
            <Head>
                <title>Theme</title>
            </Head>
            <ModalContainer events={CloseHelp} noblur={themePicker}>
                <ModalForm>
                    {themePicker && (
                        <CustomThemePicker close={() => setThemePicker(false)} />
                    )}
                    <ModalTitle>Theme</ModalTitle>
                    {themes.map((theme) => (
                        <AlternateButton click={() => {
                            updateTheme(theme.key)
                        }}>{theme.displayName}</AlternateButton>
                    ))}
                    <AlternateButton click={() => {
                        setThemePicker(true)
                    }}>Create a theme</AlternateButton>
                </ModalForm>
            </ModalContainer>
        </>
    )
}
