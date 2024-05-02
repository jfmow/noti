import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import { debounce } from 'lodash';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfworker.min.js';
export default function MyPdfViewer({ url, fileId }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(3);
  const [pagesToLoad, setPagesToLoad] = useState([1, 2, 3]);
  const [scale, setScale] = useState(1.0); // Default scale is 100% (no zoom)
  const [blurScale, setBlurScale] = useState(1.0)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    // Fetch the number of pages and initialize the first page.
    // You might need to handle errors accordingly.
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => new Blob([buffer]))
      .then(blob => URL.createObjectURL(blob))
      .then(pdfUrl => {
        setNumPages(null); // Reset numPages
        setPageNumber(3); // Reset pageNumber
        setPagesToLoad([1, 2, 3]); // Load initial page
      });

    return () => URL.revokeObjectURL(url);
  }, [url]);

  useEffect(() => {
    let vars = {}
    async function GetThemes() {
      const storedThemes = JSON.parse(window.localStorage.getItem("themes"))
      if (!storedThemes || storedThemes === "" || (Date.now() - storedThemes.updated) > (1000 * 60 * 60 * 24)) {
        const themeFetch = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/themes.json`)
        const themes = await themeFetch.json()
        window.localStorage.setItem("themes", JSON.stringify({ updated: Date.now(), themes: themes }))
        return themes
      } else {
        return storedThemes.themes
      }


    }
    async function applyTheme() {
      const theme = window.localStorage.getItem('theme')
      const themes = await GetThemes()
      if (theme && theme !== 'system') {
        vars = themes.find((item) => item.id === theme)?.data
        const r = document.documentElement.style;
        for (const variable in vars) {
          r.setProperty(variable, vars[variable]);
        }
      }

    }
    applyTheme();

    // Listen for changes in local storage
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        // Theme property has changed, apply the new theme
        const r = document.documentElement.style;
        for (const variable in vars) {
          r.removeProperty(variable);
        }
        applyTheme();
      }
    });
  }, [])

  const containerRef = useRef(null);
  const scaleRef = useRef(1.0);

  const debounceSetScale = debounce((val) => {
    setBlurScale(1)
    setScale(val)
  }, 400)

  function setPageScale(size) {
    setBlurScale(size)
    debounceSetScale(size)
  }

  function handleZoomIn() {
    if (scaleRef.current < 4) {
      scaleRef.current = Math.min(scaleRef.current + 0.1, 4);
      setPageScale(scaleRef.current);
    }
  }

  function handleZoomOut() {
    if (scaleRef.current > 0.1) {
      scaleRef.current = Math.max(scaleRef.current - 0.1, 0.1);
      setPageScale(scaleRef.current);
    }
  }

  function openInNewTab() {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600,left=10,top=10`;
    open(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/pdf/${fileId}`, `PDF Viewer`, params);

  }

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

  const onScroll = () => {
    const container = document.getElementById('pdf-container');
    if (container.scrollHeight - container.scrollTop === container.clientHeight) {
      // Reached bottom of the container, load next pages.
      const nextPage = Math.min(pageNumber + 1, numPages);
      setPagesToLoad([...pagesToLoad, nextPage]);
      setPageNumber(nextPage);
    } else if (container.scrollTop === 0) {
      // Reached top of the container, load previous pages.
      const prevPage = Math.max(pageNumber - 1, 1);
      setPagesToLoad([...pagesToLoad, prevPage]);
      setPageNumber(prevPage);
    }
  };

  return (
    <>
      <div className=" flex fixed bottom-1 left-0 right-0 z-[2] w-full justify-center">
        <div className="px-3 py-2 rounded-lg flex bg-zinc-50 shadow items-center justify-evenly">
          <button aria-label='Zoom in' className="flex items-center border-none bg-none cursor-pointer text-[#292929] p-2 rounded-lg [&>svg]:w-4 [&>svg]:h-4 hover:bg-zinc-200" title='CTRL/CMD + scroll to zoom' onClick={handleZoomIn}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="11" x2="11" y1="8" y2="14" /><line x1="8" x2="14" y1="11" y2="11" /></svg></button>
          <button aria-label='Zoom out' className="flex items-center border-none bg-none cursor-pointer text-[#292929] p-2 rounded-lg [&>svg]:w-4 [&>svg]:h-4 hover:bg-zinc-200" title='CTRL/CMD + scroll to zoom' onClick={handleZoomOut}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-out"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="8" x2="14" y1="11" y2="11" /></svg></button>
          <span className="h-[16px] w-[1px] rounded-lg bg-zinc-200 mx-3" />
          <button aria-label='Open pdf in popout window' className="flex items-center border-none bg-none cursor-pointer text-[#292929] p-2 rounded-lg [&>svg]:w-4 [&>svg]:h-4 hover:bg-zinc-200" onClick={openInNewTab}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-picture-in-picture"><path d="M8 4.5v5H3m-1-6 6 6m13 0v-3c0-1.16-.84-2-2-2h-7m-9 9v2c0 1.05.95 2 2 2h3" /><rect width="10" height="7" x="12" y="13.5" ry="2" /></svg></button>
          <button aria-label='Download pdf' className="flex items-center border-none bg-none cursor-pointer text-[#292929] p-2 rounded-lg [&>svg]:w-4 [&>svg]:h-4 hover:bg-zinc-200" onClick={downloadPDF}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg></button>
        </div>
      </div>
      <div ref={containerRef} id="pdf-container" onScroll={onScroll} style={{ overflow: 'scroll', height: '100vh', display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'center' }}>
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          {pagesToLoad.map((page, index) => (
            <div style={{ transform: `scale(${blurScale})` }}>
              <Page scale={scale} key={index} pageNumber={page} />

            </div>
          ))}
        </Document>
      </div>
    </>
  );
}
