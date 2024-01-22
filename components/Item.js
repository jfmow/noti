import Router, { useRouter } from 'next/router';
import PocketBase from 'pocketbase'
import { useEffect, useRef, useState } from 'react';
import UserOptions from './UserInfo';
import { useEditorContext } from '@/pages/page/[...id]';
import { toaster } from './toast';
import { Loader2, Plus } from 'lucide-react';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

export default function PageList() {
  const { currentPage, visible, setVisible, listedPageItems, setListedPageItems, showArchivedPages } = useEditorContext()
  const router = useRouter()
  const shrinkcontainerRef = useRef(null)

  async function getUserPages() {
    try {
      const records = await pb.collection('pages_Bare').getFullList({
        sort: '-created', skipTotal: true, filter: showArchivedPages ? `` : `archived = false`
      });
      //console.log(records)
      setListedPageItems(records)
      if (!currentPage || (currentPage === 'firstopen' && records.length >= 1)) {
        Router.push(`/page/${records.filter(record => record.updated && !record.archived && !record.deleted)[0].id}`)
      }
    } catch {
      toaster.error('Error fetching data')
    }
  }

  useEffect(() => {
    if (!currentPage || (currentPage === 'firstopen' && listedPageItems.length >= 1)) {
      Router.push(`/page/${listedPageItems.filter(record => record.updated)[0].id}`)
    }
  }, [currentPage])

  useEffect(() => {
    getUserPages()
  }, [showArchivedPages])

  useEffect(() => {
    const containerWidthMax = window.innerWidth <= 600 ? '100%' : '300px'
    if (!visible) {
      shrinkcontainerRef.current.style.width = 0
      shrinkcontainerRef.current.animate(
        [
          // keyframes
          { width: containerWidthMax, overflow: 'hidden' },
          { width: "0px", overflow: 'hidden' },
        ],
        {
          // timing options
          duration: 500,
          iterations: 1,
          easing: "ease-in-out",
          fill: "both"
        },
      );
    } else if (visible) {
      shrinkcontainerRef.current.style.width = containerWidthMax
      shrinkcontainerRef.current.animate(
        [
          // keyframes
          { width: "0px" },
          { width: containerWidthMax },
        ],
        {
          // timing options
          duration: 500,
          iterations: 1,
          easing: "ease-in-out",
          fill: "both"
        },
      );
    }
  }, [visible])

  function setVisibleState() {
    setVisible(!visible)
  }

  //Helper func
  async function createNewPage(parent) {
    const data = {
      parentId: parent,
      owner: pb.authStore.model.id,
      content: {
        "time": Date.now(),
        "blocks": []
      }
    };
    const record = await pb.collection('pages').create(data);
    if (window.innerWidth < 640) {
      router.push(`/page/${record.id}`)
    } else {
      router.push(`${window.location.pathname}?p=${record.id}&pm=l`)
    }
    setListedPageItems(updateListedPages('', record, listedPageItems))
  }

  //Render items
  function renderTree(items, parentId = "") {
    const filteredItems = items.filter(item => item.parentId === parentId);
    if (filteredItems.length === 0) {
      return null;
    }

    return (
      <ul style={parentId === "" ? { marginLeft: '0px' } : {}} className="flex flex-col ml-1">
        {filteredItems.map(item => (
          <>
            <Item item={item} items={items} currentPage={currentPage}>
              {renderTree(items, item.id)}
            </Item>
          </>
        ))}
      </ul>
    );
  }

  //Item
  function Item({ item, items, currentPage, children }) {
    const [expand, setExpand] = useState(item.expanded);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [newPageLoading, setNewPageLoading] = useState(false)

    const router = useRouter()
    function openPage(e, item) {
      e.preventDefault();
      if (window.innerWidth < 800) {
        setVisibleState(false)
      }
      router.push(`/page/${item}`);
    }

    async function handleSetExpand(e, item) {
      e.stopPropagation();
      e.preventDefault()
      const data = {
        "expanded": !expand
      };
      setListedPageItems(updateListedPages(item, { expanded: !expand }, listedPageItems))
      setExpand(!expand);

      await pb.collection('pages').update(item, data);
    }

    function handleDragStart(event, itemId) {
      event.dataTransfer.setData("text/plain", itemId);
      //console.log("Started dragging item with ID:", itemId);
    }

    async function handleDragEnd(event, itemId, itemParent) {
      event.persist();
      const draggedItemId = event.dataTransfer.getData("text/plain");
      //console.log("Dragged item ID:", draggedItemId);
      //console.log("Dropped item ID:", itemId);
      setHoveredItemId(null);
      //console.log(itemParent)
      //if its on it self or its child
      if (draggedItemId === itemId || itemParent === draggedItemId) {
        return
      }
      try {
        const record1 = await pb.collection('pages_Bare').getFirstListItem(`parentId="${draggedItemId}"`);
        if (record1) {
          let itemCHeckId = record1.id
          while (true) {
            try {
              const record2 = await pb.collection('pages_Bare').getFirstListItem(`parentId="${itemCHeckId}"`);
              if (record2.id === itemId) {
                return
              } else if (record2.id === itemCHeckId) {
                break
              } else {
                itemCHeckId = record2.id
                continue
              }
            } catch (err) {
              break
            }
          }
        }
      } catch (err) {
        //console.log('Should be fineeeee')
      }

      setListedPageItems(updateListedPages(draggedItemId, { parentId: itemId }, listedPageItems))


      const data = {
        "parentId": itemId,
      };

      await pb.collection('pages').update(draggedItemId, data);
    }

    function handleDragOver(event, itemId) {
      event.preventDefault();
      setHoveredItemId(itemId);
    }

    function handleDragLeave() {
      setHoveredItemId(null);
    }

    function handleRightClick(event, item) {
      //console.log(event, item)
      event.preventDefault();
    }

    return (
      <>


        <li
          style={{ background: currentPage.includes(item.id) ? `var(--pageListItemOpen)` : hoveredItemId === item.id ? 'rgba(99, 223, 225, 0.638)' : item.color }}
          className={`flex items-center p-[6px] cursor-pointer list-none gap-1 rounded-lg text-[var(--pageListItemTextIcon)] text-[16px] mx-[1px] my-[3px] min-h[36px] overflow-hidden text-ellipsis text-wrap hover:bg-[var(--pageListItemHover)] ${item.archived && "border border-red-600"}`}
          key={item.id}
          onClick={(e) => openPage(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDragEnd(e, item.id, item.parentId)}
          onDragStart={(e) => handleDragStart(e, item.id)}
          draggable
          onContextMenu={(e) => handleRightClick(e, item.id)}
        >
          <button aria-label='Expand sub pages' type='button' onClick={(e) => handleSetExpand(e, item.id)} className="flex items-center justify-center bg-none border-none rounded cursor-pointer p-1 [&>svg]:w-4 [&>svg]:h-4 aspect-[1/1] object-contain overflow-hidden text-[var(--pageListItemTextIcon)] hover:bg-[var(--pageListItemTextIconBackgroundHover)]">
            {expand ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
            )}
          </button>
          <div aria-label='Page icon' style={{ display: 'flex' }}>
            {item.icon && item.icon.includes('.png') ? (<img className="w-4 h-4 object-contain" src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}
          </div>

          <span className={`${expand ? "w-full overflow-hidden text-wrap pl-[3px] pr-[5px]" : "w-full overflow-hidden text-ellipsis text-nowrap pl-[3px] pr-[5px]"}`}>{item.title.trim() || 'Untitled page ' + item.id}</span>
          {expand && (
            <button aria-label='Create new subpage' type='button' onClick={async (e) => {
              setNewPageLoading(true)
              await createNewPage(item.id)
              setNewPageLoading(false)
            }} className="flex items-center justify-center bg-none border-none rounded cursor-pointer p-1 [&>svg]:w-4 [&>svg]:h-4 aspect-[1/1] object-contain overflow-hidden text-[var(--pageListItemTextIcon)] hover:bg-[var(--pageListItemTextIconBackgroundHover)]">
              {newPageLoading ? (<Loader2 className="h-4 w-4 animate-spin" />) : (<Plus className='w-4 h-4' />)}
            </button>
          )}
        </li>
        {expand && (
          <>
            {children ? (
              children
            ) : (
              <span className="text-[12px] text-[var(--createNewPageBtnText)] ml-2">
                No sub pages
              </span>
            )}
          </>
        )}
      </>
    )
  }

  return (

    <>
      <div ref={shrinkcontainerRef} className=" sm:w-[300px] w-full sm:z-[1] z-[8] fixed top-0 left-0 right-0 bottom-0 overflow-hidden sm:overflow-auto sm:relative h-screen">
        <div className="w-full sm:w-[300px] relative h-[calc(100dvh_-_70px)] overflow-y-scroll overflow-x-hidden p-2 bg-[var(--background)] flex flex-col">
          {renderTree(listedPageItems.filter((Apage) => !Apage?.deleted))}
          <li data-track-event='Create new page btn' type='button' className="flex items-center p-[6px] cursor-pointer list-none gap-1 rounded-lg text-[var(--pageListItemTextIcon)] text-[12px] mx-[1px] my-[3px] min-h[36px] overflow-hidden text-ellipsis text-wrap hover:bg-[var(--pageListItemHover)] [&>svg]:w-4 [&>svg]:h-4 min-h-[32px]" onClick={() => createNewPage('')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Create a new page</li>
        </div >
        <UserOptions />
      </div>

    </>
  )
}


export function updateListedPages(itemToUpdate, data, prevItems) {
  try {
    // Find the previous item with the same ID
    const oldItem = prevItems.find(item => item.id === itemToUpdate);

    if (!oldItem) {

      // Insert the new record with the 'deleted' flag set to true
      return [
        data,
        ...prevItems
      ];
    }



    // Filter out the previous item from the list
    const filteredItems = prevItems.filter(item => item.id !== oldItem.id);

    if (!data) {
      return filteredItems
    }

    // Find the index to insert the new record based on its created date
    let insertIndex = filteredItems.findIndex(item => item.created < oldItem.created);
    if (insertIndex === -1) {
      insertIndex = filteredItems.length;
    }

    // Insert the new record with the 'deleted' flag set to true
    return [
      ...filteredItems.slice(0, insertIndex),
      oldItem ? { ...oldItem, ...data } : data,
      ...filteredItems.slice(insertIndex)
    ];

  } catch (err) {
    throw err
  }
}


