import Router from 'next/router';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/toast';
import { ToolTip, ToolTipCon, ToolTipTrigger } from '@/components/UX-Components/Tooltip';
import { useEditorContext } from '@/pages/page';
import { DropDown, DropDownContainer, DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from '@/lib/Pop-Cards/DropDown';
import { Link } from '../../UX-Components';
import { CalendarDays, CircleUser, Share2, PartyPopper, Archive, ArchiveRestore, Baseline, CaseLower, Copy, Eye, EyeOff, Info, PanelRightDashed, Settings2, Share, Space, Trash2Icon, WholeWord } from 'lucide-react';
import { updateItem } from '../../ListPages';
import { CountCharacters, CountWords } from './helpers';
export default function MenuBar({ currentPageData }) {
    const { currentPage, visible, listedPageItems } = useEditorContext()
    const [activePage, setActivePage] = useState({})
    const [filteredItems, setFilteredItems] = useState([]);
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        if (window.innerWidth < 450) {
            setIsMobile(true)
        }
    }, [])
    useEffect(() => {
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

    return (
        <>
            <div className="w-full h-[45px] min-h-[45px] max-h-[45px] pl-2 pr-2 flex justify-between items-center bg-zinc-50 overflow-y-hidden">
                <div className='flex items-center h-full'>
                    <button onClick={() => {
                        const queryParams = new URLSearchParams(window.location.search)
                        queryParams.set("side", !visible)
                        Router.push(`/page?${queryParams.toString()}`)
                    }} type='button' className="flex items-center justify-center bg-none border-none text-zinc-800 cursor-pointer p-1 rounded relative w-[30px] h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="15" x2="15" y1="3" y2="21" /></svg>
                    </button>
                </div>
                <>
                    {!isMobile ? (
                        //Not mobile
                        <>
                            <FolderList folderTree={filteredItems} />
                        </>
                    ) : (
                        <div className="flex items-center text-zinc-800 w-full">
                            <div className="flex items-center justify-center relative cursor-pointer">
                                <div className="flex gap-1 items-center text-[14px] font-[600] text-zinc-600 rounded p-[0.5em] hover:bg-zinc-200">
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        {activePage?.icon && activePage?.icon.includes('.png') ? (<img src={`/emoji/twitter/64/${activePage?.icon}`} />) : null}
                                    </div>
                                    {activePage?.title || activePage?.id}
                                </div>
                            </div>
                        </div>
                    )}
                </>
                <div className="flex items-center justify-end gap-0  min-w-[100px]">
                    <DropDownMenu currentPageData={currentPageData} />
                </div>
            </div>

        </>
    );
}

function FolderList({ folderTree }) {
    return (
        <>
            <div className="flex items-center text-zinc-800 w-full">
                {folderTree.length >= 1 && folderTree[0]?.id ? folderTree.map((page, index) => (
                    <>
                        <div className="flex items-center justify-center relative cursor-pointer relative" key={page.id + "-" + index}>
                            <Link className="flex gap-1 items-center text-[14px] font-[600] text-zinc-600 rounded p-[0.5em] hover:bg-zinc-200" onClick={() => {
                                const params = new URLSearchParams(window.location.search)
                                params.set("edit", page.id)
                                Router.push(`/page?${params.toString()}`);
                            }}>
                                {page?.icon && page?.icon.includes('.png') ? (
                                    <div aria-label='page icon' className="w-4 h-4 flex items-center justify-center">
                                        <img src={`/emoji/twitter/64/${page.icon}`} />
                                    </div>
                                ) : null}
                                <span aria-label='Page title'>{page?.title || page.id}</span>
                            </Link>
                        </div>
                        {index < folderTree.length - 1 && (<div className='text-zinc-300 flex items-center justify-center mx-1'>/</div>)}
                    </>
                )) : null}

            </div>
        </>
    )
}

function DropDownMenu({ currentPageData }) {
    const { pb, currentPage, setListedPageItems, listedPageItems } = useEditorContext()
    const [pageInfo, setPageInfo] = useState({})



    async function handleSharePage() {
        const data = {
            shared: !listedPageItems.find((Apage) => Apage.id === currentPage)?.shared,
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

        updateItem("shared", data.shared, currentPage, listedPageItems, setListedPageItems)

        await pb.collection("pages").update(currentPage, data);
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
        updateItem("archived", newState, currentPage, listedPageItems, setListedPageItems)
        await pb.collection('pages').update(currentPage, { archived: newState });
        toaster.success(`Page ${newState ? 'archived' : 'restored'} successfully`)
    }

    async function copyPageShareUrl(e) {
        await handleCopyTextToClipboard(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/view/${currentPage}`, e)
    }

    async function getPageData(pageData) {
        try {
            const record = pageData
            const input = record.content
            const { totalWords, uniqueWords } = CountWords(input)
            const totalChartersWithSpaces = CountCharacters(input, true)
            const totalChartersWithoutSpaces = CountCharacters(input, false)
            //console.log(words, words.length)
            setPageInfo({ ...record, wordCount: totalWords, uniqueWords: uniqueWords, chartersWithSpaces: totalChartersWithSpaces, chartersWithoutSpaces: totalChartersWithoutSpaces })
        } catch {
            return
        }
    }

    useEffect(() => {
        //Update when the page is changed on nav, because sometimes is doesn't :(
        getPageData(currentPageData)
    }, [currentPage, currentPageData])

    return (
        <>
            <ToolTipCon>
                <DropDownContainer>
                    <ToolTipTrigger>
                        <DropDownTrigger afterTrigger={() => getPageData()}>
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
                                            Title: {pageInfo.title}
                                        </DropDownItem>
                                        <DropDownItem>
                                            <CalendarDays />
                                            Created: {new Date(pageInfo.created).toLocaleString()}
                                        </DropDownItem>
                                        <DropDownItem>
                                            <CircleUser />
                                            Owner: {pageInfo.owner}
                                        </DropDownItem>
                                        <DropDownItem>
                                            <Share2 />
                                            Shared: {pageInfo.shared ? (<p style={{ color: 'green' }}>true</p>) : (<p style={{ color: 'red' }}>false</p>)}
                                        </DropDownItem>
                                        <DropDownItem>
                                            <PartyPopper />
                                            Icon: {pageInfo.icon && pageInfo.icon.includes('.png') ? (<img width='16' height='16' src={`/emoji/twitter/64/${pageInfo.icon}`} />) : (!isNaN(parseInt(pageInfo.icon, 16)) && String.fromCodePoint(parseInt(pageInfo.icon, 16)))}

                                        </DropDownItem>
                                    </DropDownSection>
                                    <DropDownSection>
                                        <DropDownItem>
                                            <WholeWord />
                                            Word Count: {pageInfo.wordCount}
                                        </DropDownItem>
                                        <DropDownItem>
                                            <WholeWord />
                                            Unique Words: {pageInfo.uniqueWords}
                                        </DropDownItem>
                                        <DropDownItem>
                                            <CaseLower />
                                            Total charters: {pageInfo.chartersWithoutSpaces}
                                        </DropDownItem>
                                        <DropDownItem>
                                            <Space />
                                            With spaces: {pageInfo.chartersWithSpaces}
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
                                        {listedPageItems.find((Apage) => Apage?.id === currentPage)?.shared ? (
                                            <>
                                                <DropDownItem className="active:border-zinc-200 border border-transparent" onClick={copyPageShareUrl}>
                                                    <Copy />
                                                    Copy link to clipboard
                                                </DropDownItem>
                                                <DropDownItem onClick={handleSharePage}>
                                                    <EyeOff />
                                                    Make page private
                                                </DropDownItem>
                                            </>
                                        ) : (
                                            <>
                                                <DropDownItem onClick={handleSharePage}>
                                                    <Eye />
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
            </ToolTipCon >
        </>
    )
}

