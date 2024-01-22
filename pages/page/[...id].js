import Loader from '@/components/Loader';
import PocketBase from 'pocketbase'
import React, { Suspense, lazy, useContext, useEffect, useState } from 'react';
import MyComponent from '@/components/Item';
import MenuBar from '@/components/editor/MenuBar';
import { useRouter } from 'next/router';
import PeekPageBlock from '@/lib/Modals/PeekPage';
import NewPageModal from '@/lib/Modals/NewPage';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

const EditorContext = React.createContext();


const Editor = lazy(() => import('../../components/editor/Editor3'));

function NotionEditor({ pageId, themes }) {
  const { query } = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(true)
  const [listedPageItems, setListedPageItems] = useState([])
  const [listedPageItemsFilter, setListedPageItemsFilters] = useState({ archived: false })
  const [showArchivedPages, setShowArchivedPages] = useState(false)


  useEffect(() => {

    async function authUpdate() {
      try {
        const authData = await pb.collection('users').authRefresh();
        if (!pb.authStore.isValid) {
          pb.authStore.clear();
          return window.location.replace("/auth/login");
        }
        setIsLoading(false)
        await pb.send("/ping");
      } catch (error) {
        pb.authStore.clear();
        return window.location.replace('/auth/login');
      }

    }
    if (pageId[0] === 'rzz50e2mnhgwof2') {
      setIsLoading(false)
      return
    }
    authUpdate()

    const lastActiveInti = setInterval(async () => {
      await pb.send("/ping");
    }, 60000);
    return () => {
      clearInterval(lastActiveInti);
    };
  }, [])

  useEffect(() => {
    let vars = {}
    async function applyTheme() {
      const theme = window.localStorage.getItem('theme')
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

  if (isLoading) {
    return (<Loader />)
  }

  return (
    <EditorContext.Provider value={{ showArchivedPages, setShowArchivedPages, listedPageItems, pb, setListedPageItems, visible, setVisible, currentPage: pageId[0], pageId, themes, listedPageItemsFilter, setListedPageItemsFilters, noSaving: pageId[0] === 'rzz50e2mnhgwof2' }}>
      <div>
        <div className='flex flex-col sm:flex-row'>
          <MyComponent />
          <div style={{ flex: '1 1 0%', position: 'relative', display: 'flex', height: '100dvh', flexDirection: 'column', overflowX: 'hidden' }}>
            <MenuBar />
            <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
              {
                [...new Set(pageId)].map((page) => (
                  <Suspense fallback={<></>}>
                    <Editor currentPage={page} page={page} />
                  </Suspense>
                ))
              }
            </div>
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

export async function getServerSideProps({ params }) {
  const themeFetch = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/themes.json`)
  const themeFile = await themeFetch.json()
  return {
    props: {
      pageId: params.id,
      themes: themeFile,
    },
  };
}


export const useEditorContext = () => {
  return useContext(EditorContext);
};
