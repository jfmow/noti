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
      async function getCurrentDateTime() {
        const currentDate = new Date();
        const year = currentDate.getUTCFullYear();
        const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getUTCDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const milliseconds = String(currentDate.getUTCMilliseconds()).padStart(3, '0');
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`;
      }
      

      const date = await getCurrentDateTime();
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
