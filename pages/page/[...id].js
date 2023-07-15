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

async function ping() {
  async function getCurrentDateTime(timeZone) {
    const oneHourAgo = new Date();

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

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(oneHourAgo);
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value.padStart(2, '0');
    const day = parts.find(part => part.type === 'day').value.padStart(2, '0');
    const hours = parts.find(part => part.type === 'hour').value.padStart(2, '0');
    const minutes = parts.find(part => part.type === 'minute').value.padStart(2, '0');
    const seconds = parts.find(part => part.type === 'second').value.padStart(2, '0');

    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return timestamp;
  }





  const date = await getCurrentDateTime(pb.authStore.model.time_zone);
  const data = {
    "last_active": date
  };

  const record = await pb.collection('users').update(pb.authStore.model.id, data);
}

function NotionEditor({ pageId }) {
  const [isLoading, setIsLoading] = useState(false);


  if (isLoading) {
    return (<Loader />)
  }
  return (
    <div>
      <div className='main'>
        <MyComponent currPage={pageId} />
        {pageId.map((page) => (
          <Editor page={page} preview='false' />
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
