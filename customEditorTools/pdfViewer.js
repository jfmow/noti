import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfworker.min.js';
export default function MyPdfViewer({url}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const pageComponents = Array.from(new Array(numPages), (el, index) => (
    <Page  key={index} pageNumber={index + 1} className={index == 0 ? 'react-pdf__Page__canvas__first' : '' + index == numPages - 1 ? 'react-pdf__Page__canvas__last' : ''} />
  ));

  return (
    <>
      <Document  file={url} onLoadSuccess={onDocumentLoadSuccess}>
        {pageComponents}
      </Document>
    </>
  );
}