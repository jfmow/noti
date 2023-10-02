import styles from '@/styles/TabBar.module.css';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function TabBar({ pb, page }) {
    const [tabBarItems, setTabBarItems] = useState([]);
    const [draggedItemId, setDraggedItemId] = useState(null);

    useEffect(() => {
        async function fetchData() {
            let tabBarStore = window.localStorage.getItem('_tabbar')
            if (!tabBarStore) {
                tabBarStore = window.localStorage.setItem('_tabbar', JSON.stringify([]))
                return
            }
            if (!JSON.parse(tabBarStore).some(item => item.id === page)) {
                const updatedStore = [...JSON.parse(tabBarStore), { id: page }]
                window.localStorage.setItem('_tabbar', JSON.stringify(updatedStore))
                tabBarStore = JSON.stringify(updatedStore)
            }
            const records = await pb.collection('pages_Bare').getFullList({
                sort: '-created',
            });
            //console.log(records)
            //console.log(tabBarStore)
            let tempArrayItem = []
            const updatedItems = await JSON.parse(tabBarStore).map((item) => {
                tempArrayItem.push(records.filter(rec => rec.id === item.id)[0])
            });
            setTabBarItems(tempArrayItem);

            //console.log(tempArrayItem)
        }
        fetchData()
    }, [page])

    function RemoveTabItem(id) {
        const tabBarStore = window.localStorage.getItem('_tabbar')
        window.localStorage.setItem('_tabbar', JSON.stringify(JSON.parse(tabBarStore).filter(item => item.id !== id)))
        setTabBarItems(tabBarItems.filter(item => item.id !== id))
        return
    }

    function onDragStart(e, id) {
        setDraggedItemId(id);
    }

    function onDragOver(e) {
        e.preventDefault();

    }

    function onDrop(e, id) {
        e.preventDefault();
        const updatedItems = tabBarItems.slice();
        const draggedItemIndex = updatedItems.findIndex((item) => item.id === draggedItemId);
        const dropItemIndex = updatedItems.findIndex((item) => item.id === id);
        [updatedItems[draggedItemIndex], updatedItems[dropItemIndex]] = [
            updatedItems[dropItemIndex],
            updatedItems[draggedItemIndex],
        ];
        setTabBarItems(updatedItems);
        setDraggedItemId(null);
    }

    return (
        <>
            <div className={styles.tabbar}>
                {tabBarItems.map((item) => {
                    if (item === undefined) {
                        return <></>;
                    }
                    return (
                        <TabBarItem
                            key={item.id}
                            name={item.title}
                            icon={item.icon}
                            active={page === item.id}
                            id={item.id}
                            RemoveTabItem={RemoveTabItem}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                        />
                    );
                })}
            </div>
        </>
    );
}

function TabBarItem({ name, icon, active, id, RemoveTabItem, onDragStart, onDragOver, onDrop }) {
    const selfRef = useRef(null);

    return (
        <div
            ref={selfRef}
            className={`${active && styles.tabbaritem_active} ${styles.tabbaritem}`}
            onClick={() => {
                Router.push(`/page/${id}`);
            }}
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, id)}
        >
            <div className={styles.tabbaritememoji}>
                {selfRef.current?.clientWidth > 90 && (
                    <>
                        {icon && icon.includes('.png') ? (
                            <img className={styles.page_icon} src={`/emoji/twitter/64/${icon}`} alt={name} />
                        ) : (
                            !isNaN(parseInt(icon, 16)) && String.fromCodePoint(parseInt(icon, 16))
                        )}
                    </>
                )}
            </div>

            <div className={styles.tabbaritemname}>{name || id}</div>
            <div className={styles.tabbaritemicon}>
                {active && (
                    <svg
                        onClick={() => RemoveTabItem(id)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                )}
            </div>
        </div>
    );
}
