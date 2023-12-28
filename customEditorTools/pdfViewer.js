import React, { useEffect, useState, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfworker.min.js';
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
    return () => {
      container.removeEventListener('wheel', handleWheelZoom);
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

  async function downloadPDF() { // Replace this with the actual file ID
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf', // Set the content type to indicate that you expect a PDF response
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `file-${self.crypto.randomUUID()}.pdf`; // Specify the name for the downloaded file
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF', error);
    }
  }


  return (
    <>
      <div className="flex fixed bottom-1 left-0 right-0 z-[2] w-full justify-center">
        <div className="px-3 py-2 rounded-lg flex bg-slate-50 shadow items-center justify-evenly">
          <button aria-label='Zoom in' className="flex items-center border-none bg-none cursor-pointer text-[#292929] p-2 rounded-lg [&>svg]:w-4 [&>svg]:h-4 hover:bg-slate-200" title='CTRL/CMD + scroll to zoom' onClick={handleZoomIn}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="11" x2="11" y1="8" y2="14" /><line x1="8" x2="14" y1="11" y2="11" /></svg></button>
          <button aria-label='Zoom out' className="flex items-center border-none bg-none cursor-pointer text-[#292929] p-2 rounded-lg [&>svg]:w-4 [&>svg]:h-4 hover:bg-slate-200" title='CTRL/CMD + scroll to zoom' onClick={handleZoomOut}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-out"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="8" x2="14" y1="11" y2="11" /></svg></button>
          <span className="h-[16px] w-[1px] rounded-lg bg-slate-200 mx-3" />
          <button aria-label='Open pdf in popout window' className="flex items-center border-none bg-none cursor-pointer text-[#292929] p-2 rounded-lg [&>svg]:w-4 [&>svg]:h-4 hover:bg-slate-200" onClick={openInNewTab}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-picture-in-picture"><path d="M8 4.5v5H3m-1-6 6 6m13 0v-3c0-1.16-.84-2-2-2h-7m-9 9v2c0 1.05.95 2 2 2h3" /><rect width="10" height="7" x="12" y="13.5" ry="2" /></svg></button>
          <button aria-label='Download pdf' className="flex items-center border-none bg-none cursor-pointer text-[#292929] p-2 rounded-lg [&>svg]:w-4 [&>svg]:h-4 hover:bg-slate-200" onClick={downloadPDF}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg></button>
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
