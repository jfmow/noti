import { StrictMode, Suspense, lazy, useEffect, useRef, useState } from "react"
import Head from "next/head";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import styles from "@/styles/Create.module.css";
import Video from '@/customEditorTools/Video'
import compressImage from "@/lib/CompressImg";
import Router from "next/router";
import NestedList from '@editorjs/nested-list';
import MarkerTool from "@/customEditorTools/Marker";
import Image from "@/customEditorTools/Image";
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
import LineBreak from "@/customEditorTools/LineBreak";
import { handleCreateBlurHash } from '@/lib/idk'
import { toaster } from "../toasty";
import { useEditorContext } from "@/pages/page/[...id]";
import { Paragraph, SubmitButton } from "../UX-Components";
import { Modal } from "@/lib/Modals/Modal";
import { debounce } from "lodash";
import { updateListedPages } from "../Item";

const MenuButtons = lazy(() => import("./Menu/MenuButton"))
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
    const [multiPageModal, setMultiPageModal] = useState({ active: false, records: [] })
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
                setListedPageItems(updateListedPages(currentPage, { icon: newIcon.image }, listedPageItems))
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
                setListedPageItems(updateListedPages(currentPage, { color: newColor }, listedPageItems))

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
        if (!noSaving && !loading) {
            let retryCount = 0

            // Function to save the article after the specified delay
            const saveArticle = async () => {
                if (currentPage === "firstopen") {
                    return
                }
                try {
                    if (EditorRef.current) {
                        const articleContent = await EditorRef.current.save();
                        let formData = new FormData();

                        formData.append("content", JSON.stringify(articleContent));
                        try {

                            const state = await pb.collection("pages").update(currentPage, formData);
                            if (JSON.stringify(state.content) === JSON.stringify(articleContent)) {
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
                            toaster.toast("Could not save", "error");
                            console.error(error);
                        }
                        //console.log("Auto-save executed.");
                    }
                } catch (error) {
                    console.log(error)
                    toaster.toast("Could not save", "error")
                }

            };
            const debounceSave = debounce(saveArticle, 500)


            if (editorRef && editorRef.current && !loading) {
                try {
                    editorRef.current.addEventListener("keyup", debounceSave);
                } catch {

                }
            }

            return () => {
                // Clean up the event listeners and timer on component unmount
                if (editorRef) {
                    try {
                        editorRef.current.removeEventListener("keyup", debounceSave);
                    } catch { }
                }
            };
        }

    }, [lastTypedTime, editorRef, loading]);

    useEffect(() => {
        async function loadData() {
            if (currentPage === 'firstopen') {
                return
            }
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
            } catch {
                try {
                    if (currentPage.length <= 2) {
                        setMultiPageModal({ ...multiPageModal, active: true, records: [{ title: 'Title too short', id: 'firstopen' }] })
                        setLoading(false)
                        return
                    }
                    const records = await pb.collection('pages').getFullList({
                        sort: '-created', filter: `title ?~ "${currentPage.toLowerCase()}"`, skipTotal: true
                    });
                    console.log(records)
                    if (records.length >= 2) {
                        setMultiPageModal({ ...multiPageModal, active: true, records: records })
                        setLoading(false)
                        return
                    }
                    const record = records[0]

                    Router.push('/page/' + record.id)
                } catch (err) {
                    //console.log(err)
                    toaster.info(
                        "Unable to find a page with that id"
                    );
                    Router.push('/page/firstopen')
                }
            }
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
                                            const loadingToast = toaster.loading("Uploading...")
                                            const formData = new FormData();
                                            formData.append("file_data", file);
                                            formData.append("uploader", pb.authStore.model.id);
                                            formData.append('page', currentPage)
                                            let record = null
                                            try {
                                                if (file.size > 5242880) {
                                                    toaster.error('File too big. Must be < 5mb')
                                                    return { success: 0 }
                                                }
                                                if (file.name.endsWith(".docx") || file.name.endsWith(".docx/")) {
                                                    toaster.error('File type not supported yet!')
                                                    return { success: 0 }
                                                }
                                                record = await pb.collection("files").create(formData);
                                                //console.log(record);
                                                toaster.dismiss(loadingToast)
                                                toaster.success("File uploaded successfully!")

                                            } catch (error) {
                                                toaster.dismiss(loadingToast)
                                                console.error(error);
                                                if (error.data.code === 403) {
                                                    toaster.error(error.data.message, { delay: 7000 })
                                                    return { success: 0 }
                                                }
                                                toaster.error('Unable to upload file. It may not be supported yet. Try .pdf or images')
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
                    autofocus: content && content?.blocks?.length >= 1 && (content?.blocks[0]?.type === 'image' || content?.blocks[0]?.type === 'Video' || content?.blocks[0]?.type === 'simpleEmbeds' || content?.blocks[0]?.type === 'SimpleIframeWebpage') ? false : true,
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
        setListedPageItems(updateListedPages(currentPage, { title: data }, listedPageItems))

        await pb.collection("pages").update(currentPage, {
            title: data
        });
    }

    if (multiPageModal.active) {
        return (
            <>
                <Modal>
                    <h1>Multiple pages found!</h1>
                    <Paragraph>
                        Looks like theres multiple pages with that name. Please select one from the list below to open.
                    </Paragraph>
                    <div style={{ maxHeight: '190px', overflowY: 'scroll' }}>
                        {multiPageModal.records.map((item) => (
                            <div onClick={() => {
                                setMultiPageModal({ active: false })
                                Router.push(`/page/${item.id}`)
                            }} style={{ display: 'flex', gap: '7px', alignItems: 'center', cursor: 'pointer' }}>
                                <div aria-label='Page icon' style={{ display: 'flex', width: '16px', height: '16px' }}>
                                    {item.icon && item.icon.includes('.png') ? (<img className={styles.item_icon} src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}
                                </div>
                                <p>{item.title}</p>
                            </div>
                        ))}
                    </div>
                    <SubmitButton onClick={() => setMultiPageModal({ ...multiPageModal, active: false })}>
                        Cancel
                    </SubmitButton>
                </Modal>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>{title || currentPage}</title>
            </Head>
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
                                <Suspense fallback={<></>}>
                                    <MenuButtons setHeader={setHeader} updateHeader={updateCurrentPage.headerCustomImg} updateIcon={updateCurrentPage.icon} updateColor={updateCurrentPage.color} />
                                </Suspense>
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