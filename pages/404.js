import { Paragraph, SubmitButton } from "@/components/UX-Components";
import Router from "next/router";

export default function Custom404() {
    return (
        <div style={{ background: '#eee', color: '#000', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1>404</h1>
            <Paragraph>Look's like this page doesn't exist!</Paragraph>
            <SubmitButton style={{ width: 'fit-content' }} onClick={() => Router.replace('/')}>Return home</SubmitButton>
        </div>
    )
}