import styles from '@/styles/MenuBar.module.css';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { PopUpCardDropMenuSection, PopUpCardDropMenuSectionItem, PopUpCardDropMenuSectionTitle, PopUpCardDropMenuStaticPos, PopDropMenuStatic } from "@/lib/Pop-Cards/PopDropMenu";
import { toaster } from '@/components/toasty';
export default function MenuBar({ pb, page, setVisible, sideBarVisible, setListedPageItems, listedPageItems }) {
    const [activePage, setActivePage] = useState({})
    const [filteredItems, setFilteredItems] = useState([]);
    const [popUpClickEventPageOptions, setpopUpClickEventPageOptions] = useState(null)
    const [showPageInfo, setShowPageInfo] = useState(false)
    const [sharePageInfo, setSharePageInfo] = useState(false)
    const [DeletePageAlert, setDeletePageAlert] = useState(false)
    const [pageInfo, setPageInfo] = useState({})
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        if (window.innerWidth < 450) {
            setIsMobile(true)
        }
    }, [])
    useEffect(() => {
        setpopUpClickEventPageOptions(null)
        setDeletePageAlert(false)
        setSharePageInfo(false)
        setPageInfo({})
        const mainItem = listedPageItems.find((Apage) => Apage.id === page);
        setActivePage(mainItem)
        let tree = [mainItem];
        let parent = mainItem;
        while (parent?.parentId) {
            parent = listedPageItems.find((Apage) => Apage.id === parent.parentId);
            if (parent) {
                tree.push(parent);
            } else {
                break;
            }
        }
        tree.reverse();
        setFilteredItems(tree);
    }, [listedPageItems, page]);

    useEffect(() => {
        if (showPageInfo) {
            async function getPageData() {
                try {


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
                } catch {
                    return
                }
            }
            getPageData()
        }
    }, [showPageInfo, listedPageItems])

    async function handleSharePage() {
        const data = {
            shared: !filteredItems.find((Apage) => Apage.id === page)?.shared,
        };
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const oldItem = listedPageItems.filter((item3) => item3.id === page)[0]
            const filteredItems = prevItems.filter(item3 => item3.id !== oldItem.id);

            // Add the new record at the appropriate position based on its created date
            let insertIndex = filteredItems.findIndex(item3 => item3.created < oldItem.created);
            if (insertIndex === -1) {
                insertIndex = filteredItems.length;
            }

            return [
                ...filteredItems.slice(0, insertIndex),
                { ...oldItem, shared: data.shared },
                ...filteredItems.slice(insertIndex)
            ];
            //return [...prevItems.filter(item => item.id !== page), { ...oldItem, icon: `${e.unified}.png` }]
        })
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
    async function handleDeletePage() {
        try {
            await pb.collection("pages").delete(page);
            toaster.toast(`Page deleted`, "success")
            setListedPageItems(prevItems => {
                // Remove any previous item with the same ID
                const filteredItems = prevItems.filter(item => item.id !== page);


                return [
                    ...filteredItems
                ];
            })
            const sortedData = listedPageItems.filter((pageA) => pageA.parentId === '').sort((a, b) => {
                // Convert the created strings to Date objects for comparison
                const dateA = new Date(a.created);
                const dateB = new Date(b.created);

                // Compare the dates (newest to oldest)
                return dateB - dateA;
            });
            Router.push(`/page/${sortedData[0].id || 'firstopen'}`)
        } catch (err) {
            console.log(err)
            toaster.error('An error occured while trying to delete the page')
        }
    }

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => setVisible(!sideBarVisible)} type='button' className={styles.optionButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="15" x2="15" y1="3" y2="21" /></svg>            </button>

                <div className={styles.pages}>
                    {!isMobile ? (
                        <>
                            {filteredItems.map((item, index) => (
                                <div className={styles.page} key={index}>
                                    <div className={styles.page_content} onClick={() => Router.push(`/page/${item.id}`)}>
                                        <div className={styles.page_icon}>
                                            {item?.icon && item?.icon.includes('.png') ? (<img className={styles.item_icon} src={`/emoji/twitter/64/${item?.icon}`} />) : (!isNaN(parseInt(item?.icon, 16)) && String.fromCodePoint(parseInt(item?.icon, 16)))}
                                        </div>
                                        {item?.title || item?.id}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className={styles.page}>
                                <div className={styles.page_content} onClick={() => Router.push(`/page/${page}`)}>
                                    <div className={styles.page_icon}>
                                        {activePage?.icon && activePage?.icon.includes('.png') ? (<img className={styles.activePage_icon} src={`/emoji/twitter/64/${activePage?.icon}`} />) : (!isNaN(parseInt(activePage?.icon, 16)) && String.fromCodePoint(parseInt(activePage?.icon, 16)))}
                                    </div>
                                    {activePage?.title || activePage?.id}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.options}>
                <button onClick={(e) => setpopUpClickEventPageOptions(e)} type='button' className={styles.optionButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                </button>
                <PopUpCardDropMenuStaticPos animationOrgin={'top right'} mobilepos={{
                    top: `70px`,
                    right: `0`,
                    width: `200px`,
                    position: 'absolute',
                    zIndex: '5',
                }} style={{ position: 'absolute', right: 0, top: '50px' }} event={popUpClickEventPageOptions} className={styles.title_buttons_btn} onClose={() => {
                    setSharePageInfo(false);
                    setShowPageInfo(false);
                    setDeletePageAlert(false)
                }}>
                    <PopUpCardDropMenuSectionTitle>
                        Page options
                    </PopUpCardDropMenuSectionTitle>
                    <PopUpCardDropMenuSection
                    >
                        <PopUpCardDropMenuSectionItem
                            onMouseEnter={() => setSharePageInfo(true)} onMouseLeave={() => setSharePageInfo(false)} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                            <p >Share page</p>
                            {sharePageInfo && (
                                <PopDropMenuStatic style={{ width: '200px', minHeight: '100px', position: 'absolute', zIndex: '13', left: `-194px`, top: '20px' }}>
                                    <PopUpCardDropMenuSectionTitle>
                                        Share
                                    </PopUpCardDropMenuSectionTitle>
                                    <PopUpCardDropMenuSection>
                                        <PopUpCardDropMenuSectionItem>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                            <p style={{ width: '100%', overflow: 'hidden' }}>Link: <span style={{ width: '100%', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{process.env.NEXT_PUBLIC_CURRENTURL}/page/view/{page}</span></p>
                                        </PopUpCardDropMenuSectionItem>
                                        {filteredItems.find((Apage) => Apage.id === page)?.shared ? (
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
                        </PopUpCardDropMenuSectionItem>

                        <PopUpCardDropMenuSectionItem onMouseEnter={() => setShowPageInfo(true)} onMouseLeave={() => setShowPageInfo(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                            <p>Page info</p>
                            {showPageInfo && (
                                <PopDropMenuStatic style={{ width: '200px', minHeight: '100px', position: 'absolute', zIndex: '13', left: `-194px`, top: '50px' }}>
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
                        </PopUpCardDropMenuSectionItem>
                        <PopUpCardDropMenuSectionItem
                            onClick={() => DeletePageAlert ? handleDeletePage() : setDeletePageAlert(true)} red={DeletePageAlert}>
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





                </PopUpCardDropMenuStaticPos >
            </div>
        </div>
    );
}
