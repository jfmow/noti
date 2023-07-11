import React, { useEffect, useState } from 'react';
import styles from '@/styles/PageList.module.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const Tut = dynamic(() => import('./Tutorial'));

const MyComponent = ({ currPage }) => {
  const [items, setItems] = useState([]);
  const [loading, setIsLoading] = useState(true)
  const router = useRouter()
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    async function getData() {
      const records = await pb.collection('pages_Bare').getFullList({
        sort: '-created',
      });
      setItems(records);
      setIsLoading(false)

      if (!currPage || currPage === "firstopen" && localStorage.getItem('Offlinetime') != "true") {
        const latestRecord = records.filter(record => record.updated)[0];
        console.log(latestRecord)
        if (latestRecord) {
          router.push(`/page/${latestRecord.id}`)
        }
        if (records.length === 0) {
          setHidden(false)
        }
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

  if (loading) {
    return (
      <div className={`${styles.itemroot}`} id='rootitems'>
        <button onClick={setVisibleState} className={styles.hidemenubtn}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg></button>
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
      const isActive = currPage === child.id;
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
    //console.log(record.id);

    // Update the items state by adding the new record
    //setItems((prevItems) => [...prevItems, record]);
  }

  //const [visible, setVisibleState] = useState(true);
  function setVisibleState() {
    document.getElementById('rootitems').classList.toggle(styles.dskhidden)
    window.localStorage.setItem('_menu', document.getElementById('rootitems').classList.contains(styles.dskhidden) ? ('closed') : ('open'))
  }

  if (window.localStorage.getItem('_menu') === 'closed') {
    try {
      document.getElementById('rootitems').classList.add(styles.dskhidden)
    } catch (err) {
      console.log(err)
      return
    }
  } else if (window.localStorage.getItem('_menu') === "open") {
    try {
      document.getElementById('rootitems').classList.remove(styles.dskhidden)
    } catch (err) {
      return
    }
  }

  return (
    <>
      <>
        <div className={styles.mobilePageNav}>
          <Link href='/u/me' className={styles.mobile_back_btn}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><g><path d="M10.67,13.02C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V19c0,0.55,0.45,1,1,1 h8.26C10.47,18.87,10,17.49,10,16C10,14.93,10.25,13.93,10.67,13.02z" /><circle cx="10" cy="8" r="4" /><path d="M20.75,16c0-0.22-0.03-0.42-0.06-0.63l0.84-0.73c0.18-0.16,0.22-0.42,0.1-0.63l-0.59-1.02c-0.12-0.21-0.37-0.3-0.59-0.22 l-1.06,0.36c-0.32-0.27-0.68-0.48-1.08-0.63l-0.22-1.09c-0.05-0.23-0.25-0.4-0.49-0.4h-1.18c-0.24,0-0.44,0.17-0.49,0.4 l-0.22,1.09c-0.4,0.15-0.76,0.36-1.08,0.63l-1.06-0.36c-0.23-0.08-0.47,0.02-0.59,0.22l-0.59,1.02c-0.12,0.21-0.08,0.47,0.1,0.63 l0.84,0.73c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-0.84,0.73c-0.18,0.16-0.22,0.42-0.1,0.63l0.59,1.02 c0.12,0.21,0.37,0.3,0.59,0.22l1.06-0.36c0.32,0.27,0.68,0.48,1.08,0.63l0.22,1.09c0.05,0.23,0.25,0.4,0.49,0.4h1.18 c0.24,0,0.44-0.17,0.49-0.4l0.22-1.09c0.4-0.15,0.76-0.36,1.08-0.63l1.06,0.36c0.23,0.08,0.47-0.02,0.59-0.22l0.59-1.02 c0.12-0.21,0.08-0.47-0.1-0.63l-0.84-0.73C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S18.1,18,17,18z" /></g></g></svg></Link>
          <button className={styles.mobile_back_btn} onClick={setVisibleState}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" /></svg></button>
        </div>
      </>
      {!hidden && (<Tut setHidden={setHidden} />)}
      <div className={`${styles.itemroot}`} id='rootitems'>
        <button onClick={setVisibleState} className={styles.desktophidemenu}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><g><path d="M20.08,11.42l-4.04-5.65C15.7,5.29,15.15,5,14.56,5h0c-1.49,0-2.35,1.68-1.49,2.89L16,12l-2.93,4.11 c-0.87,1.21,0,2.89,1.49,2.89h0c0.59,0,1.15-0.29,1.49-0.77l4.04-5.65C20.33,12.23,20.33,11.77,20.08,11.42z" /><path d="M13.08,11.42L9.05,5.77C8.7,5.29,8.15,5,7.56,5h0C6.07,5,5.2,6.68,6.07,7.89L9,12l-2.93,4.11C5.2,17.32,6.07,19,7.56,19h0 c0.59,0,1.15-0.29,1.49-0.77l4.04-5.65C13.33,12.23,13.33,11.77,13.08,11.42z" /></g></g></svg></button>
        <ImportantNotes notes={items} setVisibleState={setVisibleState} />
        <button onClick={setVisibleState} className={styles.hidemenubtn}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg></button>
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
          className={`${styles.createpage} ${styles.createrootpage}`}
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

const RootParentComponent = ({ item, currPage, createNewPage, children }) => {
  //const [expand, setExpand] = useState(false);

  return (
    <div>
      <ol className={styles.items}>
        <ChildComponent
          item={item}
          level={0}
          currPage2={currPage}
          isActive={currPage === item.id}
          createNewPage={createNewPage}
        >
          {children}
        </ChildComponent>
      </ol>
    </div>
  );
};

const ChildComponent = ({ item, level, children, currPage2, isActive, createNewPage, setVisibleState }) => {
  const [expand, setExpand] = useState(item.expanded);
  const router = useRouter()
  function openPage(e, item) {
    e.preventDefault();

    if (window.innerWidth < 800) {
      // Perform actions for screens less than 800px wide
      setVisibleState(false);
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


  return (
    <li>
      <div
        className={`${styles[`level_${level}`]} ${currPage2 === item.id || isActive ? styles.active : ''
          } ${styles.itemoption}`}
        id={currPage2 === item.id ? styles.active : 'fake'}
        onClick={(e) => openPage(e, item.id)}
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

        {item.icon && item.icon.includes('.png') ? (<img className={styles.page_icon} src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}{item.title ? item.title : `Untitled: ${item.id}`}


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
        <span className={styles.createpage_txt}>
          No sub pages
        </span>
      )}
      {children && expand ? <ol className={styles.items2}>{children}</ol> : null}
    </li>

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
                  className={`${styles.itemoption}`}

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