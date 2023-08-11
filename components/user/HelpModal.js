import { AlternateButton, ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";
import Link from 'next/link'
import Head from "next/head";
import Router from "next/router";
export default function UserHelpModal({ CloseHelp }) {
    return (
        <>
        <Head>
            <title>Theme</title>
        </Head>
            <ModalContainer events={CloseHelp}>
                <ModalForm>
                    <ModalTitle>Theme</ModalTitle>
                    <AlternateButton click={()=>{
                        window.localStorage.setItem('theme', 'purple')
                        Router.reload()
                    }}>Purple</AlternateButton>
                    <AlternateButton click={()=>{
                        window.localStorage.setItem('theme', '')
                        Router.reload()
                    }}>System</AlternateButton>
                </ModalForm>
            </ModalContainer>
        </>
    )
}