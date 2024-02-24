import Head from "next/head";
import { Suspense, createContext, useContext, useEffect, useRef, useState } from "react";
import { lazy } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
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
import { toaster } from "@/components/toast";
import { useEditorContext } from "@/pages/page";
import { Paragraph } from "../UX-Components";
import { Modal, ModalContent } from "@/lib/Modals/Modal";
import { debounce } from "lodash";
import Loader from "../Loader";
const MenuButtons = lazy(() => import("./Menu/MenuButton"))

const editorV3Context = createContext();
export default function EditorV3({ currentPage, peek }) {
    const { pb, setListedPageItems, setPrimaryVisiblePageData } = useEditorContext()
    const Editor = useRef(null)
    const SaveRef = useRef(null)

    const [openPageData, setOpenPageData] = useState([])
    const [multiRecordSearch, setMultiRecordSearch] = useState({ state: false, records: [] })
    const [loading, setLoading] = useState(false)
    const [saving, setSavingState] = useState("")


    useEffect(() => {
        //Check that there is a current page
        if (currentPage) {
            async function RetriveOpenPageData(page) {
                /**
                 * Uses the pocketbase js sdk to query the db for the record with the id `page`
                 * It then sets the state value with the returned record.
                 * This record contains all the data, title, owner, content, header images etc
                 */
                setLoading(true)
                try {
                    const record = await pb.collection('pages').getOne(page)
                    setLoading(false)
                    setOpenPageData(record)
                    if (!peek) {
                        setPrimaryVisiblePageData(record)
                    }
                } catch {
                    try {
                        const altRecord = await pb.collection('pages').getFullList({ sort: '-created', filter: `title ?~ '${currentPage}'` })
                        if (!altRecord || altRecord.length === 0) {
                            Router.push('/page')
                            return
                        }
                        if (altRecord.length === 1) {
                            Router.push(altRecord[0].id)
                        } else {
                            setMultiRecordSearch({ state: true, records: altRecord })
                        }

                    } catch {
                        Router.push("/page")
                    }
                }
            }
            RetriveOpenPageData(currentPage)
        }
    }, [currentPage])

    useEffect(() => {
        try {
            if (openPageData?.id) {
                if (Editor) {
                    try {
                        Editor.clear()
                        Editor.destroy()
                    } catch { }
                }
                let editorContainer
                if (document.getElementById(`editorjs-editor-${currentPage}`).childElementCount >= 1) {
                    console.log("A")
                    return
                } else {
                    editorContainer = document.createElement("div")
                    document.getElementById(`editorjs-editor-${currentPage}`).appendChild(editorContainer)
                }
                const editor = new EditorJS({
                    holder: editorContainer,
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
                                storeFile: {
                                    uploadFile(file) {
                                        async function uploadbyFile(file) {
                                            const loadingToast = await toaster.loading("Uploading...")
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
                                                    toaster.update(loadingToast, 'File too big. Must be < 5mb', "error")
                                                    return { success: 0 }
                                                }
                                                record = await pb.collection("files").create(formData);
                                                toaster.update(loadingToast, "Image uploaded successfully!", "success")
                                            } catch (error) {
                                                if (error.data.code === 403) {
                                                    toaster.update(loadingToast, error.data.message, "error")
                                                    return { success: 0 }
                                                }
                                                toaster.update(loadingToast, 'Unable to upload file', "error")
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
                                storeFile: {
                                    uploadFile(file) {
                                        async function uploadbyFile(file) {
                                            const loadingToast = await toaster.loading("Uploading...")
                                            const formData = new FormData();
                                            formData.append("file_data", file);
                                            formData.append("uploader", pb.authStore.model.id);
                                            formData.append('page', currentPage)
                                            let record = null
                                            try {
                                                if (file.size > 5242880) {
                                                    toaster.update(loadingToast, 'File too big. Must be < 5mb', "error")
                                                    return { success: 0 }
                                                }
                                                if (!file.name.endsWith(".pdf")) {
                                                    toaster.update(loadingToast, 'File type not supported yet!', "error")
                                                    return { success: 0 }
                                                }
                                                record = await pb.collection("files").create(formData);
                                                //console.log(record);
                                                toaster.update(loadingToast, "File uploaded successfully!", "success")

                                            } catch (error) {
                                                if (error.data.code === 403) {
                                                    toaster.update(loadingToast, error.data.message, "error")
                                                    return { success: 0 }
                                                }
                                                toaster.update(loadingToast, 'Only pdf files are currently supported for this function', "error")
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
                    data: openPageData?.content || [],
                    placeholder: "Enter some text...",
                    autofocus: openPageData?.content && openPageData?.content?.blocks?.length >= 1 && (openPageData?.content?.blocks[0]?.type === 'image' || openPageData?.content?.blocks[0]?.type === 'Video' || openPageData?.content?.blocks[0]?.type === 'simpleEmbeds' || openPageData?.content?.blocks[0]?.type === 'SimpleIframeWebpage') ? false : true,
                    onChange: (api, event) => {
                        setSavingState("Unsaved")
                    }
                })
                editor.isReady.then(() => {
                    console.log('Ready')
                    Editor.current = editor
                    setLoading(false)
                })
            }
        } catch (err) {
            console.log(err)
            toaster.error(err)
        }
    }, [openPageData])

    useEffect(() => {
        /**
         * The logic for auto save
         */

        async function Save() {
            try {
                setSavingState("Saving...")
                const content = await Editor.current.save()
                const res = await pb.collection('pages').update(currentPage, { "content": content })
                setSavingState("Saved")
            } catch (err) {
                setSavingState("Unable to save file...")
                toaster.error(err?.message || err)
            }
        }

        const debounceSave = debounce(Save, 300)

        try {
            if (SaveRef && SaveRef.current && !loading) {
                SaveRef.current.addEventListener("keyup", debounceSave)
                SaveRef.current.addEventListener('keydown', async function (event) {
                    if (event.ctrlKey && event.key === 's') {
                        event.preventDefault()
                        const loadingToast = await toaster.loading("Manual save...")
                        debounceSave.cancel()
                        await Save()
                        toaster.dismiss(loadingToast)
                    }
                })
            }
        } catch (err) {
            console.log(err)
        }

        return () => {
            try {
                debounceSave.cancel()
                SaveRef.current.removeEventListener("keyup", debounceSave)
            } catch {

            }
        }

    }, [currentPage, SaveRef, loading])

    async function updateTitle(e) {
        try {
            const titleText = e.target.innerText.trim();
            /**
             * Update the listed page items (side bar)'s content to reflect the change of the title
             */
            setListedPageItems(prevItems => {
                return prevItems.map((item) => {
                    if (item.id === currentPage) {
                        return { ...item, title: titleText }
                    } else {
                        return item
                    }
                })
            })
            //Make a request to the db to update the title
            await pb.collection('pages').update(currentPage, { "title": titleText })

        } catch (err) {
            console.error(err)
        }
    }


    if (loading) {
        return <Loader />
    }

    if (multiRecordSearch.state) {
        return (
            <>
                <Modal visibleDef={true}>
                    <ModalContent>
                        <h1>Multiple pages found! {`(${multiRecordSearch.records.length})`}</h1>
                        <Paragraph>
                            Looks like theres multiple pages with that name. Please select one from the list below to open.
                        </Paragraph>
                        <div style={{ maxHeight: '190px', overflowY: 'scroll' }}>
                            {multiRecordSearch.records.map((item) => (
                                <div onClick={() => {
                                    Router.push(`/page?edit=${item.id}`)
                                }} style={{ display: 'flex', gap: '7px', alignItems: 'center', cursor: 'pointer' }} className="hover:bg-[#f9f9f9] rounded p-3">
                                    <div aria-label='Page icon' style={{ display: 'flex', width: '16px', height: '16px' }}>
                                        {item.icon && item.icon.includes('.png') ? (<img className="w-4 h-4 object-contain" src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}
                                    </div>
                                    <div>{item.title}</div>
                                </div>
                            ))}
                        </div>
                    </ModalContent>
                </Modal>
            </>
        )
    }


    return (
        <editorV3Context.Provider value={{ openPageData, setOpenPageData, updateOpenPageData }}>
            <Head>
                <title>{saving !== "" ? (saving + " | ") : ""} {openPageData.title}</title>
                <link rel='icon' type='image/png' href={`/emoji/twitter/64/${openPageData.icon}`} />
            </Head>

            <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                <div className="flex flex-col w-full h-full overflow-scroll" id={`editor-container-${currentPage}`}>
                    <div className="relative w-full min-h-[300px] h-[300px] bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center mb-5">
                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden">
                            {openPageData.unsplash || openPageData.header_img ? (
                                <img src={openPageData.unsplash || `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/${openPageData.collectionId}/${openPageData.id}/${openPageData.header_img}`} className="w-full h-full object-cover" />
                            ) : (
                                <div />
                            )}
                        </div>
                        <div className="z-3 relative ">
                            <h1 contentEditable onBlur={(e) => updateTitle(e)} className="text-zinc-50 px-3 text-balance text-center outline-none scroll-m-20 text-4xl font-bold tracking-tight lg:text-4xl">{openPageData.title || "Untitled page"}</h1>
                        </div>
                        <div className="z-2 absolute bottom-2 right-2 flex gap-2">
                            <Suspense>
                                <MenuButtons currentPage={currentPage} />
                            </Suspense>
                        </div>
                    </div>
                    <div ref={SaveRef} className="px-8" style={{ color: "var(--editor_text)" }} id={`editorjs-editor-${currentPage}`} />
                </div>
            </div>
        </editorV3Context.Provider>
    )

    async function updateOpenPageData(newData) {
        setOpenPageData(prevData => {
            return { ...prevData, newData }
        })
    }
}


export const openPageContext = () => {
    return useContext(editorV3Context)
}