import PocketBase from 'pocketbase'
import { toaster } from '@/components/toast';
import { useEditorContext } from '@/pages/page';
import { useEffect, useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import Router from 'next/router';
import UserOptions from '@/components/user-info';
import Loader from '@/components/Loader';
import { handleFindRecordAndAncestors, handleInsertRecord, handleRemoveRecord } from './helpers';
import { ListenForAllPageChanges, SendPageChanges } from '@/lib/Page state manager';
import { sortAndNestObjects } from './list-functions';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)

export default function UsersPages() {
    const [defaultWidth, setDefaultWidth] = useState(260)
    const [loading, setLoading] = useState(true)
    const { showArchivedPages, listedPageItems, setListedPageItems, visible, pageId } = useEditorContext()

    useEffect(() => {
        async function run() {
            setLoading(true)
            if (window.innerWidth < 640) {
                setDefaultWidth("full")
            }
            const pages = await getPages(showArchivedPages)
            setListedPageItems(pages)
            setLoading(false)
            ListenForAllPageChanges((data) => {
                if (Object.keys(data).length === 1) {
                    //The object was removed.
                    setListedPageItems(prevItems => prevItems.filter((item) => item.id !== data.id))
                } else {
                    //The object was updated or created
                    setListedPageItems(prevItems => {
                        if (prevItems.find((item) => item.id === data.id)) {
                            //The item exists
                            return prevItems.map((item) => {
                                if (item.id === data.id) {
                                    return { ...item, ...data }
                                } else {
                                    return item
                                }
                            })
                        } else {
                            //The item doesn't exist
                            return [...prevItems, data]
                        }
                    })
                }
            })
        }
        run()
    }, [showArchivedPages])

    return (
        <>
            <div id="hidemewhenprinting" style={defaultWidth === "full" ? { width: "100vw", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, height: "100svh", display: visible ? "flex" : "none" } : { width: defaultWidth + "px", height: "100dvh" }} className={`bg-[var(--background)] relative flex-col overflow-hidden ${defaultWidth === "full" ? "" : (visible ? "animate-slideout" : "animate-slidein")}`}>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <ul className='h-full w-full p-2 overflow-y-scroll'>
                            {listedPageItems.length >= 1 && sortAndNestObjects(listedPageItems).map((item) => (
                                <PageListItem data={item} />
                            ))}
                            <CreateNewPageButton setListedPageItems={setListedPageItems} />
                        </ul>

                        <UserOptions />
                    </>
                )}
            </div>
        </>
    )
}



function PageListItem({ data }) {
    const { showArchivedPages } = useEditorContext()
    if (data?.archived && !showArchivedPages) {
        return <></>
    }

    const isDragingOver = false

    function openPage() {
        const urlParams = new URLSearchParams(window.location.search)
        if (window.innerWidth < 640) {
            urlParams.set("side", false)
        }
        urlParams.set("edit", data.id)
        Router.push(`/page?${urlParams.toString()}`);
    }

    function togglePagesChildren(e) {
        //Prevent the open page event
        e.stopPropagation()
        pb.collection("pages").update(data.id, { expanded: !data.expanded });
        SendPageChanges(data.id, { "expanded": !data.expanded })
    }

    function createANewChildPage(e) {
        e.preventDefault()
        //TODO: change the create function
        createNewItem(data.id, null)
    }

    return (
        <>
            <li aria-label='Page item' key={data.id} onClick={openPage} style={{ background: data.color }} className={`flex items-center justify-between gap-1 cursor-pointer p-2 mb-2 text-[var(--pageListItemTextIcon)] hover:bg-[var(--pageListItemHover)] hover:border-zinc-200 border border-[transparent] rounded-md ${isDragingOver ? "!bg-red-300" : ""}`}>

                {data.icon != "" ? (
                    <div className='w-6 h-6'>
                        <img src={`/emoji/twitter/64/${data.icon}`} className='object-contain h-full w-full' loading='lazy' />
                    </div>
                ) : (
                    <></>
                )}
                <div className='text-left w-full font-medium text-sm'>
                    {data.title || data.id}
                </div>
                <div className='flex items-center'>
                    <button disabled={!data.expanded} aria-label='Create a new sub page' onClick={createANewChildPage} type='button' style={{ opacity: data.expanded ? 100 : 0 }} className='flex items-center justify-center p-1 rounded bg-none border-none hover:bg-[var(--pageListItemTextIconBackgroundHover)]'>
                        <Plus className='w-4 h-4' />
                    </button>

                    <button aria-label='Expand children' onClick={togglePagesChildren} type='button' className='flex items-center justify-center p-1 rounded bg-none border-none hover:bg-[var(--pageListItemTextIconBackgroundHover)]'>
                        {data.expanded ? (
                            <ChevronDown className='w-4 h-4' />
                        ) : (
                            <ChevronRight className='w-4 h-4' />
                        )}
                    </button>
                </div>
            </li >
            {
                data.expanded && data.children ? (
                    <ul className="flex flex-col ml-2">
                        {data.children.map((childItemData) => (
                            <PageListItem data={childItemData} />
                        ))}
                    </ul>
                ) : null
            }
        </>
    )
}

