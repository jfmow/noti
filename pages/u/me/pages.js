import Head from "next/head";
import styles from '@/styles/Blukmanagemnet.module.css'
import Nav from "@/components/Nav";
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase'
import { ModalButton, ModalCheckBox, ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)
export default function BulkManagment() {
    const [pages, setPagesList] = useState([])
    const [seletedPages, setSelectedPages] = useState([])
    const [showWarn, setShowWarning] = useState(false)
    const [reallyConfirm, setConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false)
    useEffect(() => {
        async function authUpdate() {
            try {
                const authData = await pb.collection('users').authRefresh();
                if (pb.authStore.isValid == false) {
                    pb.authStore.clear();
                    return window.location.replace("/auth/login");
                }
                if (authData.record.disabled) {
                    pb.authStore.clear()
                    return window.location.replace('/u/disabled')
                }

            } catch (error) {
                pb.authStore.clear();
                return window.location.replace('/auth/login');
            }
        }
        authUpdate()
        async function getPagesList() {
            const records = await pb.collection('pages_Bare').getFullList({
                sort: '-updated',
            });
            setPagesList(records)
        }
        getPagesList()
    }, [])

    function setSelected(page) {
        if (seletedPages.includes(page)) {
            setSelectedPages(seletedPages.filter(pages => pages != page))
        } else if (!seletedPages) {
            setSelectedPages(page);
        } else {
            setSelectedPages(prevPages => [...prevPages, page]);
        }
    }

    function DeleteWarning() {
        if (seletedPages.length === 0) {
            return
        }
        setShowWarning(true)
        setConfirm(false)
    }

    async function DeleteSelected() {
        if (!reallyConfirm || seletedPages.length === 0) {
            return;
        }

        setShowWarning(false);
        setConfirm(false);
        setDeleting(true);

        for (const page of seletedPages) {
            await pb.collection('pages').delete(page);
            console.log(page);

            // Remove the deleted page from the state
            setPagesList(prevPages => prevPages.filter(p => p.id !== page));
        }
    }

    return (
        <>
            <Head>
                <title>Bluk managment</title>
            </Head>
            <div className={styles.container}>
                <Nav />
                <div className={styles.header}>
                    <h1>Manage pages</h1>
                    <h3>Total pages: {pages.length <= 0 ? ('Loading...') : (pages.length)}</h3>
                </div>
                <div className={styles.page_align_center}>
                    {seletedPages && (
                        <ModalButton classnm={styles.fixeddeletebtn} events={DeleteWarning}>Delete selected pages</ModalButton>
                    )}
                    <div className={styles.pages}>
                        {pages.length <= 0 ? (
                            <>
                                <div className={`${styles.page}  `}>
                                    <span className={styles.page_title}>Loading...</span>
                                    <span>📄</span>
                                </div>
                                <div className={`${styles.page}  `}>
                                    <span className={styles.page_title}>Loading...</span>
                                    <span>📄</span>
                                </div>
                                <div className={`${styles.page}  `}>
                                    <span className={styles.page_title}>Loading...</span>
                                    <span>📄</span>
                                </div>
                                <div className={`${styles.page}  `}>
                                    <span className={styles.page_title}>Loading...</span>
                                    <span>📄</span>
                                </div>

                            </>
                        ) : (
                            <>
                                {pages.map((page) => (
                                    <div onClick={() => (setSelected(page.id))} key={page.id} className={`${styles.page} ${(deleting && seletedPages.includes(page.id)) && styles.deletingpage} ${seletedPages.includes(page.id) && styles.selected}`}>
                                        <span className={styles.page_title}>{page.title || `Untitled ${page.id}`}</span>
                                        <span>{page.icon || "📄"}</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                {showWarn && (
                    <>
                        <ModalContainer events={() => setShowWarning(false)}>
                            <ModalForm>
                                <ModalTitle>
                                    Warning
                                </ModalTitle>
                                <p>This action cannot be undone! By continuing you will delete {seletedPages.length} pages.</p>
                                <ModalCheckBox chngevent={() => setConfirm(true)}>Confirm</ModalCheckBox>
                                <ModalButton events={DeleteSelected}>Delete</ModalButton>
                            </ModalForm>
                        </ModalContainer>
                    </>
                )}
            </div>
        </>
    )
}

