import { AlternateButton, ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";
import Link from 'next/link'
import Head from "next/head";
import Router from "next/router";
import CustomThemePicker from "./CustomTheme";
import { useState } from "react";
export default function UserHelpModal({ CloseHelp }) {
    const [themePicker, setThemePicker] = useState(false)
    const storageEvent = new Event('storage');

    // Set the event key and newValue properties
    Object.defineProperty(storageEvent, 'key', { value: 'theme' });
    Object.defineProperty(storageEvent, 'newValue', { value: 'new_theme_value' });

    function disableCustomTheme() {
        try {
            const customTheme = window.localStorage.getItem('Custom_theme')
            window.localStorage.setItem('Custom_theme', JSON.stringify({ 'enabled': false, 'data': JSON.parse(customTheme).data }))
        } catch (err) { }
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
                        window.localStorage.setItem('theme', 'purple')
                        disableCustomTheme()
                        window.dispatchEvent(storageEvent);
                    }}>Purple</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'navy blue')
                        disableCustomTheme()
                        window.dispatchEvent(storageEvent);
                    }}>Navy blue</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'pro pink')
                        disableCustomTheme()
                        window.dispatchEvent(storageEvent);
                    }}>Pro pink</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'relax orange')
                        disableCustomTheme()
                        window.dispatchEvent(storageEvent);
                    }}>Relax orange</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'pro dark')
                        disableCustomTheme()
                        window.dispatchEvent(storageEvent);
                    }}>Pro dark</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'mid light')
                        disableCustomTheme()
                        window.dispatchEvent(storageEvent);
                    }}>Mid light</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', '')
                        disableCustomTheme()
                        window.dispatchEvent(storageEvent);
                    }}>System</AlternateButton>
                    <AlternateButton click={() => {
                        setThemePicker(true)
                    }}>Create a theme</AlternateButton>
                </ModalForm>
            </ModalContainer>
        </>
    )
}