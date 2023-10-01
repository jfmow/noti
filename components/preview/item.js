import React, { useEffect, useState, useRef } from 'react';
import styles from '@/styles/PageList.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import PocketBase from 'pocketbase';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
import Router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { AlternateButton, ModalContainer, ModalForm, ModalTitle } from '@/lib/Modal';
const Icons = dynamic(() => import('@/components/editor/Menu/Icons'));

const MyComponent = ({ currPage }) => {
    const [items, setItems] = useState([]);
    const [loading, setIsLoading] = useState(true)
    const router = useRouter()
    const contextMenu = useRef(null)
    const [showMultiEditorSelector, setShowMultiEditorSelector] = useState(false)
    useEffect(() => {
        async function getData() {
            try {
                setItems([
                    {
                        "id": "notepreviewpage",
                        "collectionId": "hiqr75tw9rp0no4",
                        "collectionName": "pages_Bare",
                        "owner": "",
                        "title": "Preview page",
                        "expanded": true,
                        "parentId": "",
                        "icon": "1F4DA.png",
                        "shared": true,
                        "color": "rgba(255, 165, 0, 0.1)"
                    },
                    {
                        "id": "notepreviewpag2",
                        "collectionId": "hiqr75tw9rp0no4",
                        "collectionName": "pages_Bare",
                        "owner": "",
                        "title": "Preview page 2",
                        "expanded": false,
                        "parentId": "",
                        "icon": "1F4DF.png",
                        "color": "linear-gradient(45deg, rgba(255, 0, 255, 0.1) 69.1083%, transparent 30.8917%)"
                    }
                ]);
                setIsLoading(false)

            } catch (err) {
                console.error(err)
            }

        }
        getData();

    }, []);

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
        return
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
        const customContextMenu = contextMenu.current;

        // Set the position of the custom context menu to the right-click location
        customContextMenu.style.left = e.clientX - 10 + 'px';
        customContextMenu.style.top = e.clientY - 10 + 'px';

        // Show the custom context menu
        customContextMenu.style.display = 'flex';
        customContextMenu.setAttribute('pageid', page)
    }

    async function contextMenuDeletePage() {

        const customContextMenu = contextMenu.current;
        const page = customContextMenu.getAttribute('pageid')
        await pb.collection('pages').delete(page)
        customContextMenu.style.display = 'none';
    }

    function hideContextMenu() {
        const customContextMenu = contextMenu.current;
        customContextMenu.style.display = 'none';
    }



    return (
        <>
            <div className={styles.contextmenu} onMouseLeave={() => hideContextMenu()} ref={contextMenu}>
                <div className={styles.contextMenuItem} onClick={() => setShowMultiEditorSelector(true)}>
                    <div className={styles.contextMenuIcon}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><g><path d="M18,4v5H6V4H18z M18,2H6C4.9,2,4,2.9,4,4v5c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C20,2.9,19.1,2,18,2z M18,15v5H6v-5H18z M18,13H6c-1.1,0-2,0.9-2,2v5c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-5C20,13.9,19.1,13,18,13z" /></g></g></svg></div>
                    <span className={styles.contextMenuTitle}>MultiEditor</span>
                </div>
                <div className={styles.contextMenuItem} onClick={() => contextMenuDeletePage()}>
                    <div className={styles.contextMenuIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM9 9h6c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1v-8c0-.55.45-1 1-1zm6.5-5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1h-2.5z" /></svg></div>
                    <span className={styles.contextMenuTitle}>Delete page</span>
                </div>
            </div>
            <div className={`${styles.itemroot}`} id='rootitems'>

                {showMultiEditorSelector && (<MultiEditor pagesList={items} Close={() => setShowMultiEditorSelector(false)} />)}

                <button onClick={setVisibleState} className={styles.desktophidemenu}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M24 0v24H0V0h24z" fill="none" opacity=".87" /><path d="M17.7 15.89L13.82 12l3.89-3.89c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.38.38-1.02-.01-1.4zM7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1z" /></svg></button>

                <ImportantNotes notes={items} setVisibleState={setVisibleState} />

                <AnimatePresence>
                    {rootParents.map((rootParent) => (
                        <motion.div
                            key={rootParent.id}
                            className={styles.itemscon}
                            initial={{ opacity: 0, y: -20, scale: 1.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 1 }}
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
                        </motion.div>
                    ))}
                </AnimatePresence>
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
        router.push(`/preview/${item}`);
    }

    async function handleSetExpand(e, item, state) {
        e.preventDefault()
        setExpand(state);
        return
    }

    function handleDragStart(event, itemId) {
        event.dataTransfer.setData("text/plain", itemId);
        //console.log("Started dragging item with ID:", itemId);
    }

    async function handleDragEnd(event, itemId, itemParent) {
        event.persist();
        return
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
        return
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
                            title='un-expand'
                            className={styles.btn1}
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
                {expand && children.length === 0 && (
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
                                        <svg className={styles.pushpinImportantNote} xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px" ><g><rect fill="none" height="20" width="20" /></g><g><g><path d="M15,10.47c0-0.26-0.19-0.46-0.44-0.52C13.67,9.75,13,8.95,13,8V4h0.5C13.78,4,14,3.78,14,3.5C14,3.22,13.78,3,13.5,3h-7 C6.22,3,6,3.22,6,3.5C6,3.78,6.22,4,6.5,4H7v4c0,0.95-0.67,1.75-1.56,1.95C5.19,10.01,5,10.21,5,10.47v0C5,10.76,5.24,11,5.53,11 H9.5v5.5c0,0.28,0.22,0.5,0.5,0.5h0c0.28,0,0.5-0.22,0.5-0.5V11h3.97C14.76,11,15,10.76,15,10.47L15,10.47z" /></g></g></svg>
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
                    <p style={{ fontSize: '12px' }}>Some users may experience the issue of the page reloading back to the home screen. We sincerely apologize for any inconvenience this may cause. Our team is actively investigating the problem to identify its cause and implement a solution. Thank you for your patience and understanding.</p>
                </ModalForm>
            </ModalContainer>
        </>
    )
}
