import Loader from '@/components/Loader';
import PocketBase from 'pocketbase'
import { Suspense, lazy } from 'react';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

const Reader = lazy(() => import('../../../components/Reader'));

function NotionEditor({ pageId }) {

  return (
    <div>
      <div className='main'>
        <Suspense fallback={<Loader />}>
          <Reader page={pageId} />
        </Suspense>
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

