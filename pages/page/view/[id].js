import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import Link from "next/link";
import styles from '@/styles/Article.module.css'
import Image from "next/image";
import Head from "next/head";
import { createRandomMeshGradients } from "@/lib/randomMeshGradient";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function Viewer({ arti }) {


    useEffect(() => {
        if (typeof document !== 'undefined') {
            // Access the document object here
            const headerbg = createRandomMeshGradients()
            if (document.getElementById('titlebg')) {
                document.getElementById('titlebg').style.backgroundColor = headerbg.bgColor
                document.getElementById('titlebg').style.backgroundImage = headerbg.bgImage
            }
        }
        //set a colorful header
    }, [arti])

    return <><SavedData savedData={JSON.parse(arti).content} articleArti={JSON.parse(arti)} /></>
}

const SavedData = ({ savedData, articleArti }) => {

    if (!savedData) {
        return (
            <div className={styles.container}>
                <Head>
                    <meta name="robots" content="noindex" />
                    <meta name="robots" content="noindex, max-snippet:0, noarchive, notranslate, noimageindex, unavailable_after: 2024-01-01"></meta>

                </Head>
                <div className={styles.title} id="titlebg">
                    {articleArti.header_img &&
                        <Image width='1500' height='700' src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/pages/${articleArti.id}/${articleArti.header_img}`} alt="Article header image" />}
                    <div className={styles.headerstuff}>
                        <h1>{articleArti?.title || "unknown"}</h1>
                        <h4>Written by: <Link className={styles.authorlink} href={`/u/${articleArti.expand?.author?.username}`}>{articleArti.expand?.author?.username || "unknown"}</Link></h4>
                    </div></div>

                <h3>No data saved!</h3>

            </div>
        )
    }

    const { time, blocks, version } = savedData;
    return (
        <div className={styles.container}>
            <Head>
                <meta name="robots" content="noindex" />
                <meta name="robots" content="noindex, max-snippet:0, noarchive, notranslate, noimageindex, unavailable_after: 2024-01-01"></meta>

            </Head>
            <div className={styles.title} id="titlebg">
                {articleArti.header_img &&
                    <Image width='1500' height='700' src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/pages/${articleArti.id}/${articleArti.header_img}`} alt="Article header image" />}
                <div className={styles.headerstuff}>
                    <h1>{articleArti?.title || "unknown"}</h1>
                </div>
            </div>

            <ul className={styles.article}>
                {blocks?.map((block) => {
                    switch (block.type) {
                        case "simpleEmbeds":

                            return (
                                <li className={styles.block} key={block.id} style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                    <h5 style={{ color: 'rgb(255 140 140)', border: '1px dashed rgb(255 140 140)', padding: '5px' }}>Embed requires permision to view which is not supported yet!</h5>
                                </li>
                            );
                        case "paragraph":
                            return (
                                <li className={styles.block} key={block.id}>
                                    <span dangerouslySetInnerHTML={{ __html: block.data.text.replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>") }}></span>
                                </li>
                            );
                        case "header":
                            const Header = `h${block.data.level}`;
                            return (
                                <li className={styles.block} key={block.id}>
                                    <Header>{block.data.text}</Header>
                                </li>
                            );
                        case "list":
                            return (
                                <li className={styles.block} key={block.id}>
                                    {block.data.style === "ordered" ? (
                                        <ol className={styles.block_ol}>
                                            {block.data.items.map((item, index) => (
                                                <li key={index}>
                                                    <span dangerouslySetInnerHTML={{ __html: item.replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>") }}></span>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <ul className={styles.block_ul}>
                                            {block.data.items.map((item, index) => (
                                                <li key={index}>
                                                    <span dangerouslySetInnerHTML={{ __html: item.replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>") }}></span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );

                        case "attaches":
                            if (block.data.file.extension == "MP4" || block.data.file.extension == "mp4" || block.data.file.extension == "mov" || block.data.file.extension == "MOV") {
                                return (
                                    <li className={styles.block} key={block.id} style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                        <video controls style={{ width: '50%' }} src={block.data.file.url} alt={block.data.caption} />
                                    </li>
                                );
                            }
                            return (
                                <li className={styles.block} key={block.id}>
                                    <Link style={{ width: '20em' }} href={block.data.file.url} />
                                </li>
                            );
                        case "quote":
                            return (
                                <li className={styles.block} key={block.id}>
                                    <blockquote>{block.data.text}</blockquote>
                                </li>
                            );
                        case "table":
                            return (
                                <li className={styles.block} key={block.id}>
                                    <table style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                {block.data.content[0].map((header) => (
                                                    <th key={header}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {block.data.content.slice(1).map((row) => (
                                                <tr key={row.join()}>
                                                    {row.map((cell) => (
                                                        <td key={cell}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </li>
                            );
                        case "image":
                            return (
                                <li className={styles.block} key={block.id}>
                                    <img loading="lazy" className={styles.article_body_img} src={block.data.file.url} alt={block.data.caption} />
                                </li>
                            );
                        case "embed":
                            return (
                                <li className={styles.block} key={block.id}>
                                    <iframe loading="lazy" className={styles.article_body_embed} height={block.data.service === 'customPdf' ? ('500') : (block.data.height)} width='100%' src={block.data.embed} alt={block.data.caption} />
                                </li>
                            );
                        case "SimpleTodo":
                            return (
                                <ul className={`${styles.block} ${styles.todolist}`} key={block.id}>
                                    {block.data.items.map((item) => (
                                        <li className={styles.chkitem}>
                                            {item.checked ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"/></svg>) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/></svg>
                                            )}
                                            {item.content}

                                        </li>
                                    ))}
                                </ul>
                            )
                        default:
                            throw new Error('Unable to render component!')
                        //return null;
                    }
                })}
            </ul>

        </div>
    );
};


export async function getServerSideProps({ params }) {
    try {
        const record = await pb.collection('pages').getOne(params.id);
        return {
            props: {
                arti: JSON.stringify(record),
            },
        };
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: "/auth/login"
            }
        }
    }

}