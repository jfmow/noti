import { StrictMode, useEffect, useRef, useState } from "react"
import Head from "next/head";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import PocketBase from "pocketbase";
import styles from "@/styles/Create.module.css";
import Video from '@/customEditorTools/Video'
import Loader from "../Loader";
import compressImage from "@/lib/CompressImg";
import Router from "next/router";
import { createRandomMeshGradients } from "@/lib/randomMeshGradient";
import NestedList from '@editorjs/nested-list';
import MarkerTool from "@/customEditorTools/Marker";
import Image from "@/customEditorTools/Image";
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
import LineBreak from "@/customEditorTools/LineBreak";
import { handleCreateBlurHash } from '@/lib/idk'
import MenuButtons from "./Menu/MenuButton";
import { toaster } from "../toasty";
import { useEditorContext } from "@/pages/page/[...id]";
import { Paragraph, SubmitButton } from "../UX-Components";
import { Modal } from "@/lib/Modals/Modal";
import { Cache } from "@/lib/Cache";
import { debounce } from "lodash";
export default function Editor() {
    const { currentPage, listedPageItems, setListedPageItems, pb, noSaving } = useEditorContext();
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState({})
    const pageId = useRef(null)
    const [title, setTitle] = useState('')
    const [icon, setIcon] = useState('')
    const [header, setHeader] = useState(null)
    const [updated, setUpdated] = useState('')
    const [Editor, _setEditor] = useState(null)
    const [lastTypedTime, setLastTypedTime] = useState(Date.now());
    const [lastTypedTimeIdle, setLastTypedTimeIdle] = useState(false);
    const editorRef = useRef(null)
    const EditorRef = useRef(null)
    const setEditor = (v) => {
        EditorRef.current = v
        _setEditor(v)
    }

    const updateCurrentPage = {
        async icon(newIcon = '') {
            if (!newIcon) {
                return new Error('Please include a new icon')
            }
            try {
                setListedPageItems(prevItems => {
                    // Remove any previous item with the same ID
                    const oldItem = listedPageItems.filter((item) => item.id === currentPage)[0]
                    if (!oldItem) {
                        return [...prevItems]
                    }
                    const filteredItems = prevItems.filter(item => item.id !== oldItem.id);

                    // Add the new record at the appropriate position based on its created date
                    let insertIndex = filteredItems.findIndex(item => item.created < oldItem.created);
                    if (insertIndex === -1) {
                        insertIndex = filteredItems.length;
                    }

                    return [
                        ...filteredItems.slice(0, insertIndex),
                        { ...oldItem, icon: newIcon.image },
                        ...filteredItems.slice(insertIndex)
                    ];

                })
                await pb.collection('pages').update(currentPage, { icon: newIcon.image });
            } catch {
                return new Error('Something went wrong updating the page icon')
            }

        },
        async color(newColor = '') {
            console.log(newColor)
            if (!newColor) {
                return new Error('No color provided')
            }
            try {
                setListedPageItems(prevItems => {
                    // Remove any previous item with the same ID
                    const oldItem = listedPageItems.filter((item) => item.id === currentPage)[0]
                    if (!oldItem) {
                        return [...prevItems]
                    }
                    const filteredItems = prevItems.filter(item => item.id !== oldItem.id);

                    // Add the new record at the appropriate position based on its created date
                    let insertIndex = filteredItems.findIndex(item => item.created < oldItem.created);
                    if (insertIndex === -1) {
                        insertIndex = filteredItems.length;
                    }

                    return [
                        ...filteredItems.slice(0, insertIndex),
                        { ...oldItem, color: newColor },
                        ...filteredItems.slice(insertIndex)
                    ];

                })
                await pb.collection('pages').update(currentPage, { color: newColor });
            } catch {
                return new Error('An error occured while updating page color')
            }
        },
        async headerCustomImg(e) {
            toaster.toast("Uploading...", "loading", { id: "upload" })

            const file = e.target.files[0];

            const reader = new FileReader();
            reader.onload = (event) => {
                setHeader(event.target.result);
            };
            reader.readAsDataURL(file);
            let formData = new FormData();
            if (file) {

                try {
                    const compressedBlob = await compressImage(file, 200); // Maximum file size in KB (100KB in this example)
                    const compressedFile = new File([compressedBlob], file.name, {
                        type: "image/jpeg",
                    });
                    formData.append("header_img", compressedFile);
                    formData.append("unsplash", '');
                    //if (compressedFile.size > 4547000) {
                    //    return toast.error('Compresed file may be too big (>4.5mb)!')
                    //}
                    await pb.collection("pages").update(currentPage, formData);

                    toaster.dismiss("upload")
                    toaster.toast("Image uploaded successfully!", "success")

                } catch (error) {
                    toaster.dismiss("upload")
                    toaster.toast("Error uploading header img", "error");
                }
            }
        }
    }

    useEffect(() => {
        if (!noSaving) {
            let timer;
            let retryCount = 0

            // Function to save the article after the specified delay
            const saveArticle = async () => {
                if (currentPage === "firstopen") {
                    return
                }
                const currentTime = Date.now();
                const elapsedTime = currentTime - lastTypedTime;

                if (elapsedTime >= 500 && !lastTypedTimeIdle) {
                    // Auto-save 3 seconds after the user stops typing
                    setLastTypedTimeIdle(true);
                    try {
                        if (EditorRef.current) {
                            const articleContent = await EditorRef.current.save();
                            let formData = new FormData();

                            formData.append("content", JSON.stringify(articleContent));
                            try {

                                const state = await pb.collection("pages").update(currentPage, formData);
                                if (JSON.stringify(state.content) === JSON.stringify(articleContent)) {
                                    setLastTypedTimeIdle(true);
                                    return
                                } else {
                                    if (retryCount >= 4) {
                                        toaster.error('Page failed to save too many times. Please check your network.')
                                        retryCount = 0
                                        return
                                    }
                                    retryCount++
                                    saveArticle()
                                }
                                //console.log("Auto saved successfully!");
                            } catch (error) {
                                toaster.toast("Could not auto save!", "error");
                                console.error(error);
                            }
                            //console.log("Auto-save executed.");
                        }
                    } catch (error) {
                        console.log(error)
                        toaster.toast("Could not auto save!", "error")
                    }
                }
            };

            // Function to update the last typing timestamp
            const updateLastTypedTime = () => {
                setLastTypedTime(Date.now());
            };

            // Event listener for detecting user typing
            const typingEventListener = () => {
                updateLastTypedTime();
                setLastTypedTimeIdle(false);
            };
            // Attach event listeners
            if (editorRef) {
                try {
                    editorRef.current.addEventListener("keyup", typingEventListener);
                } catch { }
            }
            //window.addEventListener("mousemove", mouseMovementEventListener);

            // Start the auto-save timer
            timer = setTimeout(() => {
                saveArticle();
            }, 500); // Initial auto-save 3 seconds after component mount

            return () => {
                // Clean up the event listeners and timer on component unmount
                if (editorRef) {
                    try {
                        editorRef.current.removeEventListener("keyup", typingEventListener);
                    } catch { }
                }
                //window.removeEventListener("mousemove", mouseMovementEventListener);
                clearTimeout(timer);
            };
        }

    }, [lastTypedTime, editorRef.current]);

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                const record = await pb.collection('pages').getOne(currentPage);
                setContent(record.content || {})
                setTitle(record.title || '')
                setIcon(record?.icon || '')
                setHeader(record?.header_img ? `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/${record.collectionId}/${record.id}/${record?.header_img}` : record?.unsplash ? record?.unsplash : null)
                setUpdated(record.updated)
                pageId.current = { data: record.id, curr: currentPage }
                //console.log(record.id, currentPage)
            } catch { }
        }
        loadData()
    }, [currentPage])

    useEffect(() => {
        //console.log(Editor, content, editorRef.current)
        try {

            if (editorRef.current && (content == null || content)) {
                if (Editor) {
                    try {
                        Editor.clear()
                        Editor.destroy()
                    } catch { }
                }
                const editor = new EditorJS({
                    holder: editorRef.current,
                    tools: {
                        header: {
                            class: Header,
                            inlineToolbar: true,
                        },
                        marker: {
                            class: MarkerTool,
                        },
                        image: {
                            class: Image,
                            config: {
                                saveData: {
                                    saveAll() {
                                        setLastTypedTime(Date.now());
                                        setLastTypedTimeIdle(false);
                                        return
                                    }
                                },
                                storeFile: {
                                    uploadFile(file) {
                                        async function uploadbyFile(file) {
                                            toaster.toast("Uploading...", "loading", { id: "uploadToast" })
                                            const formData = new FormData();

                                            const compressedBlob = await compressImage(file); // Maximum file size in KB (100KB in this example)
                                            const compressedFile = new File(
                                                [compressedBlob],
                                                file.name,
                                                { type: "image/jpeg" }
                                            );
                                            const result = await handleCreateBlurHash(compressedFile);
                                            console.log("Result:", result); // Access result.hash, result.width, and result.height

                                            formData.append("file_data", compressedFile);
                                            formData.append("uploader", pb.authStore.model.id);
                                            formData.append('page', currentPage)
                                            let record = null
                                            try {
                                                if (compressedFile.size > 5242880) {
                                                    toaster.error('File too big. Must be < 5mb')
                                                    return { success: 0 }
                                                }
                                                record = await pb.collection("imgs").create(formData);
                                                toaster.dismiss("uploadToast")
                                                toaster.toast("Image uploaded successfully!", "success")
                                            } catch (error) {
                                                toaster.dismiss("uploadToast")
                                                if (error.data.code === 403) {
                                                    toaster.toast(error.data.message, "error")
                                                    return { success: 0 }
                                                }
                                                toaster.toast('Unable to upload file', "error")
                                                return { success: 0 }
                                            }

                                            return {
                                                success: 1,
                                                file: {
                                                    fileId: record.id,
                                                    blurHashData: result
                                                },
                                            };
                                        }
                                        return uploadbyFile(file)
                                    },
                                },
                                currPage: currentPage

                            },

                        },
                        nestedList: {
                            class: NestedList,
                            inlineToolbar: true,
                            config: {
                                defaultStyle: 'unordered'
                            },
                        },
                        CheckList: {
                            class: Checklist,
                            inlineToolbar: true,
                        },
                        simpleEmbeds: {
                            class: SimpleIframe,
                            inlineToolbar: true,
                            config: {
                                saveData: {
                                    saveAll() {
                                        setLastTypedTime(Date.now());
                                        setLastTypedTimeIdle(false);
                                        return
                                    }
                                },
                                storeFile: {
                                    uploadFile(file) {
                                        async function uploadbyFile(file) {
                                            const loadingToast = toaster.toast("Uploading...", "loading", { id: "uploadToast" })
                                            const formData = new FormData();
                                            formData.append("file_data", file);
                                            formData.append("uploader", pb.authStore.model.id);
                                            formData.append('page', currentPage)
                                            let record = null
                                            try {
                                                if (file.size > 5242880) {
                                                    toast.error('File too big. Must be < 5mb')
                                                    return { success: 0 }
                                                }
                                                if (file.name.endsWith(".docx") || file.name.endsWith(".docx/")) {
                                                    toast.error('File type not supported yet!')
                                                    return { success: 0 }
                                                }
                                                record = await pb.collection("files").create(formData);
                                                //console.log(record);
                                                toaster.dismiss("uploadToast")
                                                toaster.toast("File uploaded successfully!", "success")

                                            } catch (error) {
                                                toast.dismiss(loadingToast)
                                                console.error(error);
                                                if (error.data.code === 403) {
                                                    toaster.toast(error.data.message, "error")
                                                    return { success: 0 }
                                                }
                                                toaster.toast('Unable to upload file. It may not be supported yet. Try .pdf or images', "error")
                                                return { success: 0 }
                                                // Handle error
                                            }

                                            return {
                                                success: 1,
                                                file: {
                                                    recid: record.id,
                                                },
                                            };
                                        }
                                        return uploadbyFile(file)
                                    },
                                }

                            }
                        },
                        table: {
                            class: Table,
                            inlineToolbar: true,
                        },
                        SimpleIframeWebpage: {
                            class: SimpleIframeWebpage,
                        },
                        Video: {
                            class: Video
                        },
                        InlineCode: {
                            class: InlineCode,
                            shortcut: 'CMD+SHIFT+M',
                        },


                        quote: {
                            class: Quote,
                            inlineToolbar: true,
                        },

                        break: {
                            class: LineBreak,
                        },
                        list: {
                            class: List,
                            inlineToolbar: true,
                        },
                    },
                    data: content || [],
                    placeholder: "Enter some text...",
                    autofocus: content?.blocks?.length >= 1 && (content?.blocks[0]?.type === 'image' || content?.blocks[0]?.type === 'Video' || content?.blocks[0]?.type === 'simpleEmbeds' || content?.blocks[0]?.type === 'SimpleIframeWebpage') ? false : true,
                })
                editor.isReady.then(() => {
                    //console.log('Ready')
                    setEditor(editor)
                    setLoading(false)
                })
            }
        } catch (err) {
            //console.log(err)
            toaster.error(err)
        }
    }, [content])

    async function handlePageTitleChange(e) {
        const data = e.target.innerText;
        setTitle(data)
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const oldItem = listedPageItems.filter((item) => item.id === currentPage)[0]
            const filteredItems = prevItems.filter(item => item.id !== oldItem.id);

            // Add the new record at the appropriate position based on its created date
            let insertIndex = filteredItems.findIndex(item => item.created < oldItem.created);
            if (insertIndex === -1) {
                insertIndex = filteredItems.length;
            }

            return [
                ...filteredItems.slice(0, insertIndex),
                { ...oldItem, title: data },
                ...filteredItems.slice(insertIndex)
            ];
            //return [...prevItems.filter(item => item.id !== page), { ...oldItem, icon: `${e.unified}.png` }]
        })
        await pb.collection("pages").update(currentPage, {
            title: data
        });
    }

    return (
        <>
            <div className={styles.create} id="createcon">
                <div className={styles.title}>
                    <div className={styles.title} id="titlebg">
                        {header && <img className={styles.articleTitle_img} src={header} alt="Page header img" />}
                        <div className={styles.headerstuff}>
                            <div className={styles.titleeditorcontainer}>
                                <div
                                    className={styles.titleinput}
                                    contentEditable
                                    type="text"
                                    onBlur={(e) => { handlePageTitleChange(e) }}
                                    id="tuttitle"
                                    aria-label="Page title"
                                >
                                    {title || "Untitled"}
                                </div>
                            </div>
                            <div className={styles.title_buttons} id="tut_title_btns_id">

                                <MenuButtons setHeader={setHeader} updateHeader={updateCurrentPage.headerCustomImg} updateIcon={updateCurrentPage.icon} updateColor={updateCurrentPage.color} />

                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.creategrid}`}>
                    <div className={styles.form}>
                        {loading && (
                            <div className={styles.load}>
                                <div />
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                        )}
                        <div className={styles.editor} style={loading ? { display: 'none' } : {}} ref={editorRef} id="content"></div>
                    </div>
                </div>
            </div>
        </>
    )
}




//Readme.md

/**
 * Strict mode prevents 2 editors being rendered in dev mode, or it should
 * 
 */