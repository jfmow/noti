import Loader from '@/components/Loader';
import dynamic from 'next/dynamic';
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react';
import MyComponent from '@/components/Item';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

const Editor = dynamic(() => import('../../components/Editor'), {
  ssr: false,
});

function NotionEditor({ pageId }) {
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (<Loader />)
  }

  return (
    <div>
      <div className='main'>
        <MyComponent currPage={pageId} />
        {pageId.map((page) => (
          <Editor page={page} multi={pageId.length > 1 && true} preview='false' />
        ))}
      </div>
    </div>
  );
}

export default NotionEditor;

export async function getServerSideProps({ params }) {
  return {
    props: {
      pageId: params.id,
    },
  };
}

