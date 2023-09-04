import { AlternateButton, ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";
import Link from 'next/link'
import Head from "next/head";
import Router from "next/router";
import CustomThemePicker from "./CustomTheme";
import { useState } from "react";

export default function UserHelpModal({ CloseHelp }) {
    const [themePicker, setThemePicker] = useState(false);

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
                    <AlternateButton click={() => {
                        updateTheme('purple')
                    }}>Purple</AlternateButton>
                    <AlternateButton click={() => {
                        updateTheme('navy blue')
                    }}>Navy blue</AlternateButton>
                    <AlternateButton click={() => {
                        updateTheme('pro pink')
                    }}>Pro pink</AlternateButton>
                    <AlternateButton click={() => {
                        updateTheme('relax orange')
                    }}>Relax orange</AlternateButton>
                    <AlternateButton click={() => {
                        updateTheme('pro dark')
                    }}>Pro dark</AlternateButton>
                    <AlternateButton click={() => {
                        updateTheme('mid light')
                    }}>Mid light</AlternateButton>
                    <AlternateButton click={() => {
                        updateTheme('')
                    }}>System</AlternateButton>
                    <AlternateButton click={() => {
                        setThemePicker(true)
                    }}>Create a theme</AlternateButton>
                </ModalForm>
            </ModalContainer>
        </>
    )
}
