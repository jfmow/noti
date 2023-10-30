import { PopUpCardDropMenuSection, PopUpCardDropMenuSectionItem, PopUpCardDropMenuSectionTitle, PopUpCardDropMenuStaticPos, PopDropMenuStatic } from "@/lib/Pop-Cards/PopDropMenu";
import convertToMarkdown from '@/lib/ConvertToMD'
import dynamic from 'next/dynamic';
import Router from "next/router";
import styles from "@/styles/Create.module.css";
import compressImage from "@/lib/CompressImg";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertButton, AlertButtons, AlertContainer } from "@/lib/Alert";
import { toaster } from "@/components/toasty";

const TabbedDropMenuItem = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuItem));
const TabbedDropMenuItemSurround = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuItemSurround));
const TabbedDropMenuSelectorOptions = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuSelectorOptions));
const TabbedDropMenuStaticPos = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuStaticPos));
const TabbedDropMenuStaticPosSelectorSurround = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuStaticPosSelectorSurround));


const PopUpCardCorner = dynamic(() => import('@/lib/Pop-Cards/PopUpCard').then((module) => module.PopUpCardCorner));
const PopUpCardSubTitle = dynamic(() => import('@/lib/Pop-Cards/PopUpCard').then((module) => module.PopUpCardSubTitle));
const PopUpCardTitle = dynamic(() => import('@/lib/Pop-Cards/PopUpCard').then((module) => module.PopUpCardTitle));

const Gradient = dynamic(() => import("@/components/editor/Menu/gradient/adient"), {
    ssr: true,
});
const Icons = dynamic(() => import("@/components/editor/Menu/Icons"), {
    ssr: true,
});
const Img = dynamic(() => import("@/components/editor/Menu/Img"), {
    ssr: true,
});
const ColorSelector = dynamic(() => import("@/components/editor/Menu/ColorSelector"), {
    ssr: true,
});


