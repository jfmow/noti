import { toaster } from '@/components/toast';
import { useEditorContext } from '@/pages/page';
import { useEffect, useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import Router from 'next/router';
import Loader from '@/components/Loader';
import { ListenForAllPageChanges, SendPageChanges } from '@/lib/Page state manager';
import { sortAndNestObjects } from './list-functions';
import pb from "@/lib/pocketbase"
import isMobileScreen from '@/lib/ismobile';

export default function UsersPages() {
    const [loading, setLoading] = useState(true)
    const { showArchivedPages, listedPageItems, setListedPageItems, visible } = useEditorContext()

    useEffect(() => {
        async function run() {
            setLoading(true)
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

    const defaultStyles = " print:hidden print:collapse bg-[var(--background)] pt-[40px] flex-col overflow-x-hidden overflow-y-scroll "
    const mobile = ` w-[100vw] h-[100svh] fixed top-0 left-0 right-0 bottom-0 z-[2] ${visible ? "flex" : "hidden"} `
    const desktopStyles = ` w-[260px] relative [h-100dvh] ${visible ? "animate-slideout" : "animate-slidein"} `

    return (
        <>
            <div

                className={defaultStyles + (isMobileScreen() ? mobile : desktopStyles)}>


                {loading ? (
                    <Loader />
                ) : (
                    <>

                        <ul className='h-full w-full px-5 py-2 '>
                            {listedPageItems.length >= 1 && sortAndNestObjects(listedPageItems).map((item) => (
                                <PageListItem data={item} />
                            ))}
                            <CreateNewPageButton setListedPageItems={setListedPageItems} />
                        </ul>

                    </>
                )}
            </div>
        </>
    )
}



function PageListItem({ data }) {
    const { showArchivedPages, listedPageItems } = useEditorContext()
    if (data?.archived && !showArchivedPages) {
        return <></>
    }

    const [isDragingOver, setIsDragingOver] = useState(false)

    function isChildOf(parentId, childId) {
        // Find the parent item in the unsorted array
        const parentItem = listedPageItems.find(item => item.id === parentId);

        // If parentItem is not found, return false
        if (!parentItem) {
            return false;
        }

        // Check if childId is a direct child of parentItem
        if (parentItem.id === childId) {
            return true;
        }

        // Find all items in the unsorted array that have parentId as their parent
        const children = listedPageItems.filter(item => item.parentId === parentId);

        // Check if childId is a direct child of parentItem
        if (children.some(item => item.id === childId)) {
            return true;
        }

        // Recursively check if childId is a descendant of any children of parentItem
        for (const child of children) {
            if (isChildOf(child.id, childId)) {
                return true;
            }
        }

        // If childId is not found among direct children or descendants, return false
        return false;
    }

    function handleDrop(event, item) {
        setIsDragingOver(false)
        const itemToMove = event.dataTransfer.getData("text/plain");
        const itemToMoveINTO = item;

        if (itemToMove === itemToMoveINTO) return;

        const parentId = itemToMoveINTO.id;

        // Check if the item being moved is not a child of the item it's being moved into or any of its children
        if (isChildOf(parentId, itemToMove) || isChildOf(itemToMove, parentId)) {
            toaster.info("Cannot move item: It is a child of the target item or one of its descendants, or it's being moved into its own children.");
            return;
        }
        SendPageChanges(itemToMove, { parentId: itemToMoveINTO.id })

    }

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
        SendPageChanges(data.id, { "expanded": !data.expanded })
    }

    function createANewChildPage(e) {
        e.preventDefault()
        //TODO: change the create function
        createNewItem(data.id, null)
    }

    return (
        <>
            <li
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", data.id)}
                onDrop={(e) => handleDrop(e, data)}
                onDragOver={(e) => { e.preventDefault() }}
                aria-label='Page item' key={data.id} onClick={openPage} style={{ background: data.color }} className={`shadow flex items-center justify-between gap-1 cursor-pointer p-1 mb-2 text-[var(--pageListItemTextIcon)] hover:bg-[var(--pageListItemHover)] rounded ${isDragingOver ? "!bg-red-300" : ""}`}
            >

                {data.icon != "" ? (
                    <div className='w-5 h-5'>
                        <img src={`/emoji/twitter/64/${data.icon}`} className='object-contain h-full w-full' loading='lazy' />
                    </div>
                ) : (
                    <></>
                )}
                <div className='text-left w-full font-medium text-xs'>
                    {data.title || data.id}
                </div>
                <div className='flex items-center'>
                    <button disabled={!data.expanded} aria-label='Create a new sub page' onClick={createANewChildPage} type='button' style={{ opacity: data.expanded ? 100 : 0 }} className='flex items-center justify-center p-1 rounded-md bg-none border-none hover:bg-[var(--pageListItemTextIconBackgroundHover)]'>
                        <Plus className='w-3 h-3' />
                    </button>

                    <button aria-label='Expand children' onClick={togglePagesChildren} type='button' className='flex items-center justify-center p-1 rounded-md bg-none border-none hover:bg-[var(--pageListItemTextIconBackgroundHover)]'>
                        {data.expanded ? (
                            <ChevronDown className='w-3 h-3' />
                        ) : (
                            <ChevronRight className='w-3 h-3' />
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




export async function createNewItem(parentId = "") {
    const searchParams = new URLSearchParams(window.location.search);

    const newRecord = await pb.collection("pages").create({
        parentId: parentId, owner: pb.authStore.model.id, content: {
            "time": Date.now(),
            "blocks": []
        }
    });

    SendPageChanges(newRecord.id, newRecord, true)

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
        toaster.error("An error occurred while fetching pages.")
        return []
    }
}