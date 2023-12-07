import { StrictMode, useEffect, useRef, useState } from "react";
import Head from "next/head";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import PocketBase from "pocketbase";
import styles from "@/styles/Create.module.css";
import Video from '@/customEditorTools/Video'
import Loader from "../Loader";
import compressImage from "@/lib/CompressImg";
import Router from "next/router";
import { createRandomMeshGradients } from "@/lib/randomMeshGradient";
import NestedList from '@editorjs/nested-list';
import MarkerTool from "@/customEditorTools/Marker";
import Image from "@/customEditorTools/Image";
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
import LineBreak from "@/customEditorTools/LineBreak";
import { handleCreateBlurHash } from '@/lib/idk'
import MenuButtons from "./Menu/MenuButton";
import { toaster } from "@/components/toast";
import { useEditorContext } from "@/pages/page/[...id]";
import { Paragraph, SubmitButton } from "../UX-Components";
import { Modal } from "@/lib/Modals/Modal";
import { Cache } from "@/lib/Cache";
import { updateListedPages } from "../Item";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)

function Editor({ page }) {
  const { pageId, setListedPageItems, listedPageItems } = useEditorContext()
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [editorData, setEditorData] = useState({});
  const [articleTitle, setArticleTitle] = useState("");
  const [articleHeader, setArticleHeader] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [lastTypedTime, setLastTypedTime] = useState(Date.now());
  const [lastTypedTimeIdle, setLastTypedTimeIdle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [pageSharedTF, setPageSharedTF] = useState(false);
  const [currentPageIconValue, setCurrentPageIconValue] = useState("");
  const [importantNote, setImportantNote] = useState(false)
  const [multiPageModal, setMultiPageModal] = useState({ active: false, records: [] })

  const [offline, setOffline] = useState({ warning: false, state: false })
  const pagetitleref = useRef(null)
  function ResetUseStateVars() {
    if (editorRef.current) {
      if (editor) {
        console.log('a')
        editor.destroy()
      }
    }
    setEditor(null);
    setEditorData({});
    setArticleTitle("");
    setArticleHeader(null);
    setLastTypedTime(Date.now());
    setLastTypedTimeIdle(true);
    setIsSaving(false);
    setPageSharedTF(false);
    setCurrentPageIconValue("");
    setImportantNote(false);
    setOffline({ warning: false, state: false });

  }
  useEffect(() => {
    window.addEventListener('offline', () => {
      setOffline({ ...offline, state: true })
    })
    window.addEventListener('online', () => {
      setOffline({ ...offline, state: false, warning: false })
    })
    return () => {
      window.removeEventListener('online', () => { return })
      window.removeEventListener('offline', () => { return })
    }
  }, [])

  useEffect(() => {
    let timer;

    // Function to save the article after the specified delay
    const saveArticle = async () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastTypedTime;

      if (elapsedTime >= 500 && !lastTypedTimeIdle) {
        // Auto-save 3 seconds after the user stops typing
        setLastTypedTimeIdle(true);
        setIsSaving(true);
        try {
          if (editor) {
            if (offline.state) {
              setOffline({ ...offline, warning: true })
              if (!offline.warning) {
                toaster.toast("Looks like your offline. Your work is currenly unsaved!", "error")
              }
              return
            }
            const articleContent = await editor.save();
            let formData = new FormData();

            formData.append("title", articleTitle);

            formData.append("content", JSON.stringify(articleContent));
            try {
              if (page === "firstopen") {
                formData.append("owner", pb.authStore.model.id);
                const state = await pb.collection("pages").create(formData);
                Cache.set(state.id, JSON.stringify(state))
                return Router.push(`/page/${state.id}`)
              }
              const state = await pb.collection("pages").update(page, formData);
              Cache.set(state.id, JSON.stringify(state))

              //console.log("Auto saved successfully!");
            } catch (error) {
              toaster.toast("Could not auto save!", "error");
              console.error(error);
            }
            //console.log("Auto-save executed.");
          }
          setLastTypedTimeIdle(true);
          setIsSaving(false);
        } catch (error) {
          console.log(error)
          toaster.toast("Could not auto save!", "error")
        }
      }
    };

    // Function to update the last typing timestamp
    const updateLastTypedTime = () => {
      setLastTypedTime(Date.now());
    };

    // Event listener for detecting user typing
    const typingEventListener = () => {
      updateLastTypedTime();
      setLastTypedTimeIdle(false);
    };
    // Attach event listeners
    if (editorRef) {
      try {
        editorRef.current.addEventListener("keyup", typingEventListener);
      } catch { }
    }
    //window.addEventListener("mousemove", mouseMovementEventListener);

    // Start the auto-save timer
    timer = setTimeout(() => {
      saveArticle();
    }, 500); // Initial auto-save 3 seconds after component mount

    return () => {
      // Clean up the event listeners and timer on component unmount
      if (editorRef) {
        try {
          editorRef.current.removeEventListener("keyup", typingEventListener);
        } catch { }
      }
      //window.removeEventListener("mousemove", mouseMovementEventListener);
      clearTimeout(timer);
    };
  }, [lastTypedTime, editorRef.current]);



  useEffect(() => {
    if (page) {
      ResetUseStateVars()
      async function fetchArticles() {
        if (page === "firstopen") {
          setIsLoading(true);
          return;
        }
        try {
          let record = await Cache.get(page)
          if (!record || record.id !== page || new Date(record?.updated) < new Date(listedPageItems.find((Apage) => Apage.id === page)?.updated)) {
            console.log('not from cache')
            record = await pb.collection("pages").getOne(page);
          }
          setEditorData(record.content);
          setIsLoading(false);
          setArticleTitle(record.title);
          setPageSharedTF(record.shared);
          setCurrentPageIconValue(record.icon);
          setImportantNote(record.important)
          if (record.header_img) {
            setArticleHeader(
              `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/pages/${page}/${record.header_img}`
            );
          } else {
            setArticleHeader(record.unsplash);
          }
          Cache.set(record.id, JSON.stringify(record))
        } catch (error) {
          // console.log(error)
          try {
            if (page.length <= 2) {
              setMultiPageModal({ ...multiPageModal, active: true, records: [{ title: 'Title too short', id: 'firstopen' }] })
              setIsLoading(false)
              return
            }
            const records = await pb.collection('pages').getFullList({
              sort: '-created', filter: `title ?~ "${page.toLowerCase()}"`, skipTotal: true
            });
            if (records.length >= 2) {
              setMultiPageModal({ ...multiPageModal, active: true, records: records })
              setIsLoading(false)
              return
            }
            const record = records[0]

            Router.push('/page/' + record.id)
          } catch (err) {
            //console.log(err)
            toaster.error(
              "Unable to find a page with that id"
            );
          }
        }
      }

      fetchArticles();
    }
  }, [page]);

  useEffect(() => {
    if (isSaving) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaving]);

  useEffect(() => {
    //set a colorful header
    const headerbg = createRandomMeshGradients()
    if (document.getElementById('titlebg') && !articleHeader) {
      document.getElementById('titlebg').style.backgroundColor = headerbg.bgColor
      document.getElementById('titlebg').style.backgroundImage = headerbg.bgImage
    }
  }, [document.getElementById('titlebg')])

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = "";
    return "Page currently saving. Are your sure you want to continue";
  };

  useEffect(() => {
    try {
      if (
        editorRef.current &&
        (editorData == null || Object.keys(editorData).length > 0)
      ) {
        const editorInstance = new EditorJS({
          holder: editorRef.current,
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
            },
            marker: {
              class: MarkerTool,
            },
            image: {
              class: Image,
              config: {
                saveData: {
                  saveAll() {
                    setLastTypedTime(Date.now());
                    setLastTypedTimeIdle(false);
                    return
                  }
                },
                storeFile: {
                  uploadFile(file) {
                    async function uploadbyFile(file) {
                      const uploadToast = await toaster.loading("Uploading...")
                      const formData = new FormData();

                      const compressedBlob = await compressImage(file); // Maximum file size in KB (100KB in this example)
                      const compressedFile = new File(
                        [compressedBlob],
                        file.name,
                        { type: "image/jpeg" }
                      );
                      const result = await handleCreateBlurHash(compressedFile);
                      console.log("Result:", result); // Access result.hash, result.width, and result.height

                      formData.append("file_data", compressedFile);
                      formData.append("uploader", pb.authStore.model.id);
                      formData.append('page', page)
                      let record = null
                      try {
                        if (compressedFile.size > 5242880) {
                          toaster.error('File too big. Must be < 5mb')
                          return { success: 0 }
                        }
                        record = await pb.collection("imgs").create(formData);
                        toaster.dismiss(uploadToast)
                        toaster.toast("Image uploaded successfully!", "success")
                      } catch (error) {
                        toaster.dismiss(uploadToast)
                        if (error.data.code === 403) {
                          toaster.toast(error.data.message, "error")
                          return { success: 0 }
                        }
                        toaster.toast('Unable to upload file', "error")
                        return { success: 0 }
                      }

                      return {
                        success: 1,
                        file: {
                          fileId: record.id,
                          blurHashData: result
                        },
                      };
                    }
                    return uploadbyFile(file)
                  },
                },
                currPage: page

              },

            },
            nestedList: {
              class: NestedList,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              },
            },
            CheckList: {
              class: Checklist,
              inlineToolbar: true,
            },
            simpleEmbeds: {
              class: SimpleIframe,
              inlineToolbar: true,
              config: {
                saveData: {
                  saveAll() {
                    setLastTypedTime(Date.now());
                    setLastTypedTimeIdle(false);
                    return
                  }
                },
                storeFile: {
                  uploadFile(file) {
                    async function uploadbyFile(file) {
                      const loadingToast = await toaster.loading("Uploading...")
                      const formData = new FormData();
                      formData.append("file_data", file);
                      formData.append("uploader", pb.authStore.model.id);
                      formData.append('page', page)
                      let record = null
                      try {
                        if (file.size > 5242880) {
                          toast.error('File too big. Must be < 5mb')
                          return { success: 0 }
                        }
                        if (file.name.endsWith(".docx") || file.name.endsWith(".docx/")) {
                          toast.error('File type not supported yet!')
                          return { success: 0 }
                        }
                        record = await pb.collection("files").create(formData);
                        //console.log(record);
                        toaster.dismiss(loadingToast)
                        toaster.toast("File uploaded successfully!", "success")

                      } catch (error) {
                        toaster.dismiss(loadingToast)
                        console.error(error);
                        if (error.data.code === 403) {
                          toaster.toast(error.data.message, "error")
                          return { success: 0 }
                        }
                        toaster.toast('Unable to upload file. It may not be supported yet. Try .pdf or images', "error")
                        return { success: 0 }
                        // Handle error
                      }

                      return {
                        success: 1,
                        file: {
                          recid: record.id,
                        },
                      };
                    }
                    return uploadbyFile(file)
                  },
                }

              }
            },
            table: {
              class: Table,
              inlineToolbar: true,
            },
            SimpleIframeWebpage: {
              class: SimpleIframeWebpage,
            },
            Video: {
              class: Video
            },
            InlineCode: {
              class: InlineCode,
              shortcut: 'CMD+SHIFT+M',
            },


            quote: {
              class: Quote,
              inlineToolbar: true,
            },

            break: {
              class: LineBreak,
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
          },
          data: editorData,
          placeholder: "Enter some text...",
          autofocus: editorData?.blocks?.length >= 1 && (editorData?.blocks[0]?.type === 'image' || editorData?.blocks[0]?.type === 'Video' || editorData?.blocks[0]?.type === 'simpleEmbeds' || editorData?.blocks[0]?.type === 'SimpleIframeWebpage') ? false : true,
        });

        setEditor(editorInstance, () => {
          // Cleanup logic
          if (editor) {
            try {
              editor.destroy();
            } catch (err) {
              console.warn(err);
              toaster.error(`Reloading editor`);
              setIsLoading(true);
              setTimeout(() => {
                window.location.reload();
              }, 1200);
            }
          }
        });
      }
    } catch (error) {
      console.error(error)
      toaster.error(`Editor not ready! Saving may not work.`);
    }
    return () => {
      if (editorRef.current) {
        if (editor) {
          try {
            editor.destroy();
          } catch { }
        }
      }
    }
  }, [editorData, page]);

  async function handlePageTitleChange() {
    const title = pagetitleref.current
    setArticleTitle(title.innerText);
    setListedPageItems(updateListedPages(page, { title: title.innerText }, listedPageItems))
    const newTitle = {
      title: title.innerText
    };
    await pb.collection("pages").update(page, newTitle);
    setIsSaving(false);
  }


  if (isLoading) {
    return <Loader />;
  }

  if (multiPageModal.active) {
    return (
      <>
        <Modal>
          <h1>Multiple pages found!</h1>
          <Paragraph>
            Looks like theres multiple pages with that name. Please select one from the list below to open.
          </Paragraph>
          <div style={{ maxHeight: '190px', overflowY: 'scroll' }}>
            {multiPageModal.records.map((item) => (
              <div onClick={() => {
                setMultiPageModal({ active: false })
                Router.push(`/page/${item.id}`)
              }} style={{ display: 'flex', gap: '7px', alignItems: 'center', cursor: 'pointer' }}>
                <div aria-label='Page icon' style={{ display: 'flex', width: '16px', height: '16px' }}>
                  {item.icon && item.icon.includes('.png') ? (<img className={styles.item_icon} src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}
                </div>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
          <SubmitButton onClick={() => setMultiPageModal({ ...multiPageModal, active: false })}>
            Cancel
          </SubmitButton>
        </Modal>
      </>
    )
  }


  return (
    <div className={styles.create} id="createcon">
      <Head>
        <title>{articleTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={currentPageIconValue ? (`/emoji/twitter/64/${currentPageIconValue}`) : '/Favicon.png'} />

      </Head>

      <div className={styles.title}>
        <div className={styles.title} id="titlebg">
          {articleHeader && <img className={styles.articleTitle_img} src={articleHeader} alt="Page header img" />}
          <div className={styles.headerstuff}>
            <div className={styles.titleeditorcontainer}>
              <div
                className={styles.titleinput}
                contentEditable
                type="text"
                ref={pagetitleref}
                onBlur={handlePageTitleChange}
                id="tuttitle"
                aria-label="Page title"
              >
                {articleTitle ? articleTitle : "Untitled"}
              </div>
            </div>
            <div className={styles.title_buttons} id="tut_title_btns_id">

              <MenuButtons listedPageItems={listedPageItems} setListedPageItems={setListedPageItems} pb={pb} page={page} editor={editor} editorRef={editorRef} articleTitle={articleTitle} clearStates={ResetUseStateVars} currentPageIconValue={currentPageIconValue} setArticleHeader={setArticleHeader} pageSharedTF={pageSharedTF} setCurrentPageIconValue={setCurrentPageIconValue} setPageSharedTF={setPageSharedTF} />

            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.creategrid} ${pageId.length > 1 && styles.creategrid_lock}`}>
        <div className={styles.form}>
          <div className={styles.editor} ref={editorRef} id="content"></div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
