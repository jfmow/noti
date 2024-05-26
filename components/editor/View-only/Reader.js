import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Video from '@/customEditorTools/Video'
import NestedList from '@editorjs/nested-list';
import MarkerTool from "@/customEditorTools/Marker";
import Image from "@/customEditorTools/Image";
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
import LineBreak from "@/customEditorTools/LineBreak";
import { toaster } from "@/components/toast";
import Loader from "../../Loader";
import PocketBase from 'pocketbase'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

export default function EditorV3({ page }) {
    const currentPage = page;
    const Editor = useRef(null)
    const SaveRef = useRef(null)
    const [openPageData, setOpenPageData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        /*
        * Check if the url is on the default route `firstopen`, 
        * which is not a real page so should display nothing
        */
        if (currentPage === "firstopen") return

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
                } catch {
                }
            }
            RetriveOpenPageData(currentPage)
        }
    }, [currentPage])

    useEffect(() => {
        try {
            if (openPageData || openPageData?.content === null) {
                if (Editor) {
                    try {
                        Editor.clear()
                        Editor.destroy()
                    } catch { }
                }
                const editor = new EditorJS({
                    holder: document.getElementById(`editorjs-editor-${currentPage}`),
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
                    placeholder: "No data found.",
                    readOnly: true,
                })
                editor.isReady.then(() => {
                    Editor.current = editor
                    setLoading(false)
                })
            }
        } catch (err) {
            console.log(err)
            toaster.error(err)
        }
    }, [openPageData])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Head>
                <title>{openPageData.title}</title>
            </Head>
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
                        <h1 contentEditable onBlur={(e) => updateTitle(e)} className="outline-none scroll-m-20 text-4xl font-bold tracking-tight lg:text-4xl">{openPageData.title || "Untitled page"}</h1>
                    </div>
                </div>
                <div ref={SaveRef} className="px-3" style={{ color: "var(--editor_text)" }} id={`editorjs-editor-${currentPage}`} />
            </div>
        </>
    )
}