import styles from '@/styles/ItemList.module.css'
import Router, { useRouter } from 'next/router';
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ContextMenuDropMenu, ContextMenuDropMenuSection, ContextMenuDropMenuSectionItem } from '@/lib/ContextMenu';
import UserOptions from './UserInfo';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

export default function PageList({ currentPage, visible, setVisible }) {
  const [treeData, setTreeData] = useState([])
  const [contextMenuEvent, setContextMenuEvent] = useState(null)
  const [SearchActive, setSearchActive] = useState(false)
  const router = useRouter()
  const { query } = router;

  async function getUserPages() {
    try {
      const records = await pb.collection('pages_Bare').getFullList({
        sort: '-created', skipTotal: true
      });
      //console.log(records)
      setTreeData(records)
      if (!currentPage || (currentPage[0] === 'firstopen' && records.length >= 1)) {
        Router.push(`/page/${records.filter(record => record.updated)[0].id}`)
      }
    } catch {
      toast.error('Error fetching data')
    }
  }

  useEffect(() => {
    if (window.localStorage.getItem('menu') === 'false') {
      setVisibleState(false)
    }
    getUserPages()
    pb.collection('pages').subscribe('*', function (e) {
      const updatedRecord = e.record;
      if (e.action === 'delete') {
        setTreeData(prevItems => {
          // Remove any previous item with the same ID
          const filteredItems = prevItems.filter(item => item.id !== updatedRecord.id);


          return [
            ...filteredItems
          ];
        })
      } else {
        setTreeData(prevItems => {
          // Remove any previous item with the same ID
          const filteredItems = prevItems.filter(item => item.id !== updatedRecord.id);

          // Add the new record at the appropriate position based on its created date
          let insertIndex = filteredItems.findIndex(item => item.created < updatedRecord.created);
          if (insertIndex === -1) {
            insertIndex = filteredItems.length;
          }

          return [
            ...filteredItems.slice(0, insertIndex),
            updatedRecord,
            ...filteredItems.slice(insertIndex)
          ];
        });
      }

    });
  }, [])

  function setVisibleState() {
    window.localStorage.setItem('menu', visible ? 'false' : 'true')
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
    ////console.log(record.id);

    // Update the items state by adding the new record
    //setItems((prevItems) => [...prevItems, record]);
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

  //Context menu
  function setContextMenu(e, page) {
    setContextMenuEvent({ eventData: e, data: [{ key: 'pageid', value: page }] })
  }
  async function contextMenuDeletePage(page) {
    await pb.collection('pages').delete(page)
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
      setContextMenu(event, item)
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

          <span className={`${expand ? styles.item_title_expanded : styles.item_title}`}>{item.title || 'Untitled page ' + item.id}</span>
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
      <ContextMenuDropMenu event={contextMenuEvent}>
        <ContextMenuDropMenuSection>
          {/*<ContextMenuDropMenuSectionItem onClick={() => {
            setShowMultiEditorSelector(true)
            setContextMenuEvent(null)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-columns"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="12" x2="12" y1="3" y2="21" /></svg>
            <p>Multieditor</p>
        </ContextMenuDropMenuSectionItem>*/}
          <ContextMenuDropMenuSectionItem onClick={() => {
            contextMenuDeletePage(contextMenuEvent.data.filter(item => item.key === 'pageid')[0].value)
            setContextMenuEvent(null)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
            <p>Delete page</p>
          </ContextMenuDropMenuSectionItem>
        </ContextMenuDropMenuSection>
      </ContextMenuDropMenu>
      <div className={`${!visible && styles.hidden} ${styles.container}`}>
        <SearchBar setVisibleState={setVisibleState} items={treeData} setSearchActive={setSearchActive} SearchActive={SearchActive} />
        {!SearchActive && (
          <>
            {renderTree(treeData)}
            < li type='button' className={`${styles.item} ${styles.createnewpage_btn}`} onClick={() => createNewPage('')}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Create a new page</li>
          </>
        )}
        <UserOptions user={pb.authStore.model} usageOpenDefault={query.usage} />
      </div >
    </>
  )

  //Helper search bar func
  function SearchBar({ setItems, items, setSearchActive, SearchActive, setVisibleState }) {

    const [filteredItems, setFilteredItems] = useState([])
    const [advancedMenu, setAdvancedMenu] = useState(false)
    const [contentSearch, setContentSearch] = useState(false)
    const [word, setWord] = useState('')

    const Router = useRouter()

    async function GetContentSearch(text) {
      const records = await pb.collection('pages').getFullList({
        sort: '-created', filter: `content ~ '${text.trim()}'`
      });
      setFilteredItems(records)
    }

    function FIlter(text) {
      if (!text || text.length <= 0) {
        setSearchActive(false)
        setFilteredItems([])
        setContentSearch(false)
        return
      }
      setWord(text)
      if (contentSearch) {
        GetContentSearch(text)
      }
      setSearchActive(true)
      setFilteredItems(items.filter((item) => item.title.trim().toUpperCase().includes(text.trim().toUpperCase())))
    }

    useEffect(() => {
      function highlightWord() {
        // Get the user input
        if (word.length <= 0) return;
        var textToHighlight = word.toLowerCase().trim(); // Convert the input to lowercase

        // Get all elements with contenteditable="true"
        var editableElements = document.querySelectorAll('[contenteditable="true"]');

        // Loop through editable elements
        editableElements.forEach(function (element) {
          // Remove all existing <span> elements with the "highlighted" class
          var highlightedElements = element.querySelectorAll('span.highlighted');
          highlightedElements.forEach(function (highlightedElement) {
            var text = highlightedElement.textContent;
            var parent = highlightedElement.parentNode;
            parent.replaceChild(document.createTextNode(text), highlightedElement);
          });

          var html = element.innerHTML;
          var newText = html.toLowerCase(); // Convert the element's HTML to lowercase

          // Use a regular expression to find all occurrences of the text
          var regex = new RegExp(textToHighlight, 'g');
          newText = newText.replace(regex, '<span class="highlighted">$&</span>');

          // Set the element's HTML with the highlighted text
          element.innerHTML = newText;
        });
      }
      if (contentSearch) {
        highlightWord();
      }
    }, [word, Router.pathname]);







    return (
      <>
        <div className={styles.searchandhide}>
          <div className={styles.search}>
            <div className={styles.searchgroup}>
              <svg className={styles.searchicon} aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
              <input placeholder="Search" onChange={(e) => FIlter(e.target.value)} type="text" className={styles.searchinput} />
              {/*<svg onClick={() => setAdvancedMenu(!advancedMenu)} className={styles.searchFiltersIcon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M3 18c0 .55.45 1 1 1h5v-2H4c-.55 0-1 .45-1 1zM3 6c0 .55.45 1 1 1h9V5H4c-.55 0-1 .45-1 1zm10 14v-1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7v-1c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zM7 10v1H4c-.55 0-1 .45-1 1s.45 1 1 1h3v1c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1zm14 2c0-.55-.45-1-1-1h-9v2h9c.55 0 1-.45 1-1zm-5-3c.55 0 1-.45 1-1V7h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z" /></svg>
            */}</div>
            {/*{advancedMenu && (
              <div className={styles.searchAdvancedMenu}>
                <span className={`${styles.searchAdvancedMenuItem} ${contentSearch && styles.searchAdvancedMenuItemActive}`} onClick={() => setContentSearch(!contentSearch)}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z" /></svg> Content search</span>
              </div>
            )}*/}
          </div>
          <button aria-label='Toggle page menu' onClick={setVisibleState} className={styles.hide_items}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-close"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M9 3v18" /><path d="m16 15-3-3 3-3" /></svg></button>
        </div>
        {SearchActive && (
          <div>
            <ol className={styles.items}>
              {filteredItems.length <= 0 ? (
                <>
                  <div className={styles.searchLoaderCon}>
                    <div className={styles.searchloader}></div>
                  </div>
                </>
              ) : (
                <>
                  {renderTree(filteredItems)}
                </>
              )}
            </ol>
          </div>
        )}

      </>
    )
  }
}



