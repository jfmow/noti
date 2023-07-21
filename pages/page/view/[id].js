import Loader from '@/components/Loader';
import dynamic from 'next/dynamic';
import PocketBase from 'pocketbase'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

const Reader = dynamic(() => import('../../../components/Reader'), {
  ssr: false, loading: () => <Loader/>
});

function NotionEditor({ pageId }) {

  return (
    <div>
      <div className='main'>
        <Reader page={pageId}  />
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

