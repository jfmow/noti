import Loader from '@/components/Loader';
import PocketBase from 'pocketbase'
import React, { Suspense, lazy, useContext, useEffect, useState } from 'react';
import MenuBar from '@/components/editor/Menubar';
import Router, { useRouter } from 'next/router';
import PeekPageBlock from '@/lib/Modals/PeekPage';
import NewPageModal from '@/lib/Modals/NewPage';
import UsersPages from '@/components/ListPages';
import EnableWebsiteThemes from '@/lib/Themes/everything';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

const EditorContext = React.createContext();
const Editor = lazy(() => import('../../components/editor/Editor'));

function NotionEditor() {
    const { query } = useRouter()
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(true)
    const [listedPageItems, setListedPageItems] = useState([])
    const [listedPageItemsFilter, setListedPageItemsFilters] = useState({ archived: false })
    const [showArchivedPages, setShowArchivedPages] = useState(false)
    const [pageId, setPageId] = useState("")
    const [primaryVisiblePageData, setPrimaryVisiblePageData] = useState({})

    useEffect(() => {
        EnableWebsiteThemes()
    }, [])

    useEffect(() => {
        function authUpdate() {
            pb.collection('users').authRefresh().then((() => {
                //Ok
                // Do nothing
                return
            }), (() => {
                //Not OK
                pb.authStore.clear();
                return window.location.replace("/auth/login");
            }));
        }

        async function GetLatestPage(urlParams) {
            authUpdate()
            try {
                const latestPage = await pb.collection("pages").getFirstListItem(`id != '${urlParams.get("p")}'`, { sort: "-updated" })
                urlParams.set("edit", latestPage.id)
                Router.push(`/page?${urlParams.toString()}`)
            } catch { }
        }
        function SetCurrentPage(urlParams) {
            if (urlParams.has("edit")) {
                const page = urlParams.get("edit")
                if (page.length !== 15) {
                    GetLatestPage()
                    return
                }
                setPageId(page)
            }
        }
        const urlParams = new URLSearchParams(window.location.search)
        if (query.edit || urlParams.has("edit")) {
            SetCurrentPage(urlParams)
            if (urlParams.has("side")) {
                setVisible(urlParams.get("side") === "true" ? true : false)
            }
        } else {
            GetLatestPage(urlParams)
        }
        setIsLoading(false)

    }, [query])

    if (isLoading) {
        return (<Loader />)
    }

    return (
        <EditorContext.Provider value={{ showArchivedPages, setShowArchivedPages, listedPageItems, pb, setListedPageItems, visible, setVisible, currentPage: pageId, pageId, listedPageItemsFilter, setListedPageItemsFilters, setPrimaryVisiblePageData, primaryVisiblePageData }}>
            <div>
                <div className='flex flex-col sm:flex-row'>
                    <UsersPages />
                    <div style={{ flex: '1 1 0%', position: 'relative', display: 'flex', height: '100dvh', flexDirection: 'column', overflowX: 'hidden' }}>
                        <MenuBar currentPageData={primaryVisiblePageData} />

                        {pageId !== "" ? (
                            <Suspense fallback={<></>}>
                                <Editor currentPage={pageId} page={pageId} />
                            </Suspense>
                        ) : null}
                    </div>
                    {query.pm === "l" ? (
                        <NewPageModal pageId={query.p} />
                    ) : null}
                    {query.pm === "s" ? (
                        <div className='bg-zinc-200 max-w-[35%] w-[800px] h-[100dvh] overflow-hidden'>
                            <PeekPageBlock pageId={query.p} />
                        </div>
                    ) : null}
                </div>
            </div>
        </EditorContext.Provider>
    );
}

export default NotionEditor;



export const useEditorContext = () => {
    return useContext(EditorContext);
};
