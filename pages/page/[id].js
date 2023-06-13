import Loader from '@/components/Loader';
import dynamic from 'next/dynamic';
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react';
import MyComponent from '@/components/Item';
import Link from 'next/link';
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
      } catch (error) {
        pb.authStore.clear();
        return window.location.replace('/auth/login');
      }

    }
    authUpdate()
    console.log('gi')
    const lastActiveInti = setInterval(async () => {
      async function getCurrentDateTime(timeZone) {
        const currentDate = new Date();
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: timeZone
        };
        return currentDate.toLocaleString('en-US', options);
      }
      
      

      const date = await getCurrentDateTime(pb.authStore.model.time_zone);
      const data = {
        "last_active": date
      };

      const record = await pb.collection('users').update(pb.authStore.model.id, data);
      console.log(record)
    }, 450000);
    return () => {
      clearInterval(lastActiveInti);
      console.log('ff')
    };
  }, [])
  if (isLoading) {
    return (<Loader />)
  }
  return (
    <div>
      <div className='main'>

        <MyComponent currPage={pageId} />
        <Editor page={pageId} preview='false' />
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
