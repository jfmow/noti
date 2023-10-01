import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "@/components/Link";
import { toast } from "react-toastify";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import AttachesTool from "@editorjs/attaches";
import PocketBase from "pocketbase";
import styles from "@/styles/Create.module.css";
import Loader from "../Loader";
import compressImage from "@/lib/CompressImg";
import dynamic from 'next/dynamic';
import Router from "next/router";
import { AnimatePresence } from "framer-motion";
import { AlternateButton, CopyPasteTextArea } from "@/lib/Modal";
import { createRandomMeshGradients } from "@/lib/randomMeshGradient";
import NestedList from '@editorjs/nested-list';
import MarkerTool from "@/customEditorTools/Marker";
import Image from "@/customEditorTools/Image";
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
import LineBreak from "@/customEditorTools/LineBreak";
import { handleBlurHashChange, handleCreateBlurHash } from '@/lib/idk'
import MenuButtons from "./Menu/MenuButton";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)

function Editor({ page, multi }) {
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

  const [offline, setOffline] = useState({ warning: false, state: false })
  const pagetitleref = useRef(null)
  function ResetUseStateVars() {
    setEditor(null);
    setEditorData({});
    setArticleTitle("");
    setArticleHeader(null);
    setIsLoading(true);
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
        if (editor) {
          if (offline.state) {
            setOffline({ ...offline, warning: true })
            if (!offline.warning) {
              toast.error("Looks like your offline. Your work is currenly unsaved!")
            }
            return
          }
          const articleContent = await editor.saver.save();
          let formData = new FormData();

          formData.append("title", articleTitle);
          // Encrypt the note content
          // Replace with the user's encryption key

          //const encryptedNote = AES.encrypt(
          //  JSON.stringify(articleContent),
          //  chefKey
          //).toString();

          // Decrypt the note content


          formData.append("content", JSON.stringify(articleContent));
          try {
            if (page === "firstopen") {
              formData.append("owner", pb.authStore.model.id);
              const state = await pb.collection("pages").create(formData);
              return Router.push(`/page/${state.id}`)
            }
            const state = await pb.collection("pages").update(page, formData);
            //console.log("Auto saved successfully!");
          } catch (error) {
            toast.error("Could not auto save!", {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            console.error(error);
          }
          //console.log("Auto-save executed.");
        }
        setLastTypedTimeIdle(true);
        setIsSaving(false);
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

    // Event listener for detecting mouse movement
    //const mouseMovementEventListener = () => {
    //  updateLastTypedTime();
    //};

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

          if (localStorage.getItem('Offlinetime') === 'true') {
            try {
              setEditorData(JSON.parse(localStorage.getItem('Offlinesave')));
              const data = {
                "content": localStorage.getItem('Offlinesave'),
                "owner": pb.authStore.model.id,
                "title": `Migrated offline page ${Date.now()}`
              }
              pb.autoCancellation(true)

              const state = await pb.collection("pages").create(data);
              Router.push(`/page/${state.id}`)
              localStorage.setItem('Offlinetime', 'false')
              localStorage.removeItem('Offlinesave');
            } catch (err) {
              console.error(err)
            }
          }
          setIsLoading(false);
          return;
        }

        try {
          const record = await pb.collection("pages").getOne(page);
          //encryption
          try {
            setEditorData(JSON.parse(decryptedNote));
            //toast.info("Note no longer encrypted on server.")
          } catch (error) {
            console.warn(error);
            setEditorData(record.content);
          }

          //rest of unencrypt data
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
          setIsLoading(false);
        } catch (error) {
          toast.error(
            "Error while loading content"
          );
          console.error(error);
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
                        toast.error('File too big. Must be < 5mb')
                        return { success: 0 }
                      }
                      record = await pb.collection("imgs").create(formData);

                    } catch (error) {
                      if (error.data.code === 403) {
                        toast.error(error.data.message)
                        return { success: 0 }
                      }
                      toast.warning('Unable to upload file. It may not be supported yet. Try .pdf or images')
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

                    } catch (error) {
                      console.error(error);
                      if (error.data.code === 403) {
                        toast.error(error.data.message)
                        return { success: 0 }
                      }
                      toast.warning('Unable to upload file. It may not be supported yet. Try .pdf or images')
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
          InlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+M',
          },


          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          attaches: {
            class: AttachesTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  async function upload(file) {
                    const formData = new FormData();
                    formData.append("file_data", file);
                    formData.append("uploader", pb.authStore.model.id);
                    const response = await toast.promise(
                      pb.collection("files").create(formData),
                      {
                        pending: "Saving img...",
                        success: "Saved successfully. 📁",
                        error: "Failed 🤯",
                      }
                    );
                    function getFileExtension(file) {
                      const filename = file.name;
                      const extension = filename.split(".").pop();
                      return extension;
                    }
                    const extension = getFileExtension(file);
                    return {
                      success: 1,
                      file: {
                        extension: extension,
                        url: `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/files/${response.id}/${response.file_data}`,
                      },
                    };
                  }
                  return upload(file);
                },
              },
            },
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
        autofocus: true,
      });

      setEditor(editorInstance, () => {
        // Cleanup logic
        if (editor) {
          try {
            editor.destroy();
          } catch (err) {
            console.warn(err);
            toast.error(`Reloading editor`);
            setIsLoading(true);
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          }
        }
      });
    }
  }, [editorData, page]);

  async function handlePageTitleChange() {
    const title = pagetitleref.current
    setArticleTitle(title.innerText);
    const newTitle = {
      title: title.innerText
    };
    await pb.collection("pages").update(page, newTitle);
    setIsSaving(false);
  }


  if (isLoading) {
    return <Loader />;
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

              <MenuButtons pb={pb} page={page} editor={editor} editorRef={editorRef} articleTitle={articleTitle} clearStates={ResetUseStateVars} currentPageIconValue={currentPageIconValue} setArticleHeader={setArticleHeader} pageSharedTF={pageSharedTF} setCurrentPageIconValue={setCurrentPageIconValue} setPageSharedTF={setPageSharedTF} />

            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.creategrid} ${multi && styles.creategrid_lock}`}>
        <div className={styles.form}>
          <div className={styles.editor} ref={editorRef} id="content"></div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