function CreateNewPageButton({ parentId = "" }) {
    return (
        <button aria-label='Create new page without parent' onClick={() => createNewItem(parentId)} className='w-full text-[var(--pageListItemTextIcon)] text-sm opacity-50 hover:opacity-60 flex items-center justify-center bg-[var(--pageListItemHover)] gap-1 cursor-pointer p-2 mb-2 hover:bg-[var(--pageListItemHover)] hover:shadow-sm rounded-lg'>
            <Plus className='w-4 h-4' />
            New page
        </button>
    )
}

/**
 * @returns Component
 */
function ListItem({ item, pageId, listedPageItems, setListedPageItems, children }) {

    const [isDragingOver, setIsDragingOver] = useState(false)

    function isChildOf(tomove, moveto) {
        // Find the parent item in the unsorted array
        const parentheirachy = handleFindRecordAndAncestors(moveto, listedPageItems)
        if (parentheirachy.find((item) => item.id === tomove)) {
            return true
        } else {
            return false
        }
    }

    function handleDrop(event, item) {
        setIsDragingOver(false)
        const itemToMove = event.dataTransfer.getData("text/plain");
        const itemToMoveINTO = item;

        if (itemToMove === itemToMoveINTO) return;


        // Check if the item being moved is not a child of the item it's being moved into or any of its children
        if (isChildOf(itemToMove, itemToMoveINTO.id)) {
            toaster.info("Cannot move item: It is a child of the target item or one of its descendants, or it's being moved into its own children.");
            return;
        }

        // If the item can be moved, perform the move operation
        // Your move logic here


        pb.collection("pages").update(itemToMove, { parentId: itemToMoveINTO.id }).then((res) => {
            handleRemoveRecord(res.id, setListedPageItems)
            handleInsertRecord(res, setListedPageItems)
        })

    }

    return (
        <>
            <li draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)} onDragOver={(e) => {
                e.preventDefault()
                setIsDragingOver(true)
            }}
                onDragLeave={() => setIsDragingOver(false)} onDrop={(e) => handleDrop(e, item)} aria-label='Page item' key={item.id} onClick={() => {
                    const urlParams = new URLSearchParams(window.location.search)
                    if (window.innerWidth < 800) {
                        urlParams.set("side", false)
                    }
                    urlParams.set("edit", item.id)
                    Router.push(`/page?${urlParams.toString()}`);
                }} style={{ background: item.color }}
                className={`flex items-center justify-between gap-1 cursor-pointer p-2 mb-2 text-[var(--pageListItemTextIcon)] hover:bg-[var(--pageListItemHover)] hover:border-zinc-200 border border-[transparent] rounded-md ${isDragingOver ? "!bg-red-300" : ""} ${pageId === item.id ? "bg-[var(--pageListItemOpen)]" : ""}`}>

                {item.icon != "" ? (
                    <div className='w-6 h-6'>
                        <img src={`/emoji/twitter/64/${item.icon}`} className='object-contain h-full w-full' loading='lazy' />
                    </div>
                ) : (
                    <></>
                )}
                <div className='text-left w-full font-medium text-sm'>
                    {item.title || item.id}
                </div>
                <div className='flex items-center'>
                    <button disabled={!item.expanded} aria-label='Create a new sub page' onClick={(e) => {
                        if (!item.expanded) return
                        e.stopPropagation();
                        createNewItem(item.id, setListedPageItems)
                    }} type='button' style={{ opacity: item.expanded ? 100 : 0 }} className='flex items-center justify-center p-1 rounded bg-none border-none hover:bg-[var(--pageListItemTextIconBackgroundHover)]'>
                        <Plus className='w-4 h-4' />
                    </button>
                    <button aria-label='Expand children' onClick={(e) => { e.stopPropagation(); pb.collection("pages").update(item.id, { expanded: !item.expanded }); SendPageChanges(item.id, { "expanded": !item.expanded }) }} type='button' className='flex items-center justify-center p-1 rounded bg-none border-none hover:bg-[var(--pageListItemTextIconBackgroundHover)]'>
                        {item.expanded ? (
                            <ChevronDown className='w-4 h-4' />
                        ) : (
                            <ChevronRight className='w-4 h-4' />
                        )}
                    </button>
                </div>
            </li >
            {
                item.expanded && item.children ? (
                    <ul className="flex flex-col ml-2">
                        {item.children.map((item2) => (
                            <ListItem pageId={pageId} item={item2} listedPageItems={listedPageItems} setListedPageItems={setListedPageItems} />
                        ))}
                    </ul>
                ) : null
            }
        </>
    )
}




export async function createNewItem(parentId = "") {
    const searchParams = new URLSearchParams(window.location.search);

    const newRecord = await pb.collection("pages").create({
        parentId: parentId, owner: pb.authStore.model.id, content: {
            "time": Date.now(),
            "blocks": []
        }
    });

    SendPageChanges(newRecord.id, newRecord)

    if (window.innerWidth > 640) {
        //Is not a phone
        searchParams.set("pm", "l");
        searchParams.set("p", newRecord.id);
    }

    Router.push(`/page?${searchParams.toString()}`);
}

async function getPages(showArchivedPages = false) {
    try {
        const records = await pb.collection("pages").getFullList({
            sort: '-created', skipTotal: true, filter: `owner = '${pb.authStore.model.id}' ${showArchivedPages ? "" : "&& archived = false"}`, fields: "id, owner, title, expanded, parentId, icon, color, read_only, archived, shared"
        });

        return records
    } catch {
        toaster.error("An error occured while fetching pages.")
        return []
    }
}