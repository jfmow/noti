import styles from '@/styles/Terminal.module.css'
import { useState, useEffect, useRef } from 'react';
import Link from '@/components/Link';
import Router from 'next/router';
import { ToggleTabBar } from './editor/TabBar';
import { useEditorContext } from '@/pages/page/[...id]';
export default function Terminal() {
    const { listedPageItems, pb, setListedPageItems } = useEditorContext()
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState({ created: false, shared: false, title: '' })
    const [filteredPages, setFilteredPages] = useState([])
    const node = useRef(null);
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if Control key and Space bar are pressed simultaneously
            if (((event.ctrlKey || event.metaKey) && event.key === 'p') || ((event.ctrlKey || event.metaKey) && event.code === 'Space')) {
                event.preventDefault()
                setVisible(true);
            }
        };

        window.addEventListener('customEvent', (e) => { e.key === "terminal_enable" ? setVisible(true) : '' })

        // Add event listener for keydown
        document.addEventListener('keydown', handleKeyDown);

        const handleClickOutside = (event) => {
            if (node.current && !node.current.contains(event.target)) {
                setVisible(false)
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);


        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('customEvent', (e) => { e.key === "terminal_enable" ? setVisible(true) : '' })
        };
    }, []);
    useEffect(() => {
        let pagesCopy = [...listedPageItems]; // Create a copy of the listedPageItems array
        if (filters.created) {
            pagesCopy = pagesCopy.sort((a, b) => new Date(a.created) - new Date(b.created));
        } else {
            pagesCopy = pagesCopy.sort((a, b) => new Date(b.created) - new Date(a.created));
        }
        if (filters.shared) {
            pagesCopy = pagesCopy.filter(page => page.shared);
        }
        if (filters.title) {
            pagesCopy = pagesCopy.filter((page) => page.title.toLowerCase().includes(filters.title.toLowerCase()))
        }
        setFilteredPages(pagesCopy);
    }, [filters, listedPageItems]);

    async function createNewPage(parent) {
        const data = {
            parentId: parent,
            owner: pb.authStore.model.id,
            content: {
                "time": Date.now(),
                "blocks": []
            }
        };
        const record = await pb.collection('listedPageItems').create(data);
        Router.push(`/page/${record.id}`)
        setVisible(false)
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const filteredItems = prevItems.filter(item => item.id !== record.id);

            // Add the new record at the appropriate position based on its created date
            let insertIndex = filteredItems.findIndex(item => item.created < record.created);
            if (insertIndex === -1) {
                insertIndex = filteredItems.length;
            }

            return [
                ...filteredItems.slice(0, insertIndex),
                record,
                ...filteredItems.slice(insertIndex)
            ];
        });
        ////console.log(record.id);

        // Update the items state by adding the new record
        //setItems((prevItems) => [...prevItems, record]);
    }

    return (
        <>
            <div ref={node} className={`${styles.container} ${!visible && styles.hidden}`}>
                <div className={styles.terminal}>
                    <div className={styles.terminalHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <svg style={{ color: '#6115bf' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-terminal-square"><path d="m7 11 2-2-2-2" /><path d="M11 13h4" /><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /></svg>
                            <span>
                                Terminal
                            </span>
                        </div>
                        <input onChange={(e) => setFilters({ ...filters, title: e.target.value })} placeholder={`Search ${pb.authStore.model.username}'s listedPageItems...`} className={styles.searchPagesInput} type='text' />
                        <button type='button' className={styles.close} onClick={() => setVisible(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                    <div className={styles.quickmenu}>
                        <div onClick={() => createNewPage('')} className={styles.quickmenuItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                            Create new page
                        </div>
                        <div className={`${styles.quickmenuItem}`} onClick={() => ToggleTabBar()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-stack"><path d="M16 2v5h5" /><path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17l4 4z" /><path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15" /><path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11" /></svg>
                            Toggle tab bar
                        </div>
                        <div className={`${styles.quickmenuItem} ${filters.shared && styles.quickmenuItem_selected}`} onClick={() => setFilters({ ...filters, shared: !filters.shared })}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-waypoints"><circle cx="12" cy="4.5" r="2.5" /><path d="m10.2 6.3-3.9 3.9" /><circle cx="4.5" cy="12" r="2.5" /><path d="M7 12h10" /><circle cx="19.5" cy="12" r="2.5" /><path d="m13.8 17.7 3.9-3.9" /><circle cx="12" cy="19.5" r="2.5" /></svg>
                            Shared
                        </div>
                        <div className={`${styles.quickmenuItem} ${filters.created && styles.quickmenuItem_selected}`} onClick={() => setFilters({ ...filters, created: !filters.created })}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h5" /><path d="M17.5 17.5 16 16.25V14" /><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" /></svg>
                            Created
                            {filters.created ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>

                            )}
                        </div>

                    </div>
                    <div className={styles.terminalBody}>
                        {filteredPages.map((page => (
                            <>
                                <div className={styles.terminalItem} onClick={() => Router.push(`/page/${page.id}`)}>
                                    <icon>
                                        {page.icon && page.icon.includes('.png') ? (<img className={styles.item_icon} src={`/emoji/twitter/64/${page.icon}`} />) : (!isNaN(parseInt(page.icon, 16)) && String.fromCodePoint(parseInt(page.icon, 16)))}
                                    </icon>
                                    {page.title || page.id}
                                    <div className={styles.terminalItem_hovericon}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-down-left"><polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></svg>
                                    </div>
                                </div>
                            </>
                        )))}
                    </div>
                    <div className={styles.terminalFooter}>
                        <Link href={'/auth/privacy-policy'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-venetian-mask"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" /><path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" /><path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" /></svg>
                            Privacy policy
                        </Link>
                        <Link href={'/auth/terms-and-conditions'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-helping-hand"><path d="m3 15 5.12-5.12A3 3 0 0 1 10.24 9H13a2 2 0 1 1 0 4h-2.5m4-.68 4.17-4.89a1.88 1.88 0 0 1 2.92 2.36l-4.2 5.94A3 3 0 0 1 14.96 17H9.83a2 2 0 0 0-1.42.59L7 19" /><path d="m2 14 6 6" /></svg>
                            Terms & conditions
                        </Link>
                        <a href='#' onClick={() => {
                            pb.authStore.clear()
                            Router.push('/')
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                            Logout
                        </a>
                    </div>
                </div>
            </div>

        </>
    )
}