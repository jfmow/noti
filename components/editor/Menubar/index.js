import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/toast';
import { ToolTip, ToolTipCon, ToolTipTrigger } from '@/components/UX-Components/Tooltip';
import { DropDown, DropDownContainer, DropDownExtension, DropDownExtensionContainer, DropDownExtensionTrigger, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from '@/lib/Pop-Cards/DropDown';
import Link from '@/components/Link';
import { CalendarDays, CircleUser, TextSelect, BookDashed, Pencil, Share2, PartyPopper, Archive, ArchiveRestore, Baseline, CaseLower, Copy, Eye, EyeOff, Info, PanelRightDashed, Settings2, Share, Space, Trash2Icon, WholeWord, Settings, PanelRight, Paintbrush, Printer } from 'lucide-react';
import { CountCharacters, CountWords } from './helpers';
import { SendPageChanges } from '@/lib/Page state manager';
import { findPageListPage } from '@/components/Pages List/list-functions';
import pb from '@/lib/pocketbase';
import ThemePickerPopup from '@/components/Themes';
import UserOptions from '@/components/user-info';
import isMobileScreen from '@/lib/ismobile';

export function MenuBarButton({ ...props }) {
    if (props.type === "button") {
        return (
            <button {...props} className={`flex items-center justify-center bg-none border-none text-[12px] font-[600] text-zinc-600 cursor-pointer p-1 rounded relative min-w-[30px] min-h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4 ${props.className}`}>
                {props.children}
            </button>
        )
    }
    return (
        <div {...props} className={`flex items-center justify-center bg-none border-none text-[12px] font-[600] text-zinc-600 cursor-pointer p-1 rounded relative min-w-[30px] min-h-[30px] hover:bg-zinc-200 [&>svg]:w-4 [&>svg]:h-4 ${props.className}`}>
            {props.children}
        </div>
    )
}

export default function MenuBar({ sidebarstate, currentPageData, currentPage, listedPageItems, unauthed = false }) {

    if (!listedPageItems || !currentPage || !currentPageData) {
        return <></>
    }

    function toggleSideParam() {
        const queryParams = new URLSearchParams(window.location.search)
        const newState = queryParams.has("side") && queryParams.get("side") === "false" ? "true" : "false"
        queryParams.set("side", newState)
        Router.push(`/page?${queryParams.toString()}`)
    }

    return (
        <>

            <div id="hidemewhenprinting" className="overflow-x-hidden w-full h-[40px] min-h-[40px] max-h-[40px] z-[3] pl-2 pr-2 flex justify-between items-center bg-zinc-50 overflow-y-hidden">
                {!unauthed ? (
                    <>
                        <UserOptions clss={isMobileScreen() ? (sidebarstate ? "" : "hidden") : ""} />

                        <div className='flex items-center h-full mr-1'>

                            <MenuBarButton onClick={toggleSideParam} type='button'>
                                <PanelRight className='rotate-180 text-zinc-600' />
                            </MenuBarButton>
                        </div>
                    </>
                ) : null}


                <FolderList currentPageData={currentPageData} currentPage={currentPage} listedPageItems={listedPageItems} />
                <div className="flex items-center justify-end gap-1  min-w-[100px]">
                    <WordCountDisplay currentPageData={currentPageData} defaultVisible={unauthed} />
                    <DropDownContainer>
                        <DropDownTrigger>
                            <ToolTipCon>
                                <ToolTipTrigger>
                                    <MenuBarButton>
                                        <Paintbrush className='text-zinc-600' />
                                    </MenuBarButton>
                                </ToolTipTrigger>
                                <ToolTip>
                                    Themes
                                </ToolTip>
                            </ToolTipCon>
                        </DropDownTrigger>
                        <DropDown>
                            <DropDownSectionTitle>
                                Themes
                            </DropDownSectionTitle>
                            <ThemePickerPopup />
                        </DropDown>
                    </DropDownContainer>
                    <ToolTipCon>
                        <ToolTip>
                            Print
                        </ToolTip>
                        <ToolTipTrigger>
                            <MenuBarButton type="button" onClick={() => print()}>
                                <Printer />
                            </MenuBarButton>
                        </ToolTipTrigger>
                    </ToolTipCon>
                    {!unauthed ? (
                        <DropDownMenu currentPageData={currentPageData} listedPageItems={listedPageItems} currentPage={currentPage} />
                    ) : null}

                </div>
            </div>

        </>
    );
}

function FolderList({ currentPageData, currentPage, listedPageItems }) {
    const [isMobile, setIsMobile] = useState(false)
    const [folderTree, setFolderTree] = useState([])
    useEffect(() => {
        if (window.innerWidth < 640) {
            setIsMobile(true)
            return
        }
        function findItemAndParentsUnsorted(data, id) {
            // Create a map to store each object by its id for quick lookup
            const idMap = {};
            data.forEach(obj => {
                idMap[obj.id] = obj;
                obj.children = []; // Initialize children array for each object
            });

            // Function to find an item by its id
            function findItemById(targetId) {
                return idMap[targetId];
            }

            // Helper function to find all parents recursively
            function findParents(item, parents = []) {
                if (!item) {
                    return parents;
                }

                parents.unshift(item); // Add current item to the beginning of parents array

                // Recursively find parent until parentId is null (top level)
                if (item.parentId !== null) {
                    let parent = findItemById(item.parentId);
                    return findParents(parent, parents);
                } else {
                    return parents; // Reached top level (parentId === null)
                }
            }

            // Find the item by its id
            const foundItem = findItemById(id);

            if (foundItem) {
                // Find all parents of the found item
                const parents = findParents(foundItem);
                return parents;
            } else {
                return []; // Return empty array if item with id not found
            }
        }
        setFolderTree(findItemAndParentsUnsorted(listedPageItems, currentPage))
    }, [currentPage, listedPageItems])
    return (
        <>
            {!isMobile ? (
                <div className="flex items-center text-zinc-800 w-full overflow-x-auto h-full py-2">
                    {folderTree.length >= 1 && folderTree[0]?.id ? folderTree.map((page, index) => (
                        <>
                            <MenuBarButton type="button" onClick={() => {
                                const params = new URLSearchParams(window.location.search)
                                params.set("edit", page.id)
                                Router.push(`/page?${params.toString()}`);
                            }}>
                                {page?.icon && page?.icon.includes('.png') ? (
                                    <div aria-label='page icon' className="w-4 h-4 mr-2 flex items-center justify-center">
                                        <img src={`/emoji/twitter/64/${page.icon}`} />
                                    </div>
                                ) : null}
                                <span aria-label='Page title' className='text-ellipsis text-nowrap overflow-hidden max-w-[200px]'>{page?.title || page.id}</span>
                            </MenuBarButton>
                            {index < folderTree.length - 1 && (<div className='text-zinc-300 flex items-center justify-center mx-1'>/</div>)}
                        </>
                    )) : null}

                </div>
            ) : (
                <div className="flex items-center text-zinc-800 w-full">
                    <div className="flex items-center justify-center relative cursor-pointer">
                        <div className="flex gap-1 items-center text-[14px] font-[600] text-zinc-600 rounded p-[0.5em] hover:bg-zinc-200">
                            <div className="w-4 h-4 flex items-center justify-center">
                                {Object.keys(currentPageData) && currentPageData.icon && currentPageData.icon.includes('.png') ? (<img src={`/emoji/twitter/64/${currentPageData.icon}`} />) : null}
                            </div>
                            {Object.keys(currentPageData) && currentPageData.title || currentPageData.id}
                        </div>
                    </div>
                </div>
            )}

        </>
    )
    //TODO: Make above menubarbutton too for mobile
}

function WordCountDisplay({ currentPageData, defaultVisible }) {
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
    }, [currentPageData])

    if (query?.wordcount === "true" || defaultVisible) {
        return (
            <DropDownContainer>
                <DropDownTrigger>
                    <button className="text-zinc-600 text-xs font-medium text-nowrap h-[30px] flex items-center justify-center bg-none border-none cursor-pointer p-1 rounded relative w-fit hover:bg-zinc-200">
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

function DropDownMenu({ currentPageData, listedPageItems, currentPage }) {
    const [pageInfo, setPageInfo] = useState({})

    async function handleSharePage() {
        const data = {
            shared: !findPageListPage(currentPage, listedPageItems).shared,
        };

        SendPageChanges(currentPage, { shared: data.shared })
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
            SendPageChanges(currentPage, null, true)
            window.location.replace(`/page`)
        } catch (err) {
            console.log(err)
            toaster.error('An error occured while trying to delete the page')
        }
    }

    async function handleArchivePageToggle() {
        const newState = !findPageListPage(currentPage, listedPageItems).archived
        SendPageChanges(currentPage, { archived: newState })
        toaster.success(`Page ${newState ? 'archived' : 'restored'} successfully`)
    }

    async function handleReadOnlyPageToggle() {
        const newState = !findPageListPage(currentPage, listedPageItems).read_only
        SendPageChanges(currentPage, { read_only: newState })
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
                            <MenuBarButton>
                                <Settings2 className='text-zinc-600' />
                            </MenuBarButton>
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
                                        {findPageListPage(currentPage, listedPageItems)?.shared ? (
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
                            <DropDownExtensionContainer>
                                <DropDownExtensionTrigger>
                                    <DropDownItem>
                                        <Settings />
                                        Manage page
                                    </DropDownItem>
                                </DropDownExtensionTrigger>
                                <DropDownExtension>
                                    <DropDownSectionTitle>
                                        Page settings
                                    </DropDownSectionTitle>
                                    <DropDownSection>
                                        <DropDownItem onClick={() => handleReadOnlyPageToggle()}>
                                            {findPageListPage(currentPage, listedPageItems).read_only ? (
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
                                        <DropDownItem onClick={() => handleArchivePageToggle()}>
                                            {findPageListPage(currentPage, listedPageItems).archived ? (
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
                                </DropDownExtension>
                            </DropDownExtensionContainer>

                            <DropDownItem onClick={handleToggleShowWordCounter}>
                                <TextSelect />
                                Toggle Word Count
                            </DropDownItem>

                        </DropDownSection>
                    </DropDown >
                </DropDownContainer>
            </ToolTipCon >
        </>
    )
}

