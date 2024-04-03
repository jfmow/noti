import Router from 'next/router';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/toast';
import { ToolTip, ToolTipCon, ToolTipTrigger } from '@/components/UX-Components/Tooltip';
import { useEditorContext } from '@/pages/page';
import { DropDown, DropDownContainer, DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from '@/lib/Pop-Cards/DropDown';
import { updateListedPages } from '../Item';
import { Link } from '../UX-Components';
import { AppWindow, Archive, ArchiveRestore, Baseline, CaseLower, Check, Copy, Eye, EyeOff, Info, Link2, PanelRightDashed, PanelTopDashed, Settings2, Share, Space, TextCursor, Trash2Icon, WholeWord, X } from 'lucide-react';
import { debounce } from 'lodash';
export default function MenuBar({ currentPageData }) {
    const { pb, currentPage, setVisible, visible, setListedPageItems, listedPageItems } = useEditorContext()
    const [activePage, setActivePage] = useState({})
    const [filteredItems, setFilteredItems] = useState([]);
    const [pageInfo, setPageInfo] = useState({})
    const [isMobile, setIsMobile] = useState(false)
    const [hoveringTabItem, setHoveringTabItem] = useState({ id: '', position: null })
    const [copyIcon, setCopyIcon] = useState(<Copy />)
    useEffect(() => {
        if (window.innerWidth < 450) {
            setIsMobile(true)
        }
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

        function CountWords(content) {
            let totalWords = 0;
            if (!content || content === undefined) return 0
            const data = JSON.parse(JSON.stringify(content).replace(/<[^>]*>/g, ''));

            data.blocks.forEach(block => {
                if (block.data && block.data.text) {
                    const text = block.data.text;
                    const words = text.match(/\b\w+(?:['-]\w+)?\b/g); // Split by word boundaries
                    words.forEach(word => {
                        //console.log(`Word at position ${totalWords}: ${word}`);
                        totalWords++;
                    });
                }

                if (block.data && block.data.items) {
                    const printNestedListWords = (items) => {
                        items.forEach(item => {
                            if (item.content) {
                                const nestedWords = item.content.match(/\b\w+(?:['-]\w+)?\b/g);
                                nestedWords.forEach(word => {
                                    //console.log(`Word at position ${totalWords}: ${word}`);
                                    totalWords++;
                                });
                            }
                            if (item.items) {
                                printNestedListWords(item.items);
                            }
                        });
                    };
                    printNestedListWords(block.data.items);
                }

                if (block.data && block.data.content) {
                    const tableContent = block.data.content.flat().filter(cell => typeof cell === 'string');
                    const words = tableContent.join(' ').match(/\b\w+(?:['-]\w+)?\b/g);
                    words.forEach(word => {
                        //console.log(`Word at position ${totalWords}: ${word}`);
                        totalWords++;
                    });
                }
            });

            return totalWords

        }
        function CountCharacters(content, includeSpaces = true) {
            let totalCharacters = 0;
            if (!content || content === undefined) return 0
            const data = JSON.parse(JSON.stringify(content).replace(/<[^>]*>/g, ''));


            data.blocks.forEach(block => {
                if (block.data && block.data.text) {
                    const text = block.data.text;
                    totalCharacters += includeSpaces ? text.length : text.replace(/\s/g, '').length;
                }

                if (block.data && block.data.items) {
                    const countNestedListCharacters = (items) => {
                        let nestedListCharacters = 0;
                        items.forEach(item => {
                            if (item.content) {
                                nestedListCharacters += includeSpaces ? item.content.length : item.content.replace(/\s/g, '').length;
                            }
                            if (item.items) {
                                nestedListCharacters += countNestedListCharacters(item.items);
                            }
                        });
                        return nestedListCharacters;
                    };
                    totalCharacters += countNestedListCharacters(block.data.items);
                }

                if (block.data && block.data.content) {
                    const tableContent = block.data.content.flat().filter(cell => typeof cell === 'string');
                    const text = tableContent.join(' ');
                    totalCharacters += includeSpaces ? text.length : text.replace(/\s/g, '').length;
                }
            });

            return totalCharacters;
        }


        async function getPageData() {
            try {
                const record = currentPageData
                const input = record.content
                const totalWords = CountWords(input)
                const totalChartersWithSpaces = CountCharacters(input, true)
                const totalChartersWithoutSpaces = CountCharacters(input, false)
                //console.log(words, words.length)
                setPageInfo({ ...record, wordCount: totalWords, chartersWithSpaces: totalChartersWithSpaces, chartersWithoutSpaces: totalChartersWithoutSpaces })
            } catch {
                return
            }
        }
        getPageData()



    }, [listedPageItems, currentPage, currentPageData])

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
            window.location.replace(`/page`)
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

    const debounceSetHoveringTabItem = debounce(setHoveredTabItem, 200)
    const debounceUNSetHoveringTabItem = debounce(unSetHoveredTabItem, 300)


    function setHoveredTabItem(data, itemId) {
        if (itemId !== hoveringTabItem.id) {
            debounceUNSetHoveringTabItem.cancel()
            setHoveringTabItem(data)
        } else {

        }
    }
    function unSetHoveredTabItem(itemId) {
        if (itemId === hoveringTabItem.id) {
            setHoveringTabItem({ id: "", position: "" })
        }
    }


    function renderTree(items, parentId = "") {
        const filteredItems = items.filter(item => item.parentId === parentId);
        if (filteredItems.length === 0) {
            return null;
        }

        return (
            <>
                <div onMouseEnter={() => debounceUNSetHoveringTabItem.cancel()} className='animate-fade-in bg-zinc-100 shadow-lg p-2 grid gap-1 rounded-lg fixed bottom-[-10px] z-[2] min-w-[200px]' style={{ top: hoveringTabItem.position.bottom + 10 + "px", left: hoveringTabItem.position.left + "px", bottom: 'auto' }} aria-haspopup aria-label='sub pages dropdown' >

                    {filteredItems.map(item => (
                        <>
                            <Link className='flex items-center gap-1 p-1 rounded hover:bg-zinc-200' onClick={() => {
                                const params = new URLSearchParams(window.location.search)
                                params.set("edit", item.id)
                                Router.push(`/page?${params.toString()}`);
                            }}>
                                {item.icon ? (
                                    <div aria-label='page icon' className="w-4 h-4 flex items-center justify-center">
                                        {item?.icon && item?.icon.includes('.png') ? (<img src={`/emoji/twitter/64/${item?.icon}`} />) : (!isNaN(parseInt(item?.icon, 16)) && String.fromCodePoint(parseInt(item?.icon, 16)))}
                                    </div>
                                ) : null}
                                <span aria-label='Page title'>{item?.title || item?.id}</span>
                            </Link>
                        </>
                    ))}
                </div>
            </>
        );
    }

    async function copyPageShareUrl(e) {
        await handleCopyTextToClipboard(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/view/${currentPage}`, e)
        setCopyIcon(<Check />)
        setTimeout(() => {
            setCopyIcon(<Copy />)
        }, 1000);
    }


    return (
        <>
            <div className="w-full h-[45px] min-h-[45px] max-h-[45px] pl-2 pr-2 flex justify-between items-center bg-[#ffffff70] backdrop-blur-md absolute z-[2] overflow-y-hidden">
                <div className='flex items-center h-full'>
                    <button onClick={() => {
                        const queryParams = new URLSearchParams(window.location.search)
                        queryParams.set("side", !visible)
                        Router.push(`/page?${queryParams.toString()}`)
                    }} type='button' className="flex items-center justify-center bg-none border-none text-zinc-800 cursor-pointer p-1 rounded relative w-[30px] h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="15" x2="15" y1="3" y2="21" /></svg>
                    </button>
                </div>
                <div className="flex items-center text-zinc-800 w-full">
                    {!isMobile ? (
                        //Not mobile
                        <>
                            {filteredItems.map((item, index) => (
                                <>
                                    <div onMouseLeave={() => debounceUNSetHoveringTabItem(item.id)} onMouseEnter={(e) => {
                                        debounceSetHoveringTabItem({ id: item.id, position: e.currentTarget.getBoundingClientRect() }, item.id)
                                    }} className="flex items-center justify-center relative cursor-pointer relative" key={index}>
                                        <Link className="flex gap-1 items-center text-[14px] font-[600] text-zinc-600 rounded p-[0.5em] hover:bg-zinc-200" onClick={() => {
                                            const params = new URLSearchParams(window.location.search)
                                            params.set("edit", item.id)
                                            Router.push(`/page?${params.toString()}`);
                                        }}>
                                            {item?.icon && (
                                                <div aria-label='page icon' className="w-4 h-4 flex items-center justify-center">
                                                    {item?.icon && item?.icon.includes('.png') ? (<img src={`/emoji/twitter/64/${item?.icon}`} />) : (!isNaN(parseInt(item?.icon, 16)) && String.fromCodePoint(parseInt(item?.icon, 16)))}
                                                </div>
                                            )}
                                            <span aria-label='Page title'>{item?.title || item?.id}</span>
                                        </Link>

                                        {hoveringTabItem.id && hoveringTabItem.id === item.id ? (
                                            renderTree(listedPageItems, item.id)
                                        ) : null}

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
                                <div className="flex gap-1 items-center text-[14px] font-[600] text-zinc-600 rounded p-[0.5em] hover:bg-zinc-200">
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        {activePage?.icon && activePage?.icon.includes('.png') ? (<img src={`/emoji/twitter/64/${activePage?.icon}`} />) : (!isNaN(parseInt(activePage?.icon, 16)) && String.fromCodePoint(parseInt(activePage?.icon, 16)))}
                                    </div>
                                    {activePage?.title || activePage?.id}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center justify-end gap-0  min-w-[100px]">
                    <ToolTipCon>
                        <DropDownContainer>
                            <ToolTipTrigger>
                                <DropDownTrigger>
                                    <button className="flex items-center justify-center bg-none border-none text-zinc-800 cursor-pointer p-1 rounded relative w-[30px] h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4">
                                        <Settings2 />
                                    </button>
                                </DropDownTrigger>
                            </ToolTipTrigger>
                            <ToolTip>
                                Page settings
                            </ToolTip>
                            <DropDown >
                                <DropDownSectionTitle>
                                    Settings
                                </DropDownSectionTitle>
                                <DropDownSection>
                                    <DropDownItem onClick={() => Router.push(`/page?p=${currentPage}&pm=s`)}>
                                        <PanelRightDashed />
                                        Peek page
                                    </DropDownItem>
                                    <DropDownExtensionContainer>
                                        <DropDownExtensionTrigger hover>
                                            <DropDownItem >
                                                <Info />
                                                Info
                                            </DropDownItem>
                                        </DropDownExtensionTrigger>
                                        <DropDownExtension>
                                            <DropDownSectionTitle>
                                                Info
                                            </DropDownSectionTitle>
                                            <DropDownSection>
                                                <DropDownItem>
                                                    <Baseline />
                                                    <p>Title: {pageInfo.title}</p>
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
                                            <DropDownSection>
                                                <DropDownItem>
                                                    <WholeWord />
                                                    <p>Word Count: {pageInfo.wordCount}</p>
                                                </DropDownItem>
                                                <DropDownItem>
                                                    <CaseLower />
                                                    Total charters: {pageInfo.chartersWithSpaces}
                                                </DropDownItem>
                                                <DropDownItem>
                                                    <Space />
                                                    Without spaces: {pageInfo.chartersWithoutSpaces}
                                                </DropDownItem>
                                            </DropDownSection>
                                        </DropDownExtension>
                                    </DropDownExtensionContainer>
                                    <DropDownExtensionContainer>
                                        <DropDownExtensionTrigger hover>
                                            <DropDownItem>
                                                <Share />
                                                Share
                                            </DropDownItem>
                                        </DropDownExtensionTrigger>
                                        <DropDownExtension>
                                            <DropDownSectionTitle>
                                                Share
                                            </DropDownSectionTitle>
                                            <DropDownSection>
                                                <DropDownItem>
                                                    <Link2 />
                                                    <p style={{ width: '100%', overflow: 'hidden' }}>Link: <span style={{ width: '100%', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{process.env.NEXT_PUBLIC_CURRENTURL}/page/view/{currentPage}</span></p>
                                                </DropDownItem>
                                                {filteredItems.find((Apage) => Apage?.id === currentPage)?.shared ? (
                                                    <>
                                                        <DropDownItem onClick={copyPageShareUrl}>
                                                            {copyIcon}
                                                            Copy to clipboard
                                                        </DropDownItem>
                                                        <DropDownItem onClick={handleSharePage}>
                                                            <Eye />
                                                            Make page private
                                                        </DropDownItem>
                                                    </>
                                                ) : (
                                                    <>
                                                        <DropDownItem onClick={handleSharePage}>
                                                            <EyeOff />
                                                            Make page public
                                                        </DropDownItem>
                                                    </>
                                                )}

                                            </DropDownSection>
                                        </DropDownExtension>
                                    </DropDownExtensionContainer>



                                    <DropDownItem onClick={() => handleArchivePageToggle()}>
                                        {listedPageItems.find((Apage) => Apage.id === currentPage)?.archived ? (
                                            <>
                                                <ArchiveRestore />
                                                Un-archive
                                            </>
                                        ) : (
                                            <>
                                                <Archive />
                                                Archive
                                            </>
                                        )}
                                    </DropDownItem>

                                    <DropDownItem
                                        onClick={() => handleDeletePage()} >
                                        <Trash2Icon />
                                        Delete

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

