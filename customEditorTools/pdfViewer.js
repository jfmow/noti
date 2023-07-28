import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.js';
export default function MyPdfViewer({url}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const pageComponents = Array.from(new Array(numPages), (el, index) => (
    <Page key={index} pageNumber={index + 1} />
  ));

  return (
    <>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        {pageComponents}
      </Document>
    </>
  );
}