import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { toast } from "react-toastify";
import Link from "next/link";
import styles from '@/styles/Article.module.css'
import Loader from "@/components/Loader";
import Image from "next/image";
import Head from "next/head";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function Viewer({ arti }) {
    const [articleData2, setArticleData] = useState([]);
    const [isError, setError] = useState(false)
    const [artiArticle, setArticle] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        async function fetchArticles() {
            try {
                const record = await pb.collection('pages').getOne(arti.article);
                setArticleData(record.content)
                setArticle(record)
                setIsLoading(false)
            } catch (error) {
                console.log(error);
                setError(true)
            }
        }
        async function authUpdate() {
            try {
                const authData = await pb.collection('users').authRefresh();
                if (!pb.authStore.isValid) {
                    pb.authStore.clear()
                }
            } catch (error) {
                pb.authStore.clear()
            }
            fetchArticles();
        }
        authUpdate()

    }, []);

    if (isLoading) {
        return (<Loader />)
    }

    if (isError) {
        return (<div>
            <Head>
                <title>Whoops!</title>
                <link rel="favicon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap" rel="stylesheet"></link>
            </Head>
            <div className={styles.containererror}>
                <h1>Article not found!</h1>
                <Link href="/">
                    <button className={styles.backbutton}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button></Link>
            </div>
        </div>)
    }

    return <><SavedData savedData={articleData2} articleArti={artiArticle} /></>
}

const SavedData = ({ savedData, articleArti }) => {

    if (!savedData) {
        return (
            <div className={styles.container}>
                <Head>
                    <meta name="robots" content="noindex" />
                    <meta name="robots" content="noindex, max-snippet:0, noarchive, notranslate, noimageindex, unavailable_after: 2024-01-01"></meta>

                </Head>
                <div className={styles.title}>
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
            <div className={styles.title}>
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
                                <li key={block.id} style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                    <iframe controls style={{ width: '50%' }} src={block.data.url} alt="File embed" />
                                </li>
                            );
                        case "paragraph":
                            return (
                                <li key={block.id}>
                                    <span dangerouslySetInnerHTML={{ __html: block.data.text.replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>") }}></span>
                                </li>
                            );
                        case "header":
                            const Header = `h${block.data.level}`;
                            return (
                                <li key={block.id}>
                                    <Header>{block.data.text}</Header>
                                </li>
                            );
                        case "list":
                            return (
                                <li key={block.id}>
                                    {block.data.style === "ordered" ? (
                                        <ol>
                                            {block.data.items.map((item, index) => (
                                                <li key={index}>
                                                    <span dangerouslySetInnerHTML={{ __html: item.replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>") }}></span>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <ul>
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
                                    <li key={block.id} style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                        <video controls style={{ width: '50%' }} src={block.data.file.url} alt={block.data.caption} />
                                    </li>
                                );
                            }
                            return (
                                <li key={block.id}>
                                    <Link style={{ width: '20em' }} href={block.data.file.url} />
                                </li>
                            );
                        case "quote":
                            return (
                                <li key={block.id}>
                                    <blockquote>{block.data.text}</blockquote>
                                </li>
                            );
                        case "table":
                            return (
                                <li key={block.id}>
                                    <table>
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
                                <li key={block.id}>
                                    <img loading="lazy" className={styles.article_body_img} src={block.data.file.url} alt={block.data.caption} />
                                </li>
                            );
                        case "embed":
                            return (
                                <li key={block.id}>
                                    <iframe loading="lazy" className={styles.article_body_embed} height={block.data.service === 'customPdf' ? ('500') : (block.data.height)} width='100%' src={block.data.embed} alt={block.data.caption} />
                                </li>
                            );
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
    return {
        props: {
            arti: { article: params.id },
        },
    };
}