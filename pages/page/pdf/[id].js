import dynamic from 'next/dynamic';
import Router from 'next/router';
import PocketBase from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
const MyPdfViewer = dynamic(() => import('@/customEditorTools/pdfViewer'), {
  ssr: false // Set ssr: false to prevent server-side rendering and enable client-side rendering for this component
});
import { useEffect, useState } from "react";

export default function Viewer({ docId }) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    if (!pb.authStore.isValid) {
      return Router.push('/auth/login')
    }
    async function GetUrl(url3) {
      const fileToken = await pb.files.getToken();
      // retrieve an example protected file url (will be valid ~5min)

      const record = await pb.collection('files').getOne(url3); // Use the fileId to retrieve the record
      const url2 = pb.files.getUrl(record, record.file_data, { 'token': fileToken });
      setUrl(url2)
    }
    GetUrl(docId)
  }, [docId])
  return (
    <MyPdfViewer url={url} />
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      docId: params.id,
    },
  };
}
