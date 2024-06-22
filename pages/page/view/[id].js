import Loader from '@/components/Loader';
import EnableWebsiteThemes from '@/lib/Themes';
import { Suspense, lazy, useEffect } from 'react';

const Reader = lazy(() => import('../../../components/editor/View-only/Reader'));

function NotionEditor({ pageId }) {

  useEffect(() => {
    EnableWebsiteThemes()
  }, [])

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

