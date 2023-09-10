import dynamic from 'next/dynamic';
import PocketBase from 'pocketbase'
import MyComponent from '@/components/preview/item';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

const Editor = dynamic(() => import('@/components/preview/Editor'), {
    ssr: false,
});

function NotionEditor({ pageId }) {

    return (
        <div>
            <span className='previewarning'>Preview only page. No saving & many functions are disabled.</span>
            <div className='main'>
                <MyComponent currPage={pageId} />
                {pageId.map((page) => (
                    <Editor nosave={true} page={page} preview='false' />
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
