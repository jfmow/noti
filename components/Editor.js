import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "@/components/Link";
import { toast } from "react-toastify";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import AttachesTool from "@editorjs/attaches";
import PocketBase from "pocketbase";
import styles from "@/styles/Create.module.css";
import Loader from "./Loader";
import compressImage from "@/lib/CompressImg";
import dynamic from 'next/dynamic';
import Router from "next/router";
import { AnimatePresence } from "framer-motion";
import { AlternateButton, CopyPasteTextArea } from "@/lib/Modal";
import { createRandomMeshGradients } from "@/lib/randomMeshGradient";
import NestedList from '@editorjs/nested-list';
import Img from './Img'
import MarkerTool from "@/customEditorTools/Marker";
import Image from "@/customEditorTools/Image";
import SimpleTodo from "@/customEditorTools/Todo";
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
import LineBreak from "@/customEditorTools/LineBreak";
import convertToMarkdown from '@/lib/ConvertToMD'
import { handleBlurHashChange, handleCreateBlurHash } from '@/lib/idk'
import PopCard, { PopCardSubTitle, PopCardTitle } from "@/lib/PopCard";
const Icons = dynamic(() => import("./Icons"), {
  ssr: true,
});
const ColorSelector = dynamic(() => import("./ColorSelector"), {
  ssr: true,
});
const ModalContainer = dynamic(() => import('@/lib/Modal').then((module) => module.ModalContainer));
const ModalForm = dynamic(() => import('@/lib/Modal').then((module) => module.ModalForm));
const ModalTitle = dynamic(() => import('@/lib/Modal').then((module) => module.ModalTitle));


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
  const [shareLinkModalState, setShareLinkModalState] = useState(false);
  const [iconModalState, setIconModalState] = useState(false);
  const [currentPageIconValue, setCurrentPageIconValue] = useState("");
  const [importantNote, setImportantNote] = useState(false)

  const [ColorSelectorState, setColorSelectorState] = useState(false)

  const [convertedMdData, setConvertedData] = useState('')

  const [convertModalState, setShowConvert] = useState(false)

  const [offline, setOffline] = useState({ warning: false, state: false })
  const pagetitleref = useRef(null)

  const [unsplashPicker, setUnsplashPicker] = useState(false)

  const [popUpClickEvent, setpopUpClickEvent] = useState(null)

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
      setLastTypedTimeIdle(true);
      setIsLoading(true);
      setIsSaving(false)
      setEditorData(null)
      setArticleTitle('Untitled')
      setArticleHeader(null)
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
          SimpleIframeWebpage: {
            class: SimpleIframeWebpage,

          },
          nestedList: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            },
          },
          SimpleTodo: {
            class: SimpleTodo,
            config: {
              saveData: {
                saveAll() {
                  setLastTypedTime(Date.now());
                  setLastTypedTimeIdle(false);
                  return
                }
              },
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
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
          table: {
            class: Table,
            inlineToolbar: true,
          },
          break: {
            class: LineBreak,
          }
        },
        data: editorData,
        placeholder: "Enter some text...",
        autofocus: true
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

  async function handleDeletePage() {
    await pb.collection("pages").delete(page);
    await editor.clear()
    setEditorData(null)
    setArticleHeader(null)
    setArticleTitle(null)
    editorRef.current = null
    Router.push('/page/firstopen')
  }

  async function handlePageTitleChange() {
    const title = pagetitleref.current
    setArticleTitle(title.innerText);
    const newTitle = {
      title: title.innerText
    };
    await pb.collection("pages").update(page, newTitle);
    setIsSaving(false);
  }

  async function handlePageHeaderImageUpload(e) {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      setArticleHeader(event.target.result);
    };
    reader.readAsDataURL(file);
    let formData = new FormData();
    if (file) {
      const compressidToast = toast.loading("Compressing image...");
      try {
        const compressedBlob = await compressImage(file, 200); // Maximum file size in KB (100KB in this example)
        const compressedFile = new File([compressedBlob], file.name, {
          type: "image/jpeg",
        });
        formData.append("header_img", compressedFile);
        formData.append("unsplash", '');
        toast.update(compressidToast, {
          render: "Done 👍",
          type: "success",
          isLoading: false,
        });
        //if (compressedFile.size > 4547000) {
        //    return toast.error('Compresed file may be too big (>4.5mb)!')
        //}
        await pb.collection("pages").update(page, formData);

      } catch (error) {
        toast.error("Error uploading header img", {
          position: toast.POSITION.TOP_LEFT,
        });
      }
      toast.done(compressidToast);
    }
  }

  async function handlePageDisplayIconChange(e) {
    setCurrentPageIconValue(`${e.unified}.png`)
    const data = {
      icon: e.image,
    };
    //icon.codePointAt(0).toString(16)
    setIconModalState(false);
    await pb.collection("pages").update(page, data);
  }

  async function handleSharePage() {
    const data = {
      shared: !pageSharedTF,
    };
    setPageSharedTF(!pageSharedTF);
    const record = await pb.collection("pages").update(page, data);
  }

  function handleCopyTextToClipboard(data) {
    var dummyInput = document.createElement("div");

    dummyInput.innerText = `${data}`;


    // Append it to the body
    document.body.appendChild(dummyInput);

    // Select and copy the value of the dummy input
    var range = document.createRange();
    range.selectNode(dummyInput);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");

    // Remove the dummy input from the DOM
    document.body.removeChild(dummyInput);

    // Optionally, provide visual feedback to the user
    setShareLinkModalState(false);
  }

  async function handleChangePageListDisplayColor(color, page) {
    const data = {
      "color": color
    };

    await pb.collection('pages').update(page, data);
  }

  async function handleExportPageToMarkdown() {

    const data = await editor.save()
    try {
      setShowConvert(true)
      setConvertedData('')

      const md = await convertToMarkdown(data, articleTitle, pb.authStore.token)

      setConvertedData(md)
    } catch (err) {
      console.log(err)
      return toast.error(err)
    }

  }

  if (isLoading) {
    return <Loader />;
  }


  return (
    <div className={styles.create}>
      <Head>
        <title>{articleTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={currentPageIconValue ? (`/emoji/twitter/64/${currentPageIconValue}`) : '/Favicon.png'} />
        <link rel="prefetch" href="/64.png" />

      </Head>

      <div className={styles.title}>
        <div className={styles.title} id="titlebg">
          {articleHeader && <img src={articleHeader} alt="Page header img" />}
          <div className={styles.headerstuff}>
            <div className={styles.titleeditorcontainer}>
              <div
                className={styles.titleinput}
                contentEditable
                type="text"
                ref={pagetitleref}
                onBlur={handlePageTitleChange}
                id="tuttitle"
              >
                {articleTitle ? articleTitle : "Untitled"}
              </div>
            </div>
            <div className={styles.title_buttons} id="tut_title_btns_id">

              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Set page header image</div>
                <div className={`${styles.title_buttons_btn}`}>
                  <label className={styles.customfileupload} >
                    <input
                      type="file"
                      name="file"
                      id="fileInput"
                      accept="image/*"
                      className={styles.finput}
                      onChange={handlePageHeaderImageUpload}
                    />
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z" />
                      </svg>
                    </span>
                  </label>
                </div>
              </div>

              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Unsplash images</div>
                <button
                  type="button"
                  onClick={() => setUnsplashPicker(true)}
                  className={styles.title_buttons_btn}
                >
                  <svg width="24" height="24" viewBox="0 0 32 32" version="1.1" aria-labelledby="unsplash-home" aria-hidden="false"><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg>
                </button>
              </div>

              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Share page</div>
                <button
                  type="button"
                  onClick={() => setShareLinkModalState(true)}
                  className={styles.title_buttons_btn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><rect fill="none" height="24" width="24" /></g><g><path d="M9,11h6c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H9c-0.55,0-1-0.45-1-1v0C8,11.45,8.45,11,9,11z M20.93,12L20.93,12 c0.62,0,1.07-0.59,0.93-1.19C21.32,8.62,19.35,7,17,7h-3.05C13.43,7,13,7.43,13,7.95v0c0,0.52,0.43,0.95,0.95,0.95H17 c1.45,0,2.67,1,3.01,2.34C20.12,11.68,20.48,12,20.93,12z M3.96,11.38C4.24,9.91,5.62,8.9,7.12,8.9l2.93,0 C10.57,8.9,11,8.47,11,7.95v0C11,7.43,10.57,7,10.05,7L7.22,7c-2.61,0-4.94,1.91-5.19,4.51C1.74,14.49,4.08,17,7,17h3.05 c0.52,0,0.95-0.43,0.95-0.95v0c0-0.52-0.43-0.95-0.95-0.95H7C5.09,15.1,3.58,13.36,3.96,11.38z M18,12L18,12c-0.55,0-1,0.45-1,1v2 h-2c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2v2c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-2h2c0.55,0,1-0.45,1-1v0 c0-0.55-0.45-1-1-1h-2v-2C19,12.45,18.55,12,18,12z" /></g></svg>
                </button>
              </div>
              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Export to md</div>
                <button
                  type="button"
                  onClick={handleExportPageToMarkdown}
                  className={styles.title_buttons_btn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="M475,64H37C16.58,64,0,81.38,0,102.77V409.19C0,430.59,16.58,448,37,448H475c20.38,0,37-17.41,37-38.81V102.77C512,81.38,495.42,64,475,64ZM288,368H224V256l-48,64-48-64V368H64V144h64l48,80,48-80h64Zm96,0L304,256h48.05L352,144h64V256h48Z" /></svg>
                </button>
              </div>

              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Page Icon</div>
                <button
                  type="button"
                  onClick={() => setIconModalState(true)}
                  className={styles.title_buttons_btn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><rect fill="none" height="24" width="24" /><path d="M24,4c0,0.55-0.45,1-1,1h-1v1c0,0.55-0.45,1-1,1s-1-0.45-1-1V5h-1c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1h1V2 c0-0.55,0.45-1,1-1s1,0.45,1,1v1h1C23.55,3,24,3.45,24,4z M21.52,8.95C21.83,9.91,22,10.94,22,12c0,5.52-4.48,10-10,10S2,17.52,2,12 C2,6.48,6.48,2,12,2c1.5,0,2.92,0.34,4.2,0.94C16.08,3.27,16,3.62,16,4c0,1.35,0.9,2.5,2.13,2.87C18.5,8.1,19.65,9,21,9 C21.18,9,21.35,8.98,21.52,8.95z M7,9.5C7,10.33,7.67,11,8.5,11S10,10.33,10,9.5S9.33,8,8.5,8S7,8.67,7,9.5z M16.31,14H7.69 c-0.38,0-0.63,0.42-0.44,0.75C8.2,16.39,9.97,17.5,12,17.5s3.8-1.11,4.75-2.75C16.94,14.42,16.7,14,16.31,14z M17,9.5 C17,8.67,16.33,8,15.5,8S14,8.67,14,9.5s0.67,1.5,1.5,1.5S17,10.33,17,9.5z" /></svg>
                </button>
              </div>
              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Page Popup</div>
                <button
                  type="button"
                  onClick={(e) => setpopUpClickEvent(e)}
                  className={styles.title_buttons_btn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><rect fill="none" height="24" width="24" /><path d="M24,4c0,0.55-0.45,1-1,1h-1v1c0,0.55-0.45,1-1,1s-1-0.45-1-1V5h-1c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1h1V2 c0-0.55,0.45-1,1-1s1,0.45,1,1v1h1C23.55,3,24,3.45,24,4z M21.52,8.95C21.83,9.91,22,10.94,22,12c0,5.52-4.48,10-10,10S2,17.52,2,12 C2,6.48,6.48,2,12,2c1.5,0,2.92,0.34,4.2,0.94C16.08,3.27,16,3.62,16,4c0,1.35,0.9,2.5,2.13,2.87C18.5,8.1,19.65,9,21,9 C21.18,9,21.35,8.98,21.52,8.95z M7,9.5C7,10.33,7.67,11,8.5,11S10,10.33,10,9.5S9.33,8,8.5,8S7,8.67,7,9.5z M16.31,14H7.69 c-0.38,0-0.63,0.42-0.44,0.75C8.2,16.39,9.97,17.5,12,17.5s3.8-1.11,4.75-2.75C16.94,14.42,16.7,14,16.31,14z M17,9.5 C17,8.67,16.33,8,15.5,8S14,8.67,14,9.5s0.67,1.5,1.5,1.5S17,10.33,17,9.5z" /></svg>
                </button>
                <PopCard event={popUpClickEvent} className={styles.title_buttons_btn}>
                  <PopCardTitle>Test popup</PopCardTitle>
                  <PopCardSubTitle>Choose what you want to be notified about.</PopCardSubTitle>
                  <Img setArticleHeader={setArticleHeader} page={page} close={() => setUnsplashPicker(false)} />

                </PopCard>
              </div>

              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>List Color</div>
                <button
                  type="button"
                  onClick={() => setColorSelectorState(true)}
                  className={styles.title_buttons_btn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><rect fill="none" height="24" width="24" /></g><g><path d="M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10c1.38,0,2.5-1.12,2.5-2.5c0-0.61-0.23-1.2-0.64-1.67c-0.08-0.1-0.13-0.21-0.13-0.33 c0-0.28,0.22-0.5,0.5-0.5H16c3.31,0,6-2.69,6-6C22,6.04,17.51,2,12,2z M17.5,13c-0.83,0-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5 s1.5,0.67,1.5,1.5C19,12.33,18.33,13,17.5,13z M14.5,9C13.67,9,13,8.33,13,7.5C13,6.67,13.67,6,14.5,6S16,6.67,16,7.5 C16,8.33,15.33,9,14.5,9z M5,11.5C5,10.67,5.67,10,6.5,10S8,10.67,8,11.5C8,12.33,7.33,13,6.5,13S5,12.33,5,11.5z M11,7.5 C11,8.33,10.33,9,9.5,9S8,8.33,8,7.5C8,6.67,8.67,6,9.5,6S11,6.67,11,7.5z" /></g></svg>                </button>
              </div>

              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Delete page</div>
                <button
                  type="button"
                  onClick={handleDeletePage}
                  className={styles.title_buttons_btn}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      {ColorSelectorState && (
        <ColorSelector onSelectColor={handleChangePageListDisplayColor} page={page} close={() => setColorSelectorState(false)} />
      )}
      <AnimatePresence>
        {shareLinkModalState && (
          <>
            <ModalContainer events={() => setShareLinkModalState(false)}>
              <ModalForm>
                <ModalTitle>Share page</ModalTitle>
                <CopyPasteTextArea click={() => handleCopyTextToClipboard(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/view/${page}`)}>
                  {process.env.NEXT_PUBLIC_CURRENTURL}/page/view/{page}
                </CopyPasteTextArea>
                <AlternateButton click={handleSharePage}>
                  {pageSharedTF ? 'Hide' : 'Make public'}
                </AlternateButton>
              </ModalForm>
            </ModalContainer>

          </>
        )}

        {iconModalState && (
          <>
            <Icons Select={handlePageDisplayIconChange} Close={() => setIconModalState(false)} Selected={`${currentPageIconValue.toString()}`} />
          </>
        )}
        {convertModalState && (
          <ModalContainer events={() => setShowConvert(false)}>
            <ModalForm>
              <ModalTitle>Converted MD</ModalTitle>
              <p>Embeds of file/pages will not show up. <strong>Images will show up as base64 so do not be alarmed by the big random text</strong></p>
              {convertedMdData === '' ? (
                <div className={styles.loaderLong_con}>
                  <div className={styles.loaderLong}></div>
                </div>
              ) : (
                <textarea onChange={() => { return }} style={{ height: '20vh', background: 'var(--modal_button_bg)', border: '2px solid var(--modal_button_border)', borderRadius: '10px', fontFamily: 'auto', padding: '1em', overflowX: 'hidden', overflowY: 'scroll', color: 'var(--modal_button_text)' }} value={convertedMdData} />

              )}

              <AlternateButton click={() => handleCopyTextToClipboard(convertedMdData)}>Copy MD</AlternateButton>
            </ModalForm>
          </ModalContainer>
        )}
      </AnimatePresence>
      <div className={`${styles.creategrid} ${multi && styles.creategrid_lock}`}>
        <div className={styles.form}>
          <div className={styles.editor} ref={editorRef} id="content"></div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
