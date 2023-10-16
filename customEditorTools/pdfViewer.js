import React, { useEffect, useState, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfworker.min.js';
import styles from '@/styles/pdfviewer.module.css'
import { debounce } from 'lodash';
export default function MyPdfViewer({ url, fileId }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0); // Default scale is 100% (no zoom)

  useEffect(() => {
    function scrollZoom(e) {
      //console.log(e.deltaY, e.deltaX, e.wheelDelta, e.wheelDeltaY)
      if (e.deltaX > 0 || e.deltaX < 0) {
        return
      } else {
        if (e.deltaY >= 0.5 && e.wheelDeltaY <= -150 && e.wheelDelta <= -150) {
          e.preventDefault();
          handleZoomOut('small');
        } else if (e.deltaY <= -0.5 && e.wheelDeltaY >= 150 && e.wheelDelta >= 150) {
          e.preventDefault();
          handleZoomIn('small');
        } else {
          return
        }
      }
    }

    window.document.querySelector(".react-pdf__Document").addEventListener('wheel', (e) => scrollZoom(e), { passive: false })
    return () => {
      window.document.querySelector(".react-pdf__Document").removeEventListener('wheel', (e) => scrollZoom(e), { passive: false })
    }
  }, [])

  const containerRef = useRef(null);
  const scaleRef = useRef(1.0);
  const ctrlKeyRef = useRef(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handleZoomIn(type) {
    if (scaleRef.current < 4) {
      if (type === 'small') {
        scaleRef.current = Math.min(scaleRef.current + 0.01, 4);
        setScale(scaleRef.current);
        return
      }
      scaleRef.current = Math.min(scaleRef.current + 0.1, 4);
      setScale(scaleRef.current);
    }
  }

  function handleZoomOut(type) {
    if (scaleRef.current > 0.1) {
      if (type === 'small') {
        scaleRef.current = Math.min(scaleRef.current - 0.01, 4);
        setScale(scaleRef.current);
        return
      }
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
          <button aria-label='Zoom in' className={styles.button} title='CTRL/CMD + scroll to zoom' onClick={handleZoomIn}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="11" x2="11" y1="8" y2="14" /><line x1="8" x2="14" y1="11" y2="11" /></svg></button>
          <button aria-label='Zoom out' className={styles.button} title='CTRL/CMD + scroll to zoom' onClick={handleZoomOut}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-out"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="8" x2="14" y1="11" y2="11" /></svg></button>
          <span className={styles.itembreak} />
          <button aria-label='Open pdf in popout window' className={styles.button} onClick={openInNewTab}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-picture-in-picture"><path d="M8 4.5v5H3m-1-6 6 6m13 0v-3c0-1.16-.84-2-2-2h-7m-9 9v2c0 1.05.95 2 2 2h3" /><rect width="10" height="7" x="12" y="13.5" ry="2" /></svg></button>
        </div>
      </div>
      <div style={{ overflow: 'scroll', display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'center' }} ref={containerRef}>
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          {pageComponents}
        </Document>
      </div>
    </>
  );
}
