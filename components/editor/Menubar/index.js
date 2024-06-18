import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/toast';
import { ToolTip, ToolTipCon, ToolTipTrigger } from '@/components/UX-Components/Tooltip';
import { useEditorContext } from '@/pages/page';
import { DropDown, DropDownContainer, DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from '@/lib/Pop-Cards/DropDown';
import Link from '@/components/Link';
import { CalendarDays, CircleUser, BookDashed, Pencil, Share2, PartyPopper, Archive, ArchiveRestore, Baseline, CaseLower, Copy, Eye, EyeOff, Info, PanelRightDashed, Settings2, Share, Space, Trash2Icon, WholeWord } from 'lucide-react';
import { handleFindRecordAndAncestors, handleFindRecordById, handleUpdateRecord } from '@/components/Pages List/helpers';
import { CountCharacters, CountWords } from './helpers';
export default function MenuBar({ currentPageData }) {
    const { currentPage, visible, listedPageItems } = useEditorContext()
    const [activePage, setActivePage] = useState({})
    const [filteredItems, setFilteredItems] = useState([]);
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        if (window.innerWidth < 640) {
            setIsMobile(true)
        }
    }, [])
    useEffect(() => {
        setFilteredItems(handleFindRecordAndAncestors(currentPage, listedPageItems));
    }, [listedPageItems, currentPage]);

    return (
        <>
            <div id="hidemewhenprinting" className="w-full h-[45px] min-h-[45px] max-h-[45px] pl-2 pr-2 flex justify-between items-center bg-zinc-50 overflow-y-hidden">
                <div className='flex items-center h-full'>
                    <button onClick={() => {
                        const queryParams = new URLSearchParams(window.location.search)
                        queryParams.set("side", !visible)
                        Router.push(`/page?${queryParams.toString()}`)
                    }} type='button' className="flex items-center justify-center bg-none border-none text-zinc-800 cursor-pointer p-1 rounded relative w-[30px] h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right rotate-180"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="15" x2="15" y1="3" y2="21" /></svg>
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
                <div className="flex items-center justify-end gap-1  min-w-[100px]">
                    <WordCountDisplay currentPageData={currentPageData} />
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
                                <span aria-label='Page title' className='text-ellipsis text-nowrap overflow-hidden max-w-[200px]'>{page?.title || page.id}</span>
                            </Link>
                        </div>
                        {index < folderTree.length - 1 && (<div className='text-zinc-300 flex items-center justify-center mx-1'>/</div>)}
                    </>
                )) : null}

            </div>
        </>
    )
}

function WordCountDisplay({ currentPageData }) {
    const { pb, currentPage, setListedPageItems, listedPageItems } = useEditorContext()
    const [pageInfo, setPageInfo] = useState({ wordCount: 0, uniqueWords: 0, chartersWithSpaces: 0, chartersWithoutSpaces: 0 })
    const { query } = useRouter()
    async function getPageData(pageData) {
        try {
            const record = pageData
            const input = record.content
            const { totalWords, uniqueWords } = CountWords(input)
            const totalChartersWithSpaces = CountCharacters(input, true)
            const totalChartersWithoutSpaces = CountCharacters(input, false)
            //console.log(words, words.length)
            setPageInfo({ wordCount: totalWords, uniqueWords: uniqueWords, chartersWithSpaces: totalChartersWithSpaces, chartersWithoutSpaces: totalChartersWithoutSpaces })
        } catch {
            return
        }
    }

    useEffect(() => {
        getPageData(currentPageData)
    }, [currentPage, currentPageData])

    if (query?.wordcount === "true") {
        return (
            <DropDownContainer>
                <DropDownTrigger>
                    <button className="text-xs font-medium text-nowrap h-[30px] flex items-center justify-center bg-none border-none text-zinc-800 cursor-pointer p-1 rounded relative w-fit hover:bg-zinc-200">
                        {pageInfo.wordCount} Words
                    </button>
                </DropDownTrigger>
                <DropDown>
                    <DropDownSectionTitle>
                        Word count
                    </DropDownSectionTitle>
                    <DropDownSection>
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
                </DropDown>
            </DropDownContainer>
        )

    } else {
        return <></>
    }
}

function DropDownMenu({ currentPageData }) {
    const { pb, currentPage, setListedPageItems, listedPageItems } = useEditorContext()
    const [pageInfo, setPageInfo] = useState({})

    async function handleSharePage() {
        const data = {
            shared: !handleFindRecordById(currentPage, listedPageItems).shared,
        };

        handleUpdateRecord(currentPageData.id, { shared: data.shared }, setListedPageItems)

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
        const newState = !handleFindRecordById(currentPage, listedPageItems).archived
        handleUpdateRecord(currentPageData.id, { archived: newState }, setListedPageItems)
        await pb.collection('pages').update(currentPage, { archived: newState });
        toaster.success(`Page ${newState ? 'archived' : 'restored'} successfully`)
    }
    async function handleReadOnlyPageToggle() {
        const newState = !handleFindRecordById(currentPage, listedPageItems).read_only
        handleUpdateRecord(currentPageData.id, { read_only: newState }, setListedPageItems)
        await pb.collection('pages').update(currentPage, { read_only: newState });
        toaster.success(`Page ${newState ? 'set to read only' : 'editing allowed'} successfully`)
        setTimeout(() => {
            window.location.reload()
        }, 1200);
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

    function handleDuplicatePage() {
        const formData = new FormData()
        formData.set("page", currentPage)
        fetch(`${process.env.NEXT_PUBLIC_POCKETURL}/api/page/duplicate`, { method: "POST", body: formData, headers: { Authorization: pb.authStore.token } }).then(async (res) => {
            if (res.ok) {
                const nid = await res.text()
                const queryParams = new URLSearchParams(window.location.search)
                queryParams.set("edit", nid)
                window.location.replace(`/page?${queryParams.toString()}`)
            } else {
                toaster.error("A problem occured while duplicating the page.")
            }
        })
    }

    function handleToggleShowWordCounter() {
        const queryParams = new URLSearchParams(window.location.search)
        if (queryParams.has("wordcount")) {
            if (queryParams.get("wordcount") === "true") {
                queryParams.set("wordcount", "false")
            } else {
                queryParams.set("wordcount", "true")
            }
        } else {
            queryParams.set("wordcount", "true")
        }
        Router.push(`/page?${queryParams.toString()}`)
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
                            <DropDownItem onClick={() => window.location.replace(`/page?p=${currentPage}&pm=s`)}>
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
                                </DropDownExtension>
                            </DropDownExtensionContainer>
                            <DropDownExtensionContainer>
                                <DropDownExtensionTrigger>
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
                                        {handleFindRecordById(currentPage, listedPageItems)?.shared ? (
                                            <>
                                                <DropDownItem onClick={copyPageShareUrl}>
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
                                {handleFindRecordById(currentPage, listedPageItems).archived ? (
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
                            <DropDownItem onClick={() => handleReadOnlyPageToggle()}>
                                {handleFindRecordById(currentPage, listedPageItems).read_only ? (
                                    <>
                                        <Pencil />
                                        Allow editing
                                    </>
                                ) : (
                                    <>
                                        <BookDashed />
                                        Make page read only
                                    </>
                                )}
                            </DropDownItem>
                            <DropDownItem onClick={handleToggleShowWordCounter}>
                                <WholeWord />
                                Toggle Word Count
                            </DropDownItem>
                            <DropDownItem
                                onClick={() => handleDuplicatePage()} >
                                <Copy />
                                Duplicate

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

