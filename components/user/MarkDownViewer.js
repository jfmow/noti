import Head from "next/head";
import ReactMarkdown from "react-markdown";
import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function Create({markdown}) {

    

    return (
        <>
            <Head>
                <title>Markdown</title>
            </Head>
            <div style={{ height: '30vh', background: 'var(--background)', border: '2px solid var(--big_button_border)', borderRadius: '10px', fontFamily: 'auto', padding: '1em', overflowX: 'scroll', overflowY: 'scroll' }}><ReactMarkdown>{markdown}</ReactMarkdown></div>
        </>
    );
}
