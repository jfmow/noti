import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const MyComponent = ({ currPage, preview }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getData() {
      if (preview) {
        const records = await pb.collection('preview').getFullList({
          sort: '-created',
        });
        setItems(records)
      } else {

        const records = await pb.collection('pages')
          .getFullList({
            sort: '-created',
          });
        setItems(records);
      }
    }
    getData();
    const unsubscribe = pb.collection('pages')
      .subscribe('*', function (e) {
        const updatedRecord = e.record;
        if(e.action === 'delete'){
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
    //console.log(record.id);

    // Update the items state by adding the new record
    //setItems((prevItems) => [...prevItems, record]);
  }

  const [visible, setVisible] = useState(true)

  return (
    <>

      <div className={`${styles.itemroot} ${!visible && styles.itemrootoff}`}>
        <Link href='/u/me' className={`${styles.usrsettings} ${!visible && styles.usrsettinghidden}`}><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" /></svg></Link>
        {visible ? (
          <button onClick={() => setVisible(false)} className={styles.hidebtn}>Hide</button>
        ) : (
          <button onClick={() => setVisible(true)} className={styles.hidebtn}>Menu</button>
        )}
        {visible && (
          <>
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
          </>
        )}
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

const ChildComponent = ({ item, level, children, currPage2, isActive, createNewPage }) => {
  const [expand, setExpand] = useState(false);
  const router = useRouter()
  function openPage(e, item) {
    e.preventDefault()
    router.push(`/page/${item}`)
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
              setExpand(false);
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
              setExpand(true);
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

        {item.title ? item.title : `Untitled: ${item.id}`}

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
