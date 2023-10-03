import { ContextMenuDropMenu, ContextMenuDropMenuSection, ContextMenuDropMenuSectionItem } from '@/lib/ContextMenu';
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
                const toPush = records.filter(rec => rec.id === item.id)[0]
                if (toPush) {
                    tempArrayItem.push(toPush)
                }
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
        console.log(updatedItems)
        const draggedItemIndex = updatedItems.findIndex((item) => item.id === draggedItemId);
        const dropItemIndex = updatedItems.findIndex((item) => item.id === id);
        [updatedItems[draggedItemIndex], updatedItems[dropItemIndex]] = [
            updatedItems[dropItemIndex],
            updatedItems[draggedItemIndex],
        ];
        setTabBarItems(updatedItems);
        setDraggedItemId(null);
        window.localStorage.setItem('_tabbar', JSON.stringify(updatedItems))
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
                            active={Router.asPath.split('/page/')[1].includes(item.id)}
                            id={item.id}
                            RemoveTabItem={RemoveTabItem}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            page={page}
                        />
                    );
                })}
            </div>
        </>
    );
}

function TabBarItem({ name, icon, active, id, RemoveTabItem, onDragStart, onDragOver, onDrop, page }) {
    const selfRef = useRef(null);
    const [contextMenuEvent, setContextMenuEvent] = useState(null)

    function openContextMenu(e, id) {

    }

    return (
        <>

            <ContextMenuDropMenu event={contextMenuEvent}>
                <ContextMenuDropMenuSection style={{ borderTop: 'none' }}>
                    <ContextMenuDropMenuSectionItem onClick={() => RemoveTabItem(contextMenuEvent.data.filter(item => item.key === 'pageId')[0].value)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-square"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /></svg>
                        <p>Remove item</p>
                    </ContextMenuDropMenuSectionItem>

                </ContextMenuDropMenuSection>
                <ContextMenuDropMenuSection style={{ borderBottom: 'none' }}>
                    <ContextMenuDropMenuSectionItem onClick={() => window.open(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/${id}`, '_blank')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-app-window"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 4v4" /><path d="M2 8h20" /><path d="M6 4v4" /></svg>
                        <p>Open in new tab</p>
                    </ContextMenuDropMenuSectionItem>
                    <ContextMenuDropMenuSectionItem onClick={() => Router.push(`/page/${Router.asPath.split('/page/')[1]}/${id}`)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-columns"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="12" x2="12" y1="3" y2="21" /></svg>
                        <p>Open in split view</p>
                    </ContextMenuDropMenuSectionItem>
                </ContextMenuDropMenuSection>
            </ContextMenuDropMenu>
            <div
                ref={selfRef}
                onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenuEvent({ eventData: e, data: [{ key: "pageId", value: id }] })
                }}
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
                    {icon && icon.includes('.png') ? (
                        <img className={styles.page_icon} src={`/emoji/twitter/64/${icon}`} alt={name} />
                    ) : (
                        !isNaN(parseInt(icon, 16)) && String.fromCodePoint(parseInt(icon, 16))
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
        </>
    );
}