export default function MenuButtons({ listedPageItems, setListedPageItems, pb, page, editor, clearStates, editorRef, articleTitle, currentPageIconValue, setArticleHeader, setPageSharedTF, setCurrentPageIconValue, pageSharedTF }) {
    //Changing data
    const [convertedMdData, setConvertedData] = useState('')

    //Modal states
    const [convertModalState, setShowConvert] = useState(false)
    const [ColorSelectorState, setColorSelectorState] = useState(false)
    const [iconModalState, setIconModalState] = useState(false);
    const [showPageInfo, setShowPageInfo] = useState(false)
    const [sharePageInfo, setSharePageInfo] = useState(false)
    const [DeletePageAlert, setDeletePageAlert] = useState(false)


    const [popUpEmojiState, setPopUpEmojiState] = useState({ activeItem: 'Icons', active: false })

    //PopUps
    const [popUpClickEventUnsplash, setpopUpClickEventUnsplash] = useState(null)
    const [popUpClickEventGradient, setpopUpClickEventGradient] = useState(null)
    const [popUpClickEventMarkdown, setpopUpClickEventMarkdown] = useState(null)
    const [popUpClickEventEmoji, setpopUpClickEventEmoji] = useState(null)
    const [popUpClickEventPageOptions, setpopUpClickEventPageOptions] = useState(null)
    const [popUpClickEventPageCoverOptions, setpopUpClickEventPageCoverOptions] = useState(null)

    const [pageInfo, setPageInfo] = useState({})

    async function handleDeletePage() {
        await pb.collection("pages").delete(page);
        toaster.toast(`${articleTitle || 'Untitled'} deleted`, "success")
        await editor.clear()
        clearStates()
        editorRef.current = null
        Router.push('/page/firstopen')
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const filteredItems = prevItems.filter(item => item.id !== page);


            return [
                ...filteredItems
            ];
        })
    }

    async function handlePageHeaderImageUpload(e) {
        toaster.toast("Uploading...", "loading", { id: "upload" })

        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            setArticleHeader(event.target.result);
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
                await pb.collection("pages").update(page, formData);

                toaster.dismiss("upload")
                toaster.toast("Image uploaded successfully!", "success")

            } catch (error) {
                toaster.dismiss("upload")
                toaster.toast("Error uploading header img", "error");
            }
        }
    }

    async function handlePageDisplayIconChange(e) {
        setCurrentPageIconValue(`${e.unified}.png`)
        const data = {
            icon: e.image,
        };
        //icon.codePointAt(0).toString(16)
        setIconModalState(false);
        await pb.collection("pages").update(page, data);
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const oldItem = listedPageItems.filter((item) => item.id === page)[0]
            const filteredItems = prevItems.filter(item => item.id !== oldItem.id);

            // Add the new record at the appropriate position based on its created date
            let insertIndex = filteredItems.findIndex(item => item.created < oldItem.created);
            if (insertIndex === -1) {
                insertIndex = filteredItems.length;
            }

            return [
                ...filteredItems.slice(0, insertIndex),
                { ...oldItem, icon: `${e.unified.toLowerCase()}.png` },
                ...filteredItems.slice(insertIndex)
            ];
            //return [...prevItems.filter(item => item.id !== page), { ...oldItem, icon: `${e.unified}.png` }]
        })
    }

    async function handleSharePage() {
        const data = {
            shared: !pageSharedTF,
        };
        setPageSharedTF(!pageSharedTF);
        const record = await pb.collection("pages").update(page, data);
    }

    async function handleCopyTextToClipboard(data, e) {
        var dummyInput = document.createElement("div");
        dummyInput.innerText = `${data}`;

        // Append it to the body
        document.body.appendChild(dummyInput);

        // Select and copy the value of the dummy input
        var range = document.createRange();
        range.selectNode(dummyInput);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        // Remove the dummy input from the DOM
        document.body.removeChild(dummyInput);

        // Create a new div element for mouse position feedback
        //var mouseFeedbackDiv = document.createElement("div");
        //mouseFeedbackDiv.innerText = "Text copied!";
        //mouseFeedbackDiv.style.position = "absolute";
        //mouseFeedbackDiv.style.left = e.pageX + "px";
        //mouseFeedbackDiv.style.top = e.pageY + "px";
        //mouseFeedbackDiv.classList.add(styles.copypopconf)
        //document.body.appendChild(mouseFeedbackDiv);
        //
        //// Optionally, set a timeout to remove the feedback after a certain duration
        //setTimeout(function () {
        //    document.body.removeChild(mouseFeedbackDiv);
        //    // Optionally, provide visual feedback to the user
        //}, 1000); // 2000 milliseconds (2 seconds) in this example, adjust as needed
    }


    async function handleChangePageListDisplayColor(color, page) {
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const oldItem = listedPageItems.filter((item) => item.id === page)[0]
            const filteredItems = prevItems.filter(item => item.id !== oldItem.id);

            // Add the new record at the appropriate position based on its created date
            let insertIndex = filteredItems.findIndex(item => item.created < oldItem.created);
            if (insertIndex === -1) {
                insertIndex = filteredItems.length;
            }

            return [
                ...filteredItems.slice(0, insertIndex),
                { ...oldItem, color: color },
                ...filteredItems.slice(insertIndex)
            ];
            //return [...prevItems.filter(item => item.id !== page), { ...oldItem, icon: `${e.unified}.png` }]
        })
        const data = {
            "color": color
        };

        await pb.collection('pages').update(page, data);
    }

    async function handleExportPageToMarkdown(e) {
        setpopUpClickEventMarkdown(e)
        const data = await editor.save()
        try {
            setConvertedData('')

            const md = await convertToMarkdown(data, articleTitle, pb.authStore.token)

            setConvertedData(md)
        } catch (err) {
            console.log(err)
            return toaster.toast(err, "error")
        }

    }

    useEffect(() => {
        if (showPageInfo) {
            async function getPageData() {
                const record = await pb.collection('pages').getOne(page);
                function calculateWordCount(input) {
                    function removeHtmlTags(text) {
                        return text.replace(/<[^>]*>/g, '');
                    }

                    function extractWords(text) {
                        return text.match(/\b\w+\b/g) || [];
                    }

                    function processNestedList(items) {
                        let words = [];
                        items.forEach(item => {
                            if (item.content) {
                                words = words.concat(extractWords(removeHtmlTags(item.content)));
                            }
                            if (item.items && item.items.length > 0) {
                                words = words.concat(processNestedList(item.items));
                            }
                        });
                        return words;
                    }

                    let words = [];

                    if (input && input.blocks && Array.isArray(input.blocks)) {
                        input.blocks.forEach(block => {
                            switch (block.type) {
                                case "header":
                                case "paragraph":
                                case "quote":
                                    if (block.data && block.data.text) {
                                        words = words.concat(extractWords(removeHtmlTags(block.data.text)));
                                    }
                                    break;
                                case "nestedList":
                                case "orderedList":
                                    if (block.data && block.data.items && Array.isArray(block.data.items)) {
                                        words = words.concat(processNestedList(block.data.items));
                                    }
                                    break;
                                case "table":
                                    if (block.data && block.data.content && Array.isArray(block.data.content)) {
                                        block.data.content.forEach(row => {
                                            row.forEach(cell => {
                                                words = words.concat(extractWords(removeHtmlTags(cell)));
                                            });
                                        });
                                    }
                                    break;
                                default:
                                    break;
                            }
                        });
                    }

                    return words;
                }
                const input = record.content
                const words = calculateWordCount(input);
                //console.log(words, words.length)
                setPageInfo({ ...record, wordCount: words.length })
            }
            getPageData()
        }
    }, [showPageInfo])

    return (
        <>
            <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Cover options</div>
                <button
                    aria-label="Page cover options"
                    type="button"
                    onClick={(e) => setpopUpClickEventPageCoverOptions(e)}
                    className={styles.title_buttons_btn}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallpaper"><circle cx="8" cy="9" r="2" /><path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
                </button>

                <PopUpCardDropMenuStaticPos animationOrgin={'top right'} mobilepos={{
                    top: `70px`,
                    left: `0`,
                    width: `200px`,
                    position: 'absolute',
                    zIndex: '5',
                }} style={{ position: 'absolute', right: '0', top: '50px' }} event={popUpClickEventPageCoverOptions} className={styles.title_buttons_btn}>
                    <PopUpCardDropMenuSectionTitle>
                        Page cover
                    </PopUpCardDropMenuSectionTitle>
                    <PopUpCardDropMenuSection>
                        <PopUpCardDropMenuSectionItem
                            onClick={(e) => setpopUpClickEventUnsplash(e)}>
                            <svg width="24" height="24" viewBox="0 0 32 32" version="1.1" aria-labelledby="unsplash-home" aria-hidden="false"><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg>
                            <p>Unsplash</p>
                        </PopUpCardDropMenuSectionItem>
                        <PopUpCardDropMenuSectionItem
                            onClick={(e) => setpopUpClickEventGradient(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush-2"><path d="M14 19.9V16h3a2 2 0 0 0 2-2v-2H5v2c0 1.1.9 2 2 2h3v3.9a2 2 0 1 0 4 0Z" /><path d="M6 12V2h12v10" /><path d="M14 2v4" /><path d="M10 2v2" /></svg>
                            <p>Gradient</p>
                        </PopUpCardDropMenuSectionItem>
                        <PopUpCardDropMenuSectionItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                            <label className={styles.customfileupload} >
                                <input
                                    type="file"
                                    name="file"
                                    id="fileInput"
                                    accept="image/*"
                                    className={styles.finput}
                                    onChange={handlePageHeaderImageUpload}
                                />
                                <p>Custom</p>
                            </label>
                        </PopUpCardDropMenuSectionItem>
                    </PopUpCardDropMenuSection>

                </PopUpCardDropMenuStaticPos>
                <PopUpCardCorner event={popUpClickEventUnsplash} className={styles.title_buttons_btn}>
                    <PopUpCardTitle>Unsplash</PopUpCardTitle>
                    <PopUpCardSubTitle>Choose a cover image for your page.</PopUpCardSubTitle>
                    {popUpClickEventUnsplash && (
                        <Img setArticleHeader={setArticleHeader} page={page} />
                    )}

                </PopUpCardCorner>
                <PopUpCardCorner event={popUpClickEventGradient} className={styles.title_buttons_btn}>
                    <PopUpCardTitle>Gradients</PopUpCardTitle>
                    <PopUpCardSubTitle>Choose a gradient cover for your page.</PopUpCardSubTitle>
                    {popUpClickEventGradient && (
                        <Gradient setArticleHeader={setArticleHeader} page={page} pb={pb} />
                    )}

                </PopUpCardCorner>
            </div>

            <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Customise page</div>
                <button
                    aria-label="Customise page menu opener"
                    type="button"
                    onClick={(e) => setpopUpClickEventEmoji(e)}
                    className={styles.title_buttons_btn}
                    onMouseOver={() => setPopUpEmojiState({ ...popUpEmojiState, active: true })
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
                </button>
                <TabbedDropMenuStaticPos mobilepos={{
                    top: `50px`,
                    right: `0`,
                    width: `100%`,
                }} event={popUpClickEventEmoji} style={{ position: 'absolute', right: 0, top: '50px' }}>
                    <TabbedDropMenuStaticPosSelectorSurround>
                        <TabbedDropMenuSelectorOptions active={popUpEmojiState.activeItem === 'Icons'} click={() => setPopUpEmojiState({ ...popUpEmojiState, activeItem: 'Icons' })}>
                            Page Icon
                        </TabbedDropMenuSelectorOptions>
                        <TabbedDropMenuSelectorOptions active={popUpEmojiState.activeItem === 'Color'} click={() => setPopUpEmojiState({ ...popUpEmojiState, activeItem: 'Color' })}>
                            Color
                        </TabbedDropMenuSelectorOptions>
                    </TabbedDropMenuStaticPosSelectorSurround >
                    <TabbedDropMenuItemSurround>
                        <TabbedDropMenuItem active={popUpEmojiState.activeItem === 'Icons'}>
                            {(popUpEmojiState.activeItem === 'Icons' && popUpClickEventEmoji !== null) || popUpEmojiState.active ? (
                                <>
                                    <Icons Select={handlePageDisplayIconChange} Selected={`${currentPageIconValue.toString()}`} />
                                </>
                            ) : (
                                <div className={styles.LongBarLoaderDiv}>
                                    <div className={styles.LongBarLoader}></div>
                                </div>
                            )}
                        </TabbedDropMenuItem>
                        <TabbedDropMenuItem active={popUpEmojiState.activeItem === 'Color'}>
                            <ColorSelector onSelectColor={handleChangePageListDisplayColor} page={page} />
                        </TabbedDropMenuItem>
                    </TabbedDropMenuItemSurround>
                </TabbedDropMenuStaticPos>
            </div>

            <div className={styles.buttonlabel} style={{ position: 'relative' }}>
                <div className={styles.buttonlabel_label}>Settings</div>
                <button
                    aria-label="Page settings"
                    type="button"
                    onClick={(e) => setpopUpClickEventPageOptions(e)}
                    className={styles.title_buttons_btn}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-2"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>                </button>
                <PopUpCardDropMenuStaticPos animationOrgin={'top right'} mobilepos={{
                    top: `70px`,
                    right: `0`,
                    width: `200px`,
                    position: 'absolute',
                    zIndex: '5',
                }} style={{ position: 'absolute', right: 0, top: '50px' }} event={popUpClickEventPageOptions} className={styles.title_buttons_btn} onClose={() => {
                    setSharePageInfo(false);
                    setShowPageInfo(false);
                    setpopUpClickEventMarkdown(null)
                    setDeletePageAlert(false)
                }}>
                    <PopUpCardDropMenuSectionTitle>
                        Page options
                    </PopUpCardDropMenuSectionTitle>
                    <PopUpCardDropMenuSection
                    >
                        <PopUpCardDropMenuSectionItem
                            onClick={() => setSharePageInfo(!sharePageInfo)} onHover={() => {
                                //set everything false
                                setSharePageInfo(false);
                                setShowPageInfo(false);
                                setpopUpClickEventMarkdown(null)
                            }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                            <p >Share page</p>
                        </PopUpCardDropMenuSectionItem>
                        <PopUpCardDropMenuSectionItem onClick={(e) => handleExportPageToMarkdown(e)} onHover={() => {
                            //set everything false
                            setSharePageInfo(false);
                            setShowPageInfo(false);
                            setpopUpClickEventMarkdown(null)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-from-line"><path d="M3 5v14" /><path d="M21 12H7" /><path d="m15 18 6-6-6-6" /></svg>
                            <p >Export as MarkDown</p>
                        </PopUpCardDropMenuSectionItem>
                        <PopUpCardDropMenuSectionItem onClick={() => setShowPageInfo(!showPageInfo)} onHover={() => {
                            //set everything false
                            setSharePageInfo(false);
                            //setShowPageInfo(true);
                            setpopUpClickEventMarkdown(null)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                            <p>Page info</p>
                        </PopUpCardDropMenuSectionItem>
                        <PopUpCardDropMenuSectionItem
                            onClick={() => DeletePageAlert ? handleDeletePage() : setDeletePageAlert(true)} onHover={() => {
                                //set everything false
                                setSharePageInfo(false);
                                setShowPageInfo(false);
                                setpopUpClickEventMarkdown(null)
                            }} red={DeletePageAlert}>
                            {DeletePageAlert ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    <p>Click to delete</p>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                    <p >Delete page</p>
                                </>
                            )}

                        </PopUpCardDropMenuSectionItem>
                    </PopUpCardDropMenuSection>


                    {showPageInfo && (
                        <PopDropMenuStatic style={{ width: '200px', minHeight: '100px', position: 'absolute', zIndex: '13', left: `-198px`, top: '50px' }}>
                            <PopUpCardDropMenuSectionTitle>
                                Info
                            </PopUpCardDropMenuSectionTitle>
                            <PopUpCardDropMenuSection>
                                <PopUpCardDropMenuSectionItem>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-case-upper"><path d="m3 15 4-8 4 8" /><path d="M4 13h6" /><path d="M15 11h4.5a2 2 0 0 1 0 4H15V7h4a2 2 0 0 1 0 4" /></svg>
                                    <p>Title: {pageInfo.title}</p>
                                </PopUpCardDropMenuSectionItem>
                                <PopUpCardDropMenuSectionItem>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-z-a"><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /><path d="M15 4h5l-5 6h5" /><path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" /><path d="M20 18h-5" /></svg>
                                    <p>Word Count: {pageInfo.wordCount}</p>
                                </PopUpCardDropMenuSectionItem>
                                <PopUpCardDropMenuSectionItem>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h5" /><path d="M17.5 17.5 16 16.25V14" /><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" /></svg>
                                    <p>Created: {new Date(pageInfo.created).toLocaleString()}</p>
                                </PopUpCardDropMenuSectionItem>
                                <PopUpCardDropMenuSectionItem>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
                                    <p>Owner: {pageInfo.owner}</p>
                                </PopUpCardDropMenuSectionItem>
                                <PopUpCardDropMenuSectionItem>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-view"><path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" /><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" /><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" /></svg>
                                    <p style={{ display: "flex", gap: '5px' }}>Shared: {pageInfo.shared ? (<p style={{ color: 'green' }}>true</p>) : (<p style={{ color: 'red' }}>false</p>)}</p>
                                </PopUpCardDropMenuSectionItem>
                                <PopUpCardDropMenuSectionItem>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-party-popper"><path d="M5.8 11.3 2 22l10.7-3.79" /><path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" /><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" /><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" /><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" /><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" /></svg>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '7px' }} >Icon: {pageInfo.icon && pageInfo.icon.includes('.png') ? (<img width='16' height='16' className={styles.page_icon} src={`/emoji/twitter/64/${pageInfo.icon}`} />) : (!isNaN(parseInt(pageInfo.icon, 16)) && String.fromCodePoint(parseInt(pageInfo.icon, 16)))}
                                    </p>
                                </PopUpCardDropMenuSectionItem>
                            </PopUpCardDropMenuSection>
                        </PopDropMenuStatic>
                    )}
                    {sharePageInfo && (
                        <PopDropMenuStatic style={{ width: '200px', minHeight: '100px', position: 'absolute', zIndex: '13', left: `-198px`, top: '20px' }}>
                            <PopUpCardDropMenuSectionTitle>
                                Share
                            </PopUpCardDropMenuSectionTitle>
                            <PopUpCardDropMenuSection>
                                <PopUpCardDropMenuSectionItem>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                    <p style={{ width: '100%', overflow: 'hidden' }}>Link: <span style={{ width: '100%', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{process.env.NEXT_PUBLIC_CURRENTURL}/page/view/{page}</span></p>
                                </PopUpCardDropMenuSectionItem>
                                {pageSharedTF ? (
                                    <>
                                        <PopUpCardDropMenuSectionItem onClick={(e) => {
                                            async function CopyStuff() {
                                                await handleCopyTextToClipboard(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/view/${page}`, e)
                                                const icondiv = document.getElementById('copyicon')
                                                const oldIcon = icondiv.innerHTML
                                                icondiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>'
                                                setTimeout(() => {
                                                    icondiv.innerHTML = oldIcon
                                                }, 1000);
                                            }
                                            CopyStuff()
                                        }}>
                                            <div id="copyicon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                            </div>
                                            <p>Copy to clipboard</p>
                                        </PopUpCardDropMenuSectionItem>
                                        <PopUpCardDropMenuSectionItem onClick={handleSharePage}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                            <p>Make page private</p>
                                        </PopUpCardDropMenuSectionItem>
                                    </>
                                ) : (
                                    <>
                                        <PopUpCardDropMenuSectionItem onClick={handleSharePage}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                            <p>Make page public</p>
                                        </PopUpCardDropMenuSectionItem>
                                    </>
                                )}

                            </PopUpCardDropMenuSection>
                        </PopDropMenuStatic>
                    )}
                    <PopUpCardCorner event={popUpClickEventMarkdown} className={styles.title_buttons_btn}>
                        <PopUpCardTitle>Markdown</PopUpCardTitle>
                        <PopUpCardSubTitle>Copy your page as a markdown file.</PopUpCardSubTitle>
                        {convertedMdData === '' ? (
                            <div className={styles.loaderLong_con}>
                                <div className={styles.loaderLong}></div>
                            </div>
                        ) : (
                            <textarea onChange={() => { return }} style={{ height: '20vh', background: 'var(--modal_button_bg)', border: '2px solid var(--modal_button_border)', borderRadius: '10px', fontFamily: 'auto', padding: '1em', overflowX: 'hidden', overflowY: 'scroll', color: 'var(--modal_button_text)', marginTop: '15px', width: '100%', height: '100%' }} value={convertedMdData} />
                        )}
                        <PopUpCardSubTitle>{`Please select the text manualy for best copy paste result`}</PopUpCardSubTitle>
                        <button className={`${styles.pagebtn} ${styles.pagebtn_dark}`} type='button' onClick={(e) => handleCopyTextToClipboard(convertedMdData, e)}>Copy {`(not prefered)`}</button>
                    </PopUpCardCorner>
                </PopUpCardDropMenuStaticPos >
            </div >
        </>
    )
}