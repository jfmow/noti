



function BulkManagment({ CloseAcc }) {
    const [pages, setPagesList] = useState([])
    const [seletedPages, setSelectedPages] = useState([])
    const [showWarn, setShowWarning] = useState(false)
    const [reallyConfirm, setConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false)
    useEffect(() => {
  
      async function getPagesList() {
        const records = await pb.collection('pages_Bare').getFullList({
          sort: '-updated',
        });
        setPagesList(records)
      }
      getPagesList()
    }, [])
  
    function setSelected(page) {
      if (seletedPages.includes(page)) {
        setSelectedPages(seletedPages.filter(pages => pages != page))
      } else if (!seletedPages) {
        setSelectedPages(page);
      } else {
        setSelectedPages(prevPages => [...prevPages, page]);
      }
    }
  
    function DeleteWarning() {
      if (seletedPages.length === 0) {
        return
      }
      setShowWarning(true)
      setConfirm(false)
    }
  
    async function DeleteSelected() {
      if (!reallyConfirm || seletedPages.length === 0) {
        return;
      }
  
      setShowWarning(false);
      setConfirm(false);
      setDeleting(true);
  
      for (const page of seletedPages) {
        await pb.collection('pages').delete(page);
        console.log(page);
  
        // Remove the deleted page from the state
        setPagesList(prevPages => prevPages.filter(p => p.id !== page));
      }
    }
  
    return (
      <>
        <Head>
          <title>Bluk managment</title>
        </Head>
        <ModalContainer events={CloseAcc}>
          <ModalForm>
            <ModalTitle>Manage your pages</ModalTitle>
            <h3>Total pages: {pages.length <= 0 ? ('Loading...') : (pages.length)}</h3>
  
  
            <div className={blukstyles.page_align_center}>
              {seletedPages.length > 0 && (
                <ModalButton classnm={blukstyles.fixeddeletebtn} events={DeleteWarning}>Delete selected pages</ModalButton>
              )}
              <div className={blukstyles.pages}>
                {pages.length <= 0 ? (
                  <>
                    <div className={`${blukstyles.page}  `}>
                      <span className={blukstyles.page_title}>Loading...</span>
                      <span>📄</span>
                    </div>
                    <div className={`${blukstyles.page}  `}>
                      <span className={blukstyles.page_title}>Loading...</span>
                      <span>📄</span>
                    </div>
                    <div className={`${blukstyles.page}  `}>
                      <span className={blukstyles.page_title}>Loading...</span>
                      <span>📄</span>
                    </div>
                    <div className={`${blukstyles.page}  `}>
                      <span className={blukstyles.page_title}>Loading...</span>
                      <span>📄</span>
                    </div>
  
                  </>
                ) : (
                  <>
                    {pages.map((page) => (
                      <div onClick={() => (setSelected(page.id))} key={page.id} className={`${blukstyles.page} ${(deleting && seletedPages.includes(page.id)) && blukstyles.deletingpage} ${seletedPages.includes(page.id) && blukstyles.selected}`}>
                        <span className={blukstyles.page_title}>{page.title || `Untitled ${page.id}`}</span>
                        <span className={blukstyles.page_icon}>{page.icon && page.icon.includes('.png') ? (<img className={blukstyles.page_icon} src={`/emoji/twitter/64/${page.icon}`} />) : (!isNaN(parseInt(page.icon, 16)) && String.fromCodePoint(parseInt(page.icon, 16)))}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            {showWarn && (
              <>
                <ModalContainer events={() => setShowWarning(false)}>
                  <ModalForm>
                    <ModalTitle>
                      Warning
                    </ModalTitle>
                    <p>This action cannot be undone! By continuing you will delete {seletedPages.length} pages.</p>
                    <ModalCheckBox chngevent={() => setConfirm(true)}>Confirm</ModalCheckBox>
                    <ModalButton events={DeleteSelected}>Delete</ModalButton>
                  </ModalForm>
                </ModalContainer>
              </>
            )}
          </ModalForm>
        </ModalContainer>
      </>
    )
  }