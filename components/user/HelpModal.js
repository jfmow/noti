import { AlternateButton, ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";
import Link from 'next/link'
import Head from "next/head";
import Router from "next/router";
import CustomThemePicker from "./CustomTheme";
import { useState } from "react";
export default function UserHelpModal({ CloseHelp }) {
    const [themePicker, setThemePicker] = useState(false)
    function disableCustomTheme() {
        const customTheme = window.localStorage.getItem('Custom_theme')
        window.localStorage.setItem('Custom_theme', JSON.stringify({ 'enabled': false, 'data': JSON.parse(customTheme).data }))
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
                        Router.reload()
                    }}>Purple</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'navy blue')
                        disableCustomTheme()
                        Router.reload()
                    }}>Navy blue</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'pro pink')
                        disableCustomTheme()
                        Router.reload()
                    }}>Pro pink</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'relax orange')
                        disableCustomTheme()
                        Router.reload()
                    }}>Relax orange</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'pro dark')
                        disableCustomTheme()
                        Router.reload()
                    }}>Pro dark</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', 'mid light')
                        disableCustomTheme()
                        Router.reload()
                    }}>Mid light</AlternateButton>
                    <AlternateButton click={() => {
                        window.localStorage.setItem('theme', '')
                        disableCustomTheme()
                        Router.reload()
                    }}>System</AlternateButton>
                    <AlternateButton click={() => {
                        setThemePicker(true)
                    }}>Create a theme</AlternateButton>
                </ModalForm>
            </ModalContainer>
        </>
    )
}