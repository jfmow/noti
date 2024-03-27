import Loader from '@/components/Loader';
import PocketBase from 'pocketbase'
import React, { Suspense, lazy, useContext, useEffect, useState } from 'react';
import MyComponent from '@/components/Item';
import MenuBar from '@/components/editor/MenuBar';
import Router, { useRouter } from 'next/router';
import PeekPageBlock from '@/lib/Modals/PeekPage';
import NewPageModal from '@/lib/Modals/NewPage';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

const EditorContext = React.createContext();
const Editor = lazy(() => import('../../components/editor/Editor3'));

function NotionEditor() {
    const { query } = useRouter()
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(true)
    const [listedPageItems, setListedPageItems] = useState([])
    const [listedPageItemsFilter, setListedPageItemsFilters] = useState({ archived: false })
    const [showArchivedPages, setShowArchivedPages] = useState(false)
    const [pageId, setPageId] = useState("")
    const [themes, setThemes] = useState([])
    const [primaryVisiblePageData, setPrimaryVisiblePageData] = useState([])

    useEffect(() => {

        let vars = {}
        async function GetThemes() {
            const storedThemes = JSON.parse(window.localStorage.getItem("themes"))
            if (!storedThemes || storedThemes === "" || (Date.now() - storedThemes.updated) < (1000 * 60 * 60 * 24)) {
                const themeFetch = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/themes.json`)
                const themes = await themeFetch.json()
                setThemes(themes)
                window.localStorage.setItem("themes", JSON.stringify({ updated: Date.now(), themes: themes }))
                return themes
            } else {
                setThemes(storedThemes.themes)
                return storedThemes.themes
            }


        }
        async function applyTheme() {
            const theme = window.localStorage.getItem('theme')
            const themes = await GetThemes()
            if (theme && theme !== 'system') {
                vars = themes.find((item) => item.id === theme)?.data
                const r = document.documentElement.style;
                for (const variable in vars) {
                    r.setProperty(variable, vars[variable]);
                }
            }

        }
        applyTheme();

        // Listen for changes in local storage
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                // Theme property has changed, apply the new theme
                const r = document.documentElement.style;
                for (const variable in vars) {
                    r.removeProperty(variable);
                }
                applyTheme();
            }
        });
    }, [])

    useEffect(() => {
        async function GetLatestPage(urlParams) {
            try {
                try {
                    const latestPage = await pb.collection("pages").getFirstListItem(`id != '${urlParams.get("p")}'`, { sort: "-updated" })
                    urlParams.set("edit", latestPage.id)
                    Router.push(`/page?${urlParams.toString()}`)
                } catch (err) {
                    if (err.data.code === 404) {
                        const req = await pb.send("/api/collections/users/account/create-empty-page")
                        Router.push(`/page?edit=${req.id}`)
                    }
                }
            } catch {
                Router.push("/auth/login")
            }
        }
        function SetCurrentPage(urlParams) {
            if (urlParams.has("edit")) {
                const page = urlParams.get("edit")
                if (page.length !== 15) {
                    GetLatestPage()
                    return
                }
                if (page === "previewwelcome0") {
                    setPageId("previewwelcome0")
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
            setIsLoading(false)
        } else {
            GetLatestPage(urlParams)
        }
    }, [query])

    if (isLoading || pageId === "") {
        return (<Loader />)
    }

    return (
        <EditorContext.Provider value={{ showArchivedPages, setShowArchivedPages, listedPageItems, pb, setListedPageItems, visible, setVisible, currentPage: pageId, pageId, themes, listedPageItemsFilter, setListedPageItemsFilters, noSaving: pageId[0] === 'previewwelcome0', setPrimaryVisiblePageData, primaryVisiblePageData }}>
            <div>
                <div className='flex flex-col sm:flex-row'>
                    <MyComponent />
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
