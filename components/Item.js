import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
import { useRouter } from 'next/router';

const MyComponent = ({ currPage }) => {
  const [items, setItems] = useState([]);
  const router = useRouter()

  useEffect(() => {
    async function getData() {


      const records = await pb.collection('pages_Bare').getFullList({
        sort: '-created',
      });
      setItems(records);

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
    };
    const record = await pb.collection('pages').create(data);
    router.push(`/page/${record.id}`)
    //console.log(record.id);

    // Update the items state by adding the new record
    //setItems((prevItems) => [...prevItems, record]);
  }

  //const [visible, setVisibleState] = useState(true);
  const [vis, setVis] = useState(true);
  function setVisibleState() {
    document.getElementById('rootitems').classList.toggle(styles.hidden)
    setVis(document.getElementById('rootitems').classList.contains(styles.hidden) ? false : true)
  }

  return (
    <>
      <>
        <div className={styles.mobilePageNav}>

          <Link href='/u/me' className={styles.mobile_back_btn}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><g><path d="M10.67,13.02C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V19c0,0.55,0.45,1,1,1 h8.26C10.47,18.87,10,17.49,10,16C10,14.93,10.25,13.93,10.67,13.02z" /><circle cx="10" cy="8" r="4" /><path d="M20.75,16c0-0.22-0.03-0.42-0.06-0.63l0.84-0.73c0.18-0.16,0.22-0.42,0.1-0.63l-0.59-1.02c-0.12-0.21-0.37-0.3-0.59-0.22 l-1.06,0.36c-0.32-0.27-0.68-0.48-1.08-0.63l-0.22-1.09c-0.05-0.23-0.25-0.4-0.49-0.4h-1.18c-0.24,0-0.44,0.17-0.49,0.4 l-0.22,1.09c-0.4,0.15-0.76,0.36-1.08,0.63l-1.06-0.36c-0.23-0.08-0.47,0.02-0.59,0.22l-0.59,1.02c-0.12,0.21-0.08,0.47,0.1,0.63 l0.84,0.73c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-0.84,0.73c-0.18,0.16-0.22,0.42-0.1,0.63l0.59,1.02 c0.12,0.21,0.37,0.3,0.59,0.22l1.06-0.36c0.32,0.27,0.68,0.48,1.08,0.63l0.22,1.09c0.05,0.23,0.25,0.4,0.49,0.4h1.18 c0.24,0,0.44-0.17,0.49-0.4l0.22-1.09c0.4-0.15,0.76-0.36,1.08-0.63l1.06,0.36c0.23,0.08,0.47-0.02,0.59-0.22l0.59-1.02 c0.12-0.21,0.08-0.47-0.1-0.63l-0.84-0.73C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S18.1,18,17,18z" /></g></g></svg></Link>
        </div>
        <label className={`${styles.burger}`} for="burger">
          <input onChange={() => setVisibleState()} checked={vis} type="checkbox" id="burger" />
          <span></span>
          <span></span>
          <span></span>
        </label>
      </>

      <div className={`${styles.itemroot}`} id='rootitems'>

        {rootParents.map((rootParent) => (
          <div key={rootParent.id} className={styles.itemscon}>
            <RootParentComponent
              item={rootParent}
              currPage={currPage}
              createNewPage={createNewPage}
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

        {item.icon ? item.icon : '📄'}{item.title ? item.title : `Untitled: ${item.id}`}

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
          No pages
        </span>
      )}
      {children && expand ? <ol className={styles.items2}>{children}</ol> : null}
    </li>

  );
};

export default MyComponent;
