import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "@/components/Link";
import { toast } from "sonner";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import PocketBase from "pocketbase";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import styles from "@/styles/Create.module.css";
import Loader from "./Loader";
import { createRandomMeshGradients } from "@/lib/randomMeshGradient";
import NestedList from '@editorjs/nested-list';
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
import LineBreak from "@/customEditorTools/LineBreak";

import { handleBlurHashChange } from '@/lib/idk'
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import { toaster } from "./toast";



const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)

function Editor({ page, multi }) {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const [editorData, setEditorData] = useState({});
    const [isError, setError] = useState(false);
    const [articleTitle, setArticleTitle] = useState("");
    const [articleHeader, setArticleHeader] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastTypedTimeIdle, setLastTypedTimeIdle] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [ownerData, setOwnerData] = useState({
        "avatar": "",
        "collectionId": "",
        "collectionName": "",
        "created": "",
        "id": "",
        "last_active": "",
        "time_zone": "",
        "updated": "",
        "usage_email_sent": false,
        "username": "",
        "verified": false
    })

    const pagetitleref = useRef(null)

    useEffect(() => {
        if (page) {
            setLastTypedTimeIdle(true);
            setError(false);
            setIsLoading(true);
            setIsSaving(false)
            setEditorData(null)
            setArticleTitle('Untitled')
            setArticleHeader(null)
            async function fetchArticles() {
                try {
                    const record = await pb.collection("pages").getOne(page, { expand: 'owner' });
                    setOwnerData(record.expand?.owner)
                    setEditorData(record.content);
                    setArticleTitle(record.title);
                    if (record.header_img) {
                        setArticleHeader(
                            `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/pages/${page}/${record.header_img}`
                        );
                    } else {
                        setArticleHeader(record.unsplash);
                    }
                    setError(false);
                    setIsLoading(false);
                } catch (error) {
                    toaster.error(
                        "Page not found"
                    );
                    console.error(error);
                    setError(true);
                    setIsLoading(false);
                }
            }

            fetchArticles();
        } else {
            setError(true);
            setIsLoading(false);
        }
    }, [page]);



    useEffect(() => {
        //set a colorful header
        const headerbg = createRandomMeshGradients()
        if (document.getElementById('titlebg') && !articleHeader) {
            document.getElementById('titlebg').style.backgroundColor = headerbg.bgColor
            document.getElementById('titlebg').style.backgroundImage = headerbg.bgImage
        }
    }, [document.getElementById('titlebg')])



    useEffect(() => {
        if (
            editorRef.current &&
            (editorData == null || Object.keys(editorData).length > 0)
        ) {
            const editorInstance = new EditorJS({
                holder: editorRef.current,
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                    },
                    simpleEmbeds: {
                        class: SimpleIframe,
                        inlineToolbar: true,

                    },
                    SimpleIframeWebpage: {
                        class: SimpleIframeWebpage
                    },

                    CheckList: {
                        class: Checklist,
                        inlineToolbar: true,
                    },

                    InlineCode: {
                        class: InlineCode,
                        shortcut: 'CMD+SHIFT+M',
                    },
                    nestedList: {
                        class: NestedList,
                        inlineToolbar: true,
                        config: {
                            defaultStyle: 'unordered'
                        },
                    },

                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                    },

                    image: {
                        class: Image,
                    },
                    table: {
                        class: Table,
                        inlineToolbar: true,
                    },
                    break: {
                        class: LineBreak,
                    }
                },
                data: editorData,
                placeholder: "No content found!",
                readOnly: true,
            });

            setEditor(editorInstance, () => {
                // Cleanup logic
                if (editor) {
                    try {
                        editor.destroy();
                    } catch (err) {
                        console.warn(err);
                        toaster.error(`Reloading editor`);
                        setIsLoading(true);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1200);
                    }
                }
            });
        }
    }, [editorData, page]);



    if (isError) {
        return (
            <div>
                <Head>
                    <title>Whoops!</title>
                    <link rel="favicon" href="/Favicon.png" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap"
                        rel="stylesheet"
                    ></link>
                </Head>
                <div className={styles.containererror}>
                    <h1>Page not found!</h1>
                    <Link href="/">
                        <button className={styles.backbutton}>
                            <svg
                                height="16"
                                width="16"
                                xmlns="http://www.w3.org/2000/svg"
                                version="1.1"
                                viewBox="0 0 1024 1024"
                            >
                                <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
                            </svg>
                            <span>Back</span>
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={styles.create}>
            <Head>
                <title>Page: {articleTitle}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/Favicon.png" />
            </Head>
            <div className={styles.ownerbox}>
                <img src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${ownerData?.id}/${ownerData?.avatar}`} />
                {ownerData?.username}
            </div>
            <div className={styles.title}>
                <div className={styles.title} id="titlebg">
                    {articleHeader && <img className={styles.articleTitle_img} src={articleHeader} alt="Page header img" />}
                    <div className={styles.headerstuff}>
                        <div className={styles.titleeditorcontainer}>
                            <div
                                className={styles.titleinput}
                                type="text"
                                ref={pagetitleref}
                            >
                                {articleTitle ? articleTitle : "Untitled"}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className={`${styles.creategrid} ${multi && styles.creategrid_lock}`}>
                <div className={styles.form}>
                    <div className={styles.editor} ref={editorRef}></div>
                </div>
            </div>
        </div>
    );
}

export default Editor;


class SimpleTodo {
    static get toolbox() {
        return {
            title: "Todo",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><path d="M22,8c0-0.55-0.45-1-1-1h-7c-0.55,0-1,0.45-1,1s0.45,1,1,1h7C21.55,9,22,8.55,22,8z M13,16c0,0.55,0.45,1,1,1h7 c0.55,0,1-0.45,1-1c0-0.55-0.45-1-1-1h-7C13.45,15,13,15.45,13,16z M10.47,4.63c0.39,0.39,0.39,1.02,0,1.41l-4.23,4.25 c-0.39,0.39-1.02,0.39-1.42,0L2.7,8.16c-0.39-0.39-0.39-1.02,0-1.41c0.39-0.39,1.02-0.39,1.41,0l1.42,1.42l3.54-3.54 C9.45,4.25,10.09,4.25,10.47,4.63z M10.48,12.64c0.39,0.39,0.39,1.02,0,1.41l-4.23,4.25c-0.39,0.39-1.02,0.39-1.42,0L2.7,16.16 c-0.39-0.39-0.39-1.02,0-1.41s1.02-0.39,1.41,0l1.42,1.42l3.54-3.54C9.45,12.25,10.09,12.25,10.48,12.64L10.48,12.64z"/></g></svg>',
        };
    }

    constructor({ data, config, readOnly }) {
        this.data = data || {
            items: []
        };
        this.wrapper = undefined;
        this.config = config;
        this.readOnly = readOnly
    }

    render() {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add(styles.todo_container);

        const list = document.createElement("ul");
        list.classList.add(styles.todolist);

        if (this.data && this.data.items) {
            this.data.items.forEach((item, index) => {
                const listItem = document.createElement("li");

                const label = document.createElement("label");
                label.classList.add(styles.todocontainer);

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = item.checked;

                const checkmark = document.createElement("div");
                checkmark.classList.add(styles.todocheckmark);

                label.appendChild(checkbox);
                label.appendChild(checkmark);

                listItem.appendChild(label);

                const content = document.createElement("span");
                content.textContent = item.content;

                listItem.appendChild(content);


                list.appendChild(listItem);
            });
        } else {
            this.data = { items: [] };
        }



        this.wrapper.appendChild(list)

        return this.wrapper;
    }

    static get isReadOnlySupported() {
        return true;
    }

}

class Image {
    static get toolbox() {
        return {
            title: "Image",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"></rect><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.7778 9.33331H13.7867"></path></svg>',
        };
    }

    constructor({ data, config, readOnly }) {
        this.data = data;
        this.wrapper = undefined;
        this.config = config || {};
        this.readOnly = readOnly
    }

    render() {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("simple-image");

        if (this.data.file?.url) {
            function extractStringFromURL(url) {
                const regex = /\/([^/]+)\/[^/]+$/;
                const match = url.match(regex);
                if (match) {
                    return match[1];
                } else {
                    return null; // or you can return an error message or handle the case differently
                }
            }

            // Example usage:
            const url = this.data.file.url
            const extractedString = extractStringFromURL(url);
            //console.log(extractedString); // Output: t09edrg2ayd247o
            this._createImage(extractedString);
            return this.wrapper;
        }

        if (this.data && this.data.fileId) {
            //const originalUrl = decodeURIComponent(this.data.url).replace(
            //  /&amp;/g,
            //  "&"
            //);
            this._createImage(this.data);
            return this.wrapper;
        }


    }


    async _createImage(file) {
        const iframe = document.createElement("img");
        iframe.classList.add(styles.embedIframe);
        iframe.style.width = "100%";
        iframe.style.maxHeight = "50vh";
        iframe.style.objectFit = 'contain';
        iframe.style.borderRadius = "5px";
        if (file.blurHashData) {
            const blurHash = handleBlurHashChange(file.blurHashData)
            iframe.src = blurHash
            this.wrapper.innerHTML = "";
        }
        //const fileToken = await pb.files.getToken();
        // retrieve an example protected file url (will be valid ~5min)
        try {
            const record = await pb.collection('imgs').getOne(file.fileId); // Use the fileId to retrieve the record
            const url = pb.files.getUrl(record, record.file_data);
            iframe.src = url;
            iframe.setAttribute('fileId', file.fileId); // Set the fileId as an attribute of the iframe
            this.wrapper.innerHTML = "";
        } catch (err) {
            this.wrapper.innerText = `Cannot display image here.`;
        }
        this.wrapper.appendChild(iframe);
    }

    static get isReadOnlySupported() {
        return true;
    }

}

//END custom editorjs plugins