import Loader from '@/components/Loader';
import dynamic from 'next/dynamic';
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react';
import MyComponent from '@/components/Item';
import Terminal from '@/components/Terminal';
import MenuBar from '@/components/editor/MenuBar';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

const Editor = dynamic(() => import('../../components/editor/Editor'), {
  ssr: false,
});

function NotionEditor({ pageId, themes }) {
  const [isLoading, setIsLoading] = useState(true);
  const [tabBarHidden, setTabBarHidden] = useState(false)
  const [visible, setVisible] = useState(true)
  const [listedPageItems, setListedPageItems] = useState([])



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
    <>
      <Terminal pages={listedPageItems} pb={pb} setListedPageItems={setListedPageItems} />
      <div>
        <div className='main'>
          <MyComponent setListedPageItems={setListedPageItems} listedPageItems={listedPageItems} visible={visible} setVisible={setVisible} currentPage={pageId} />
          <div style={{ flex: '1 1 0%', position: 'relative', display: 'flex', height: '100vh', flexDirection: 'column', overflowX: 'hidden' }}>
            {/*            <TabBar setListedPageItems={setListedPageItems} plVisible={visible} setplVisible={setVisible} pb={pb} page={pageId[0]} />
*/}
            <MenuBar setVisible={setVisible} sideBarVisible={visible} listedPageItems={listedPageItems} setListedPageItems={setListedPageItems} pb={pb} page={pageId[0]} />
            <div style={{ display: 'flex', height: 'calc(100dvh - 45px)', overflow: 'hidden' }}>
              {
                [...new Set(pageId)].map((page) => (
                  <Editor listedPageItems={listedPageItems} setListedPageItems={setListedPageItems} page={page} multi={pageId.length > 1 && true} preview='false' />
                ))
              }

            </div>
          </div>
        </div>
      </div>
    </>
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

