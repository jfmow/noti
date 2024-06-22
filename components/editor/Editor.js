import Head from "next/head";
import { Suspense, useEffect, useRef, useState } from "react";
import { lazy } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import Underline from '@editorjs/underline';
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Video from '@/customEditorTools/Video'
import compressImage from "@/lib/CompressImg";
import Router from "next/router";
import NestedList from '@editorjs/nested-list';
import MarkerTool from "@/customEditorTools/Marker";
import ImageTool from "@/customEditorTools/Image";
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
import LineBreak from "@/customEditorTools/LineBreak";
import { toaster } from "@/components/toast";
import { useEditorContext } from "@/pages/page";
import { debounce } from "lodash";
import { ListenForPageChange, SendPageChanges } from "@/lib/Page state manager";
import { findPageListPage } from "../Pages List/list-functions";
import Loader from "../Loader";
const MenuButtons = lazy(() => import("@/components/editor/Page-cover-buttons"))
import pb from "@/lib/pocketbase"

export default function EditorV3({ currentPage }) {
    const { listedPageItems } = useEditorContext()
    const Editor = useRef(null)
    const EditorElement = useRef(null)
    const [loadingSlow, setLoadingSlow] = useState(false)

    const openPageData = findPageListPage(currentPage, listedPageItems)


    useEffect(() => {
        //Check that there is a current page
        debounceSave.cancel()

        if (currentPage) {
            async function RetriveOpenPageData(page) {
                /**
                 * Uses the pocketbase js sdk to query the db for the record with the id `page`
                 * It then sets the state value with the returned record.
                 * This record contains all the data, title, owner, content, header images etc
                 */
                try {
                    if (openPageData && openPageData.content && Object.keys(openPageData.content).includes("blocks")) {
                        initNewEditor(openPageData)
                    } else {
                        setLoadingSlow(true)
                        const record = await pb.collection('pages').getOne(page)
                        SendPageChanges(page, record)
                        initNewEditor(record)
                        setLoadingSlow(false)
                    }
                } catch {
                    Router.push("/page")
                }
            }

            RetriveOpenPageData(currentPage)
        }

    }, [currentPage])

    async function initNewEditor(pageData) {
        try {
            if (Editor.current) {
                await Editor.current.destroy()
            }
            const editor = new EditorJS({
                holder: EditorElement.current,
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                    },
                    marker: {
                        class: MarkerTool,
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            storeFile: {
                                uploadFile(file) {
                                    async function getImageDimensions(file) {
                                        return new Promise((resolve, reject) => {
                                            const img = new Image();
                                            img.onload = () => {
                                                resolve({ width: img.width, height: img.height });
                                            };
                                            img.onerror = () => {
                                                reject(new Error('Error loading image'));
                                            };
                                            img.src = URL.createObjectURL(file);
                                        });
                                    }

                                    async function uploadbyFile(file) {
                                        const loadingToast = await toaster.loading("Uploading");

                                        // Init the new file record as formData
                                        const formData = new FormData();

                                        // Compress the image
                                        const compressedBlob = await compressImage(file);

                                        // Convert the compressed data to a file
                                        const compressedFile = new File(
                                            [compressedBlob],
                                            file.name,
                                            { type: "image/jpeg" }
                                        );

                                        // Get the image dimensions here
                                        let imageMeta;
                                        try {
                                            imageMeta = await getImageDimensions(compressedFile);
                                        } catch (error) {
                                            console.error('Failed to get image dimensions', error);
                                            imageMeta = { width: 0, height: 0 }; // Default values in case of error
                                        }

                                        formData.append("file_data", compressedFile);
                                        formData.append("uploader", pb.authStore.model.id);
                                        formData.append('page', currentPage);
                                        try {
                                            const record = await pb.collection("files").create(formData);
                                            toaster.update(loadingToast, "Image uploaded successfully!", "success");
                                            return {
                                                success: 1,
                                                file: {
                                                    fileId: record.id,
                                                    imageMeta: imageMeta
                                                },
                                            };
                                        } catch (error) {
                                            toaster.update(loadingToast, error.data.message, "error");
                                            return { success: 0 };
                                        }
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
                                        const loadingToast = await toaster.loading("Uploading")
                                        const formData = new FormData();
                                        formData.append("file_data", file);
                                        formData.append("uploader", pb.authStore.model.id);
                                        formData.append('page', currentPage)
                                        try {
                                            if (!file.name.endsWith(".pdf")) {
                                                toaster.update(loadingToast, 'File type not supported yet!', "error")
                                                return { success: 0 }
                                            }
                                            const record = await pb.collection("files").create(formData);

                                            toaster.update(loadingToast, "File uploaded successfully!", "success")
                                            return {
                                                success: 1,
                                                file: {
                                                    recid: record.id,
                                                },
                                            };

                                        } catch (error) {
                                            toaster.update(loadingToast, error.data.message, "error")
                                            return { success: 0 }
                                            // Handle error
                                        }


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
                    underline: {
                        class: Underline,
                        inlineToolbar: true,
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                },
                data: pageData?.content || [],
                placeholder: "Enter some text...",
                autofocus: pageData?.content && pageData?.content?.blocks?.length >= 1 && (pageData?.content?.blocks[0]?.type === 'image' || pageData?.content?.blocks[0]?.type === 'Video' || pageData?.content?.blocks[0]?.type === 'simpleEmbeds' || pageData?.content?.blocks[0]?.type === 'SimpleIframeWebpage') ? false : true,
                onChange: (api, event) => {
                    if (document.hidden) return
                    const urlParams = new URLSearchParams(window.location.search)
                    if (urlParams.has("demo") && +urlParams.get("demo") === 1) {
                        return
                    }
                    if (pageData?.read_only) {
                        //TODO: When its read only make it so the editor uses the read only one.
                        //The editor needs to take in the page data and the index page needs to handle getting the data for the loading with suspence fall back and selecting the read only or the editor editor
                        console.warn(`The page ${pageData.id} is marked as read only.\n- Saving has been disabled`)
                        return
                    }

                    api.saver.save().then((res) => {
                        SendPageChanges(pageData.id, { content: res })
                        debounceSave(res)
                    })

                }
            })
            editor.isReady.then(() => {
                console.log("ready")
                Editor.current = editor
                ListenForPageChange(currentPage, async (data) => {
                    if (document.hidden && Editor.current) {
                        if (data.content && Object.keys(data.content).includes("blocks")) {
                            await Editor.current.render(data.content)
                            debounceSave.cancel()
                        }

                    }
                })
            })
        } catch (err) {
            console.error("Editor error:\n" + err)
        }
    }

    function Save(content) {
        pb.collection('pages').update(currentPage, { "content": content }).then((successRes) => {
            return
        }, (errorRes) => {
            console.error(errorRes?.message || errorRes)
            toaster.error("Failed to save the page")
        })
    }

    const debounceSave = debounce(Save, 420)

    async function updateTitle(e) {
        try {
            const titleText = e.target.innerText.trim();
            /**
             * Update the listed page items (side bar)'s content to reflect the change of the title
             */
            SendPageChanges(currentPage, { title: titleText })
            //Make a request to the db to update the title
            await pb.collection('pages').update(currentPage, { "title": titleText })

        } catch (err) {
            console.error(err)
        }
    }


    return (
        <>
            <Head>
                <title>{openPageData.title}</title>
                {openPageData.icon !== "" && openPageData.icon !== undefined && openPageData?.icon.endsWith(".png") ? (
                    <link rel='icon' type='image/png' href={`/emoji/twitter/64/${openPageData.icon}`} />
                ) : null}
            </Head>

            <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                <div className="flex flex-col w-full h-full overflow-scroll" id={`editor-container-${currentPage}`}>
                    <div className="relative w-full min-h-[300px] h-[300px] bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center mb-5">
                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden" id="dontchangemewhenprinting">
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
                    {loadingSlow ? (<Loader />) : null}
                    <div ref={EditorElement} className={`px-8 text-[var(--editortext);] ${loadingSlow ? "hidden" : ""}`} />
                </div>
            </div>
        </>
    )

}