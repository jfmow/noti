import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfworker.min.js';

export default function MyPdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0); // Default scale is 100% (no zoom)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handleScaleChange(event) {
    const newScale = parseFloat(event.target.value);
    setScale(newScale);
  }

  const pageComponents = Array.from(new Array(numPages), (el, index) => (
    <Page
      key={index}
      pageNumber={index + 1}
      scale={scale}
      className={index === 0 ? 'react-pdf__Page__canvas__first' : index === numPages - 1 ? 'react-pdf__Page__canvas__last' : ''}
    />
  ));

  return (
    <>
      <div>
        <input
          type="range"
          min="0.1"
          max="4"
          step="0.1"
          value={scale}
          onChange={handleScaleChange}
        />
      </div>
      <div style={{ overflow: 'hidden' }}>
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          {pageComponents}
        </Document>
      </div>
    </>
  );
}
