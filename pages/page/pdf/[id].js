import PocketBase from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
import { Suspense, lazy, useEffect, useState } from "react";
const MyPdfViewer = lazy(() => import('@/customEditorTools/pdfViewer'));
export default function Viewer({ docId }) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    async function GetUrl(url3) {
      const record = await pb.collection('files').getOne(url3, { expand: 'page' }); // Use the fileId to retrieve the record
      if (!record.expand.page.shared) {
        const fileToken = await pb.files.getToken();
        const url2 = pb.files.getUrl(record, record.file_data, { 'token': fileToken });
        setUrl(url2)
      } else {
        const url2 = pb.files.getUrl(record, record.file_data);
        setUrl(url2)
      }
    }
    GetUrl(docId)
  }, [docId])
  return (
    <Suspense fallback={<div>Loading pdf viewer...</div>}>
      <MyPdfViewer url={url} fileId={docId} />

    </Suspense>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      docId: params.id,
    },
  };
}
