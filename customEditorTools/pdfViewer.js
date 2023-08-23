import React, { useEffect, useState, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfworker.min.js';
import styles from '@/styles/pdfviewer.module.css'
export default function MyPdfViewer({ url, fileId }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0); // Default scale is 100% (no zoom)

  const containerRef = useRef(null);
  const scaleRef = useRef(1.0);
  const ctrlKeyRef = useRef(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handleZoomIn() {
    if (scaleRef.current < 4) {
      scaleRef.current = Math.min(scaleRef.current + 0.1, 4);
      setScale(scaleRef.current);
    }
  }

  function handleZoomOut() {
    if (scaleRef.current > 0.1) {
      scaleRef.current = Math.max(scaleRef.current - 0.1, 0.1);
      setScale(scaleRef.current);
    }
  }


  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheelZoom);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      container.removeEventListener('wheel', handleWheelZoom);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  function handleWheelZoom(event) {
    if (ctrlKeyRef.current) {
      console.log(event)
      event.preventDefault();
      const delta = event.deltaY;
      if (delta < 0 && scaleRef.current < 4) {
        scaleRef.current = Math.min(scaleRef.current + 0.05, 4);
      } else if (delta > 0 && scaleRef.current > 0.1) {
        scaleRef.current = Math.max(scaleRef.current - 0.05, 0.1);
      }
      requestAnimationFrame(() => {
        setScale(scaleRef.current);
      });
    }
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
      ctrlKeyRef.current = true;
    }
  }

  function handleKeyUp(event) {
    if (!event.ctrlKey && !event.metaKey) {
      ctrlKeyRef.current = false;
    }
  }

  function openInNewTab() {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600,left=10,top=10`;
    open(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/pdf/${fileId}`, `SaveMyNotes popup`, params);

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
      <div className={styles.itemcon}>
        <div className={styles.items}>
          <button className={styles.button} title='CTRL/CMD + scroll to zoom' onClick={handleZoomIn}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z" /></svg></button>
          <button className={styles.button} title='CTRL/CMD + scroll to zoom' onClick={handleZoomOut}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z" /></svg></button>
          <span className={styles.itembreak} />
          <button className={styles.button} onClick={openInNewTab}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z"></path></svg></button>
        </div>
      </div>
      <div style={{ overflow: 'scroll', display: 'block' }} ref={containerRef}>
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          {pageComponents}
        </Document>
      </div>
    </>
  );
}
