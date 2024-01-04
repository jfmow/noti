import Router from 'next/router';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/toast';
import { ToolTip, ToolTipCon, ToolTipTrigger } from '@/components/UX-Components/Tooltip';
import { useEditorContext } from '@/pages/page/[...id]';
import { DropDown, DropDownContainer, DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from '@/lib/Pop-Cards/DropDown';
import { updateListedPages } from '../Item';
import { Link } from '../UX-Components';
import { AppWindow, PanelTopDashed, Settings2, X } from 'lucide-react';
export default function MenuBar() {
    const { pb, currentPage, setVisible, visible, setListedPageItems, listedPageItems } = useEditorContext()
    const [activePage, setActivePage] = useState({})
    const [filteredItems, setFilteredItems] = useState([]);
    const [pageInfo, setPageInfo] = useState({})
    const [isMobile, setIsMobile] = useState(false)
    const [tabBarVisible, setTabBarVisible] = useState(false)
    useEffect(() => {
        if (window.innerWidth < 450) {
            setIsMobile(true)
        }
        setTabBarVisible(window.localStorage.getItem('tabbar'))
        document.body.addEventListener("TABBARTOGGLE", (e) => {
            const newState = e.detail
            window.localStorage.setItem('tabbar', newState)
            setTabBarVisible(newState)
        })
    }, [])
    useEffect(() => {
        setPageInfo({})
        const mainItem = listedPageItems.find((Apage) => Apage.id === currentPage);
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
    }, [listedPageItems, currentPage]);

    useEffect(() => {
        async function getPageData() {
            try {


                const record = await pb.collection('pages').getOne(currentPage);
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

    }, [listedPageItems, currentPage])

    async function handleSharePage() {
        const data = {
            shared: !filteredItems.find((Apage) => Apage.id === currentPage)?.shared,
        };
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const oldItem = listedPageItems.filter((item3) => item3.id === currentPage)[0]
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
            //return [...prevItems.filter(item => item.id !== currentPage), { ...oldItem, icon: `${e.unified}.png` }]
        })
        setListedPageItems(updateListedPages(currentPage, { shared: data.shared }, listedPageItems))

        const record = await pb.collection("pages").update(currentPage, data);
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
    }
    async function handleDeletePage() {
        if (!confirm(`Are you sure you wish to delete ${listedPageItems.find((item) => item.id === currentPage)?.title || currentPage}`)) return
        try {
            await pb.collection("pages").delete(currentPage);
            toaster.success(`Page deleted`)
            setListedPageItems(prevItems => {
                return prevItems.filter((aitem) => aitem.id !== currentPage)
            })
            Router.push(`/page/firstopen`)
        } catch (err) {
            console.log(err)
            toaster.error('An error occured while trying to delete the page')
        }
    }

    async function handleArchivePageToggle() {
        const newState = !listedPageItems.find((Apage) => Apage.id === currentPage).archived
        setListedPageItems(updateListedPages(currentPage, { archived: newState }, listedPageItems))
        await pb.collection('pages').update(currentPage, { archived: newState });
        toaster.success(`Page ${newState ? 'archived' : 'restored'} successfully`)
    }

    return (
        <>


            <div className="w-full h-[45px] pl-1 pr-2 px-2 flex justify-between items-center bg-zinc-50 overflow-x-scroll overflow-y-hidden">
                <div className='flex items-center h-full'>
                    <button onClick={() => setVisible(!visible)} type='button' className="flex items-center justify-center bg-none border-none text-zinc-800 cursor-pointer p-1 rounded relative w-[30px] h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="15" x2="15" y1="3" y2="21" /></svg>
                    </button>
                    {tabBarVisible ? (
                        <TabBar />
                    ) : (
                        <div className="flex items-center text-zinc-800">
                            {!isMobile ? (
                                <>
                                    {filteredItems.map((item, index) => (
                                        <>
                                            <div className="flex items-center justify-center relative cursor-pointer" key={index}>
                                                <Link className="flex gap-1 items-center text-[14px] font-[600] text-zinc-600 rounded p-[0.5em] hover:bg-zinc-200" onClick={() => Router.push(`/page/${item.id}`)}>
                                                    {item?.icon && (
                                                        <div className="w-4 h-4 flex items-center justify-center">
                                                            {item?.icon && item?.icon.includes('.png') ? (<img src={`/emoji/twitter/64/${item?.icon}`} />) : (!isNaN(parseInt(item?.icon, 16)) && String.fromCodePoint(parseInt(item?.icon, 16)))}
                                                        </div>
                                                    )}
                                                    {item?.title || item?.id}
                                                </Link>
                                            </div>
                                            {index < filteredItems.length - 1 && (
                                                <div className='text-zinc-300 flex items-center justify-center mx-1'>
                                                    /
                                                </div>
                                            )}
                                        </>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center relative cursor-pointer">
                                        <div className="flex gap-1 items-center text-[14px] font-[600] text-zinc-600 rounded p-[0.5em] hover:bg-zinc-200" onClick={() => Router.push(`/page/${currentPage}`)}>
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                {activePage?.icon && activePage?.icon.includes('.png') ? (<img src={`/emoji/twitter/64/${activePage?.icon}`} />) : (!isNaN(parseInt(activePage?.icon, 16)) && String.fromCodePoint(parseInt(activePage?.icon, 16)))}
                                            </div>
                                            {activePage?.title || activePage?.id}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center gap-0 relative">
                    <ToolTipCon>
                        <DropDownContainer>
                            <ToolTipTrigger>
                                <DropDownTrigger>
                                    <button className="flex items-center justify-center bg-none border-none text-zinc-800 cursor-pointer p-1 rounded relative w-[30px] h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4">
                                        <Settings2 />
                                    </button>
                                </DropDownTrigger>
                            </ToolTipTrigger>
                            <DropDown>
                                <DropDownSectionTitle>
                                    Toggle menus
                                </DropDownSectionTitle>
                                <DropDownSection>
                                    <DropDownItem onClick={() => {
                                        const event = new CustomEvent("TABBARTOGGLE", { detail: !tabBarVisible });
                                        document.body.dispatchEvent(event)
                                    }}>
                                        <AppWindow />
                                        Toggle tab bar
                                    </DropDownItem>
                                </DropDownSection>
                            </DropDown>
                        </DropDownContainer>
                        <ToolTip>
                            Settings
                        </ToolTip>
                    </ToolTipCon>
                    <ToolTipCon>
                        <DropDownContainer>
                            <ToolTipTrigger>
                                <DropDownTrigger>
                                    <button className="flex items-center justify-center bg-none border-none text-zinc-800 cursor-pointer p-1 rounded relative w-[30px] h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                    </button>
                                </DropDownTrigger>
                            </ToolTipTrigger>
                            <ToolTip>
                                Page options
                            </ToolTip>
                            <DropDown >
                                <DropDownSectionTitle>
                                    Page options
                                </DropDownSectionTitle>
                                <DropDownSection>
                                    <DropDownExtensionContainer>
                                        <DropDownExtensionTrigger hover>
                                            <DropDownItem >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                                <p>Info</p>
                                            </DropDownItem>
                                        </DropDownExtensionTrigger>
                                        <DropDownExtension>
                                            <DropDownSectionTitle>
                                                Info
                                            </DropDownSectionTitle>
                                            <DropDownSection>
                                                <DropDownItem>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-case-upper"><path d="m3 15 4-8 4 8" /><path d="M4 13h6" /><path d="M15 11h4.5a2 2 0 0 1 0 4H15V7h4a2 2 0 0 1 0 4" /></svg>
                                                    <p>Title: {pageInfo.title}</p>
                                                </DropDownItem>
                                                <DropDownItem>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-z-a"><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /><path d="M15 4h5l-5 6h5" /><path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" /><path d="M20 18h-5" /></svg>
                                                    <p>Word Count: {pageInfo.wordCount}</p>
                                                </DropDownItem>
                                                <DropDownItem>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h5" /><path d="M17.5 17.5 16 16.25V14" /><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" /></svg>
                                                    <p>Created: {new Date(pageInfo.created).toLocaleString()}</p>
                                                </DropDownItem>
                                                <DropDownItem>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
                                                    <p>Owner: {pageInfo.owner}</p>
                                                </DropDownItem>
                                                <DropDownItem>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-view"><path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" /><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" /><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" /></svg>
                                                    <p style={{ display: "flex", gap: '5px' }}>Shared: {pageInfo.shared ? (<p style={{ color: 'green' }}>true</p>) : (<p style={{ color: 'red' }}>false</p>)}</p>
                                                </DropDownItem>
                                                <DropDownItem>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-party-popper"><path d="M5.8 11.3 2 22l10.7-3.79" /><path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" /><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" /><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" /><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" /><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" /></svg>
                                                    <p style={{ display: 'flex', alignItems: 'center', gap: '7px' }} >Icon: {pageInfo.icon && pageInfo.icon.includes('.png') ? (<img width='16' height='16' src={`/emoji/twitter/64/${pageInfo.icon}`} />) : (!isNaN(parseInt(pageInfo.icon, 16)) && String.fromCodePoint(parseInt(pageInfo.icon, 16)))}
                                                    </p>
                                                </DropDownItem>
                                            </DropDownSection>
                                        </DropDownExtension>
                                    </DropDownExtensionContainer>
                                    <DropDownExtensionContainer>
                                        <DropDownExtensionTrigger hover>
                                            <DropDownItem>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                                                <p>Share</p>
                                            </DropDownItem>
                                        </DropDownExtensionTrigger>
                                        <DropDownExtension>
                                            <DropDownSectionTitle>
                                                Share
                                            </DropDownSectionTitle>
                                            <DropDownSection>
                                                <DropDownItem>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                                    <p style={{ width: '100%', overflow: 'hidden' }}>Link: <span style={{ width: '100%', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{process.env.NEXT_PUBLIC_CURRENTURL}/page/view/{currentPage}</span></p>
                                                </DropDownItem>
                                                {filteredItems.find((Apage) => Apage?.id === currentPage)?.shared ? (
                                                    <>
                                                        <DropDownItem onClick={(e) => {
                                                            async function CopyStuff() {
                                                                await handleCopyTextToClipboard(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/view/${currentPage}`, e)
                                                                const icondiv = document.getElementById('copyicon')
                                                                const oldIcon = icondiv.innerHTML
                                                                icondiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>'
                                                                setTimeout(() => {
                                                                    icondiv.innerHTML = oldIcon
                                                                }, 1000);
                                                            }
                                                            CopyStuff()
                                                        }}>
                                                            <div id="copyicon" className='w-4 h-4 object-contain overflow-hidden mr-2'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                                            </div>
                                                            <p>Copy to clipboard</p>
                                                        </DropDownItem>
                                                        <DropDownItem onClick={handleSharePage}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            <p>Make page private</p>
                                                        </DropDownItem>
                                                    </>
                                                ) : (
                                                    <>
                                                        <DropDownItem onClick={handleSharePage}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                                            <p>Make page public</p>
                                                        </DropDownItem>
                                                    </>
                                                )}

                                            </DropDownSection>
                                        </DropDownExtension>
                                    </DropDownExtensionContainer>



                                    <DropDownItem onClick={() => handleArchivePageToggle()}>
                                        {listedPageItems.find((Apage) => Apage.id === currentPage)?.archived ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive-restore"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h2" /><path d="M20 8v11a2 2 0 0 1-2 2h-2" /><path d="m9 15 3-3 3 3" /><path d="M12 12v9" /></svg>
                                                Un-archive
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>
                                                Archive
                                            </>
                                        )}
                                    </DropDownItem>

                                    <DropDownItem
                                        onClick={() => handleDeletePage()} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        <p >Delete</p>

                                    </DropDownItem>
                                </DropDownSection>
                            </DropDown >
                        </DropDownContainer>
                    </ToolTipCon>
                </div>
            </div>

        </>
    );
}


function TabBar() {
    const { currentPage, listedPageItems } = useEditorContext()
    const [recentPages, setRecentPages] = useState([])
    useEffect(() => {
        function useRegex(input) {
            let regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
            return regex.test(input);
        }
        if (useRegex(currentPage)) {
            setRecentPages(prevItems => prevItems.includes(currentPage) ? prevItems : [...prevItems, currentPage])
        }
    }, [currentPage])
    return (
        <div className='flex items-center gap-0 h-full overflow-x-scroll overflow-y-hidden gap-1 pt-1'>
            {recentPages.map((item) => (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        Router.push(`/page/${item}`);
                    }}
                    className={`rounded-tl-lg border-l border-r border-t border-b-0  rounded-tr-lg text-sm text-zinc-600 h-full px-3 flex items-center hover:bg-zinc-200 cursor-pointer ${currentPage === item ? " border-zinc-300  border-2 shadow-xl" : "border-zinc-50"}`}
                >

                    {listedPageItems.find((aitem) => aitem.id === item)?.icon && (
                        <img className='w-4 h-4 mr-2' src={`/emoji/twitter/64/${listedPageItems.find((aitem) => aitem.id === item)?.icon}`} />
                    )}
                    <span className='text-nowrap'>
                        {listedPageItems.find((aitem) => aitem.id === item)?.title || item}
                    </span>
                    <ToolTipCon>
                        <ToolTipTrigger>
                            <X
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRecentPages((prevItems) =>
                                        prevItems.filter((aitem) => aitem !== item)
                                    );
                                }}
                                className="w-4 h-4 ml-2 text-zinc-400"
                            />
                            <span className='sr-only'>Close tab</span>
                        </ToolTipTrigger>
                        <ToolTip>
                            Close
                        </ToolTip>
                    </ToolTipCon>
                </div>

            ))}
        </div>

    )


}
