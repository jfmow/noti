import { ContextMenuDropMenu, ContextMenuDropMenuSection, ContextMenuDropMenuSectionItem, PopDropMenuStatic } from '@/lib/ContextMenu';
import { PopUpCardDropMenu, PopUpCardDropMenuSection, PopUpCardDropMenuSectionItem, PopUpCardDropMenuSectionTitle, PopUpCardDropMenuStaticPos } from '@/lib/Pop-Cards/PopDropMenu';
import styles from '@/styles/TabBar.module.css';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function TabBar({ pb, page, }) {
    const [tabBarItems, setTabBarItems] = useState([]);
    const [draggedItemId, setDraggedItemId] = useState(null);
    const [newPageDropEvent, setNewPageDropEvent] = useState(null)
    const [tabBarHidden, setTabBarHidden] = useState(false)
    const [addPageDropMenuEvent, setAddPageDropMenuEvent] = useState(false)

    useEffect(() => {
        window.addEventListener('storage', (e) => {
            if (e.key === 'tabbarstate') {
                window.localStorage.setItem('_tabbar', JSON.stringify([]))
                setTabBarHidden(false)
            }
        });
        if (window.localStorage.getItem('_tabbar') === 'hidden' || window.innerWidth < 600) {
            setTabBarHidden(true)
            return
        }
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
        return () => {
            window.removeEventListener('storage', (e) => {
                if (e.key === 'tabbarstate') {
                    setTabBarHidden(false)
                }
            })
        }
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
        //console.log(updatedItems)
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

    function hideTabBar() {
        window.localStorage.setItem('_tabbar', 'hidden')
        setTabBarHidden(true)
        setNewPageDropEvent(null)
        toast.success('Tab bar hidden! Go to your theme setting to get it back.')
    }

    async function CreateANewPage() {
        const loadingToast = toast.loading('Creating page...')
        const data = {
            "parentId": "",
            "owner": pb.authStore.model.id,
            "content": "JSON",
        };

        const record = await pb.collection('pages').create(data);
        setNewPageDropEvent(null)
        toast.dismiss(loadingToast)
        toast.success('Page created successfully!')
        Router.push(`/page/${record.id}`)
    }


    return (
        <>
            {!tabBarHidden && (
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
                    <button className={styles.newPageDropButton} onClick={(e) => setNewPageDropEvent(e)} type='button'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg></button>
                    <PopUpCardDropMenu event={newPageDropEvent} minGap={3}>
                        <PopUpCardDropMenuSectionTitle>
                            Pages
                        </PopUpCardDropMenuSectionTitle>
                        <PopUpCardDropMenuSection>
                            <PopUpCardDropMenuSectionItem onClick={() => {

                                CreateANewPage()
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-plus"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="12" x2="12" y1="18" y2="12" /><line x1="9" x2="15" y1="15" y2="15" /></svg>
                                <p>Create new page</p>
                            </PopUpCardDropMenuSectionItem>
                            <PopUpCardDropMenuSectionItem onClick={() => {
                                //setAddPageDropMenuEvent(!addPageDropMenuEvent)
                                toast('Comming soon!')
                            }} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-square"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" /><path d="m12 12 4 10 1.7-4.3L22 16Z" /></svg>
                                <p>Add page</p>
                                {addPageDropMenuEvent && (
                                    <PopDropMenuStatic style={{ width: '200px', minHeight: '100px', position: 'absolute', zIndex: '13', left: `-198px`, top: '40px' }}>
                                        <PopUpCardDropMenuSection>
                                            <PopUpCardDropMenuSectionItem>
                                                test
                                            </PopUpCardDropMenuSectionItem>
                                        </PopUpCardDropMenuSection>
                                    </PopDropMenuStatic>
                                )}

                            </PopUpCardDropMenuSectionItem>
                        </PopUpCardDropMenuSection>
                        <PopUpCardDropMenuSectionTitle>
                            TabBar
                        </PopUpCardDropMenuSectionTitle>
                        <PopUpCardDropMenuSection>
                            <PopUpCardDropMenuSectionItem onClick={() => hideTabBar()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                <p>Hide</p>
                            </PopUpCardDropMenuSectionItem>
                            <PopUpCardDropMenuSectionItem onClick={() => {
                                window.localStorage.setItem('_tabbar', JSON.stringify([]))
                                setTabBarItems([])
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                <p>Clear</p>
                            </PopUpCardDropMenuSectionItem>
                        </PopUpCardDropMenuSection>
                    </PopUpCardDropMenu>

                </div>
            )}
        </>
    );
}

function TabBarItem({ name, icon, active, id, RemoveTabItem, onDragStart, onDragOver, onDrop, page }) {
    const selfRef = useRef(null);
    const [contextMenuEvent, setContextMenuEvent] = useState(null)

    return (
        <>

            <ContextMenuDropMenu event={contextMenuEvent}>
                <ContextMenuDropMenuSection >
                    <ContextMenuDropMenuSectionItem onClick={() => RemoveTabItem(contextMenuEvent.data.filter(item => item.key === 'pageId')[0].value)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-square"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /></svg>
                        <p>Remove item</p>
                    </ContextMenuDropMenuSectionItem>

                </ContextMenuDropMenuSection>
                <ContextMenuDropMenuSection >
                    <ContextMenuDropMenuSectionItem onClick={() => window.open(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/${id}`, '_blank')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-app-window"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 4v4" /><path d="M2 8h20" /><path d="M6 4v4" /></svg>
                        <p>Open in new tab</p>
                    </ContextMenuDropMenuSectionItem>
                    {!active && (
                        <ContextMenuDropMenuSectionItem onClick={() => Router.push(`/page/${Router.asPath.split('/page/')[1]}/${id}`)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-columns"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="12" x2="12" y1="3" y2="21" /></svg>
                            <p>Open in split view</p>
                        </ContextMenuDropMenuSectionItem>
                    )}
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

export function ShowTabBar() {

    const storageEvent = new Event('storage');
    storageEvent.key = 'tabbarstate';
    window.dispatchEvent(storageEvent);
}
