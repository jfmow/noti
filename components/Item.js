import React, { useEffect, useState, useRef } from 'react';
import styles from '@/styles/PageList.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
import Router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { AlternateButton, ModalContainer, ModalForm, ModalTitle } from '@/lib/Modal';
import UserOptions from './UserInfo';
import { ContextMenuDropMenu, ContextMenuDropMenuSection, ContextMenuDropMenuSectionItem } from '@/lib/ContextMenu';
const Icons = dynamic(() => import('./editor/Menu/Icons'));

const MyComponent = ({ currPage }) => {
  const [items, setItems] = useState([]);
  const [SearchActive, setSearchActive] = useState(false)
  const [loading, setIsLoading] = useState(true)
  const router = useRouter()
  const [showMultiEditorSelector, setShowMultiEditorSelector] = useState(false)
  const { query } = router;
  const [contextMenuEvent, setContextMenuEvent] = useState(null)
  useEffect(() => {
    async function getData() {
      try {
        const records = await pb.collection('pages_Bare').getFullList({
          sort: '-created', skipTotal: true
        });
        setItems(records);
        setIsLoading(false)
        if (!currPage || currPage[0] === "firstopen" && localStorage.getItem('Offlinetime') !== "true") {
          const latestRecord = records.filter(record => record.updated)[0];
          if (latestRecord) {
            router.push(`/page/${latestRecord.id}`)
          }
        }
      } catch (err) {
        console.error(err)
      }

    }
    getData();



    const unsubscribe = pb.collection('pages')
      .subscribe('*', function (e) {
        const updatedRecord = e.record;
        if (e.action === 'delete') {
          setItems(prevItems => {
            // Remove any previous item with the same ID
            const filteredItems = prevItems.filter(item => item.id !== updatedRecord.id);


            return [
              ...filteredItems
            ];
          })
        } else {
          setItems(prevItems => {
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

  }, []);

  useEffect(() => {
    if (window.localStorage.getItem('_menu') === 'closed') {
      try {
        document.getElementById('rootitems').classList.add(styles.dskhidden)
      } catch (err) {
        //console.log(err)
        return
      }
    } else if (window.localStorage.getItem('_menu') === "open") {
      try {
        document.getElementById('rootitems').classList.remove(styles.dskhidden)
      } catch (err) {
        return
      }
    }
  }, [document.getElementById('rootitems')])

  if (loading) {
    return (
      <div className={`${styles.itemroot}`} id='rootitems'>
        <div className={styles.load1con}>
          <svg className={styles.load1} viewBox="25 25 50 50">
            <circle className={styles.load2} r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
      </div>
    );
  }

  const renderChildComponents = (parentId, level) => {
    const children = items.filter((item) => item.parentId === parentId);

    return children.map((child) => {
      const isActive = currPage.includes(child.id);
      const hasActiveChild = renderChildComponents(child.id, level + 1).some(
        (c) => c.props.isActive
      );

      return (
        <ChildComponent
          key={child.id}
          item={child}
          level={level}
          currPage2={currPage}
          isActive={isActive || hasActiveChild}
          createNewPage={createNewPage}
          setVisibleState={setVisibleState}
          setContextMenu={setContextMenu}
        >
          {renderChildComponents(child.id, level + 1)}
        </ChildComponent>
      );
    });
  };

  const rootParents = items.filter((item) => item.parentId === '');

  async function createNewPage(e, parent) {
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

  //const [visible, setVisibleState] = useState(true);
  function setVisibleState() {
    document.getElementById('rootitems').classList.toggle(styles.dskhidden)
    window.localStorage.setItem('_menu', document.getElementById('rootitems').classList.contains(styles.dskhidden) ? ('closed') : ('open'))
  }

  function setContextMenu(e, page) {
    setContextMenuEvent({ eventData: e, data: [{ key: 'pageid', value: page }] })
  }

  async function contextMenuDeletePage(page) {
    await pb.collection('pages').delete(page)
  }



  return (
    <>
      <ContextMenuDropMenu event={contextMenuEvent}>
        <ContextMenuDropMenuSection>
          <ContextMenuDropMenuSectionItem onClick={() => {
            setShowMultiEditorSelector(true)
            setContextMenuEvent(null)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-columns"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="12" x2="12" y1="3" y2="21" /></svg>
            <p>Multieditor</p>
          </ContextMenuDropMenuSectionItem>
          <ContextMenuDropMenuSectionItem onClick={() => {
            contextMenuDeletePage(contextMenuEvent.data.filter(item => item.key === 'pageid')[0].value)
            setContextMenuEvent(null)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
            <p>Delete page</p>
          </ContextMenuDropMenuSectionItem>
        </ContextMenuDropMenuSection>
      </ContextMenuDropMenu>
      <div className={`${styles.itemroot}`} id='rootitems'>

        {showMultiEditorSelector && (<MultiEditor pagesList={items} Close={() => setShowMultiEditorSelector(false)} />)}

        <SearchBar setVisibleState={setVisibleState} setItems={setItems} items={items} setSearchActive={setSearchActive} SearchActive={SearchActive} />
        <ImportantNotes notes={items} setVisibleState={setVisibleState} />
        {!SearchActive && (
          <>

            {rootParents.map((rootParent) => (
              <div
                key={rootParent.id}
                className={styles.itemscon}
              >
                <RootParentComponent
                  item={rootParent}
                  currPage={currPage}
                  createNewPage={createNewPage}
                  setContextMenu={setContextMenu}
                  setVisibleState={setVisibleState}
                >
                  {renderChildComponents(rootParent.id, 0)}
                </RootParentComponent>
              </div>
            ))}
            <span
              title='New page'
              onClick={(e) => {
                e.stopPropagation();
                createNewPage(e, null);
              }}
              id="createnewpageid"
              className={`${styles.createrootpage}`}
            >
              <svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20'>
                <path d='M444-240v-204H240v-72h204v-204h72v204h204v72H516v204h-72Z' />
              </svg>
              Create page
            </span>
          </>
        )}

        <UserOptions usageOpenDefault={query.usage} clss={styles.test12} user={pb.authStore.model} />

      </div>

    </>
  );
};

const RootParentComponent = ({ item, currPage, createNewPage, setContextMenu, setVisibleState, children }) => {
  //const [expand, setExpand] = useState(false);

  return (
    <div>
      <ol className={styles.items}>
        <ChildComponent
          item={item}
          level={0}
          currPage2={currPage}
          isActive={currPage.includes(item.id)}
          createNewPage={createNewPage}
          setVisibleState={setVisibleState}
          setContextMenu={setContextMenu}
        >
          {children}
        </ChildComponent>
      </ol>
    </div>
  );
};

const ChildComponent = ({ item, level, children, currPage2, isActive, createNewPage, setVisibleState, setContextMenu }) => {
  const [expand, setExpand] = useState(item.expanded);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const [iconModalState, setIconModalState] = useState(false)

  const router = useRouter()
  function openPage(e, item) {
    e.preventDefault();
    if (window.innerWidth < 800) {
      setVisibleState(false)
    }
    router.push(`/page/${item}`);
  }

  async function handleSetExpand(e, item, state) {
    e.preventDefault()
    setExpand(state);
    const data = {
      "expanded": state
    };
    const record = await pb.collection('pages').update(item, data);
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

  async function changePageIcon(e) {
    const data = {
      icon: e.image,
    };
    //icon.codePointAt(0).toString(16)
    setIconModalState(false);
    await pb.collection("pages").update(item.id, data);
  }


  return (
    <>
      <li >
        <div
          className={` ${currPage2 === item.id || isActive ? styles.active : ''} ${hoveredItemId === item.id ? styles.hoveringover : ''
            } ${styles.page_list_item}`}
          id={currPage2 === item.id ? styles.active : 'fake'}
          onClick={(e) => openPage(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDragEnd(e, item.id, item.parentId)}
          onDragStart={(e) => handleDragStart(e, item.id)}
          draggable
          onContextMenu={(e) => handleRightClick(e, item.id)}
          style={{ background: item.color }}
        >
          {expand ? (
            <button
              aria-label='Un-expand sub pages button'
              title='un-expand'
              className={`${styles.btn1} ${styles.btn1_expanded}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSetExpand(e, item.id, false);
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='24'
                viewBox='0 -960 960 960'
                width='24'
              >
                <path d='M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z' />
              </svg>
            </button>
          ) : (
            <button
              aria-label='Expand sub pages button'
              title='expand'
              className={styles.btn1}
              onClick={(e) => {
                e.stopPropagation();
                handleSetExpand(e, item.id, true);
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='24'
                viewBox='0 -960 960 960'
                width='24'
              >
                <path d='m376-240-56-56 184-184-184-184 56-56 240 240-240 240Z' />
              </svg>
            </button>
          )}
          <div style={{ display: 'flex' }} onClick={() => {
            setIconModalState(true)
          }}>
            {item.icon && item.icon.includes('.png') ? (<img className={styles.page_icon} src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}</div>{item.title ? item.title : `Untitled: ${item.id}`}

          {(expand) && (
            <span
              title='New page'
              onClick={(e) => {
                e.stopPropagation();
                createNewPage(e, item.id);
              }}
              className={styles.createpage}
            >
              <svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20'>
                <path d='M444-240v-204H240v-72h204v-204h72v204h204v72H516v204h-72Z' />
              </svg>
            </span>
          )}
        </div>
        {expand && children?.length === 0 && (
          <span className={styles.create_new_page_btn_text}>
            No sub pages
          </span>
        )}
        {children && expand ? <ol className={styles.items2}>{children}</ol> : null}
      </li>
      {iconModalState && (
        <Icons Close={() => setIconModalState(false)} Select={changePageIcon} Selected={item.icon} />
      )}
    </>
  );
};

export default MyComponent;


function ImportantNotes({ notes, setVisibleState }) {
  const router = useRouter()
  function openPage(e, item) {
    e.preventDefault();

    if (window.innerWidth < 800) {
      // Perform actions for screens less than 800px wide
      setVisibleState(false);
    }
    router.push(`/page/${item}`);
  }
  return (
    <div className={styles.importantnote}>
      {notes.map((note) => {
        if (note.important) {
          return (
            <>
              <li >
                <div
                  className={`${styles.page_list_item}`}

                  onClick={(e) => openPage(e, note.id)}
                >
                  <button
                    className={styles.btn1}
                  >
                    <svg className={styles.pushpinImportantNote} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px" ><g><rect fill="none" height="20" width="20" /></g><g><g><path d="M15,10.47c0-0.26-0.19-0.46-0.44-0.52C13.67,9.75,13,8.95,13,8V4h0.5C13.78,4,14,3.78,14,3.5C14,3.22,13.78,3,13.5,3h-7 C6.22,3,6,3.22,6,3.5C6,3.78,6.22,4,6.5,4H7v4c0,0.95-0.67,1.75-1.56,1.95C5.19,10.01,5,10.21,5,10.47v0C5,10.76,5.24,11,5.53,11 H9.5v5.5c0,0.28,0.22,0.5,0.5,0.5h0c0.28,0,0.5-0.22,0.5-0.5V11h3.97C14.76,11,15,10.76,15,10.47L15,10.47z" /></g></g></svg>
                  </button>

                  {note.icon && note.icon.includes('.png') ? (<img className={styles.page_icon} src={`/emoji/twitter/64/${note.icon}`} />) : (!isNaN(parseInt(note.icon, 16)) && String.fromCodePoint(parseInt(note.icon, 16)))}
                  {note.title ? note.title : `Untitled: ${note.id}`}

                </div>
              </li>
            </>
          )
        }
      })}
    </div>
  )
}


function MultiEditor({ pagesList, Close }) {
  const [pages, setPagesList] = useState(pagesList)
  const [selected4, setSelected3] = useState([])
  const [toomany, setTooMany] = useState(false)

  function setSelectedPage(page) {
    if (selected4.includes(page)) {
      setSelected3(selected4.filter(pages => pages != page))
    } else if (!selected4) {
      setSelected3(page);
    } else {
      setSelected3(prevPages => [...prevPages, page]);
    }
  }

  function openPages() {
    const selectedPath = selected4.join('/');
    if ((window.innerWidth - 300) / selected4.length < 300) {
      return setTooMany(true)
    }
    setTooMany(false)
    Router.push(`/page/${selectedPath}`);
    Close()
  }

  return (
    <>
      <ModalContainer events={() => Close()}>
        <ModalForm>
          <ModalTitle>Select pages</ModalTitle>
          <div className={styles.multiedit_pages}>
            {pages.map((page) => (
              <div className={`${styles.multiedit_page} ${selected4.includes(page.id) ? styles.selected : ''}`} key={page.id} onClick={() => setSelectedPage(page.id)}>        {page.icon && page.icon.includes('.png') ? (<img className={styles.page_icon} src={`/emoji/twitter/64/${page.icon}`} />) : (!isNaN(parseInt(page.icon, 16)) && String.fromCodePoint(parseInt(page.icon, 16)))}{page.title ? page.title : `Untitled: ${page.id}`}
              </div>
            ))}
          </div>
          {toomany && ('You have too many pages selected to fit in this size screen!')}
          <AlternateButton click={openPages}>Open</AlternateButton>
        </ModalForm>
      </ModalContainer>
    </>
  )
}


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
        <button aria-label='Toggle page menu' onClick={setVisibleState} className={styles.desktophidemenu}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M24 0v24H0V0h24z" fill="none" opacity=".87" /><path d="M17.7 15.89L13.82 12l3.89-3.89c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.38.38-1.02-.01-1.4zM7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1z" /></svg></button>
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
                {filteredItems.map((item) => (
                  <ChildComponent
                    item={item}
                    level={0}
                  >
                  </ChildComponent>
                ))}</>
            )}
          </ol>
        </div>
      )}

    </>
  )
}
