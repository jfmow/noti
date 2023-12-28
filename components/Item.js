import styles from '@/styles/ItemList.module.css'
import Router, { useRouter } from 'next/router';
import PocketBase from 'pocketbase'
import { useEffect, useRef, useState } from 'react';
import UserOptions from './UserInfo';
import { useEditorContext } from '@/pages/page/[...id]';
import { toaster } from './toast';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

export default function PageList() {
  const { currentPage, visible, setVisible, listedPageItems, setListedPageItems } = useEditorContext()
  const router = useRouter()
  const shrinkcontainerRef = useRef(null)

  async function getUserPages() {
    try {
      const records = await pb.collection('pages_Bare').getFullList({
        sort: '-created', skipTotal: true,
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
  }, [])

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
    router.push(`/page/${record.id}`)
    setListedPageItems(updateListedPages('', record, listedPageItems))
  }

  //Render items
  function renderTree(items, parentId = "") {
    const filteredItems = items.filter(item => item.parentId === parentId);
    if (filteredItems.length === 0) {
      return null;
    }

    return (
      <ul style={parentId === "" ? { marginLeft: '0px' } : {}} className={styles.itemlist__ROOT}>
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
          style={{ background: currentPage.includes(item.id) ? `var(--page_list_item_active)` : hoveredItemId === item.id ? 'rgba(99, 223, 225, 0.638)' : item.color }}
          className={`${styles.item}`}
          key={item.id}
          onClick={(e) => openPage(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDragEnd(e, item.id, item.parentId)}
          onDragStart={(e) => handleDragStart(e, item.id)}
          draggable
          onContextMenu={(e) => handleRightClick(e, item.id)}
        >
          <button aria-label='Expand sub pages' type='button' onClick={(e) => handleSetExpand(e, item.id)} className={styles.item_expand}>
            {expand ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
            )}
          </button>
          <div aria-label='Page icon' style={{ display: 'flex' }}>
            {item.icon && item.icon.includes('.png') ? (<img className={styles.item_icon} src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}
          </div>

          <span className={`${expand ? styles.item_title_expanded : styles.item_title}`}>{item.title.trim() || 'Untitled page ' + item.id}</span>
          {expand && (
            <button aria-label='Create new subpage' type='button' onClick={(e) => createNewPage(item.id)} className={styles.item_expand}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </button>
          )}
        </li>
        {expand && (
          <>
            {children ? (
              children
            ) : (
              <span className={styles.create_new_page_btn_text}>
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
      <div ref={shrinkcontainerRef} className={styles.shrinkcontainer}>
        <div className={styles.container}>
          {renderTree(listedPageItems.filter((Apage) => !Apage?.archived && !Apage?.deleted))}
          <li data-track-event='Create new page btn' type='button' className={`${styles.item} ${styles.createnewpage_btn}`} onClick={() => createNewPage('')}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Create a new page</li>
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


