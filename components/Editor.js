import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
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
import { AES, enc } from "crypto-js";
import compressImage from "@/lib/CompressImg";
import dynamic from 'next/dynamic';
import Router from "next/router";
import { AnimatePresence } from "framer-motion";
import { AlternateButton, ModalTempLoader } from "@/lib/Modal";
import { createRandomMeshGradients } from "@/lib/randomMeshGradient";
import NestedList from '@editorjs/nested-list';

import MarkerTool from "@/customEditorTools/Marker";
import Image from "@/customEditorTools/Image";
import SimpleTodo from "@/customEditorTools/Todo";
import SimpleIframe from "@/customEditorTools/SimpleEmbed";
import SimpleIframeWebpage from "@/customEditorTools/SimpleIframe";
const Icons = dynamic(() => import("./Icons"), {
  loading: () => <ModalTempLoader />,
  ssr: true,
});
const ModalButton = dynamic(() => import('@/lib/Modal').then((module) => module.ModalButton));
const ModalContainer = dynamic(() => import('@/lib/Modal').then((module) => module.ModalContainer));
const ModalForm = dynamic(() => import('@/lib/Modal').then((module) => module.ModalForm));
const ModalTitle = dynamic(() => import('@/lib/Modal').then((module) => module.ModalTitle));


const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)

function Editor({ page, preview, multi }) {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [editorData, setEditorData] = useState({});
  const [isError, setError] = useState(false);
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
  const [chefKey, setChefKey] = useState("");
  const [importantNote, setImportantNote] = useState(false)

  const pagetitleref = useRef(null)

  useEffect(() => {
    if (preview === "true") {
      return;
    }
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
            console.log("Auto saved successfully!");
          } catch (error) {
            toast.error("Could not auto save!", {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            console.error(error);
          }
          console.log("Auto-save executed.");
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
    window.addEventListener("keydown", typingEventListener);
    //window.addEventListener("mousemove", mouseMovementEventListener);

    // Start the auto-save timer
    timer = setTimeout(() => {
      saveArticle();
    }, 500); // Initial auto-save 3 seconds after component mount

    return () => {
      // Clean up the event listeners and timer on component unmount
      window.removeEventListener("keydown", typingEventListener);
      //window.removeEventListener("mousemove", mouseMovementEventListener);
      clearTimeout(timer);
    };
  }, [lastTypedTime]);

  useEffect(() => {
    if (page) {
      setLastTypedTimeIdle(true);
      setError(false);
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
            const encryptrec = await pb
              .collection("cookies")
              .getOne(pb.authStore.model.meal);
            setChefKey(encryptrec.chef);
            const decryptedNote = AES.decrypt(
              record.content,
              encryptrec.chef
            ).toString(enc.Utf8);
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
            setArticleHeader(null);

          }
          setError(false);
          setIsLoading(false);
        } catch (error) {
          toast.error(
            "Error while loading content"
          );
          console.error(error);
          setError(true);
          setIsLoading(false);
        }
      }

      fetchArticles();
    } else {
      setError(true);
      setIsLoading(false);
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
                      console.log(record);

                    } catch (error) {
                      console.error(error);
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
                      toast.warning('Unable to upload file. It may not be supported yet. Try .pdf or images')
                      return { success: 0 }
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
              },
              currPage: page

            },

          },
          table: Table,
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

  async function handleTitleChange() {
    const title = pagetitleref.current
    setArticleTitle(title.innerText);
    const newTitle = {
      title: title.innerText
    };
    await pb.collection("pages").update(page, newTitle);
    setIsSaving(false);
  }

  async function handleFileChange(e) {
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

  async function handleSetcurrentPageIconValue(e) {
    setCurrentPageIconValue(e.unified)
    const data = {
      icon: e.image,
    };
    //icon.codePointAt(0).toString(16)
    setIconModalState(false);
    await pb.collection("pages").update(page, data);
  }

  async function handleSharePage() {
    if (pageSharedTF) {
      return setShareLinkModalState(true);
    } else {
      const data = {
        shared: true,
      };

      const record = await pb.collection("pages").update(page, data);
      setPageSharedTF(true);
      setShareLinkModalState(true);
      toast.success("Page now public for anyone with the link.");
    }
  }

  async function unSharePage() {
    const data = {
      shared: false,
    };

    const record = await pb.collection("pages").update(page, data);
    setPageSharedTF(false);
    setShareLinkModalState(false);
    toast.success("Page now hidden.");
  }

  function copyToClip() {
    // Create a dummy input element
    var dummyInput = document.createElement("input");
    dummyInput.setAttribute(
      "value",
      `https://noti.jamesmowat.com/page/view/${page}`
    );

    // Append it to the body
    document.body.appendChild(dummyInput);

    // Select and copy the value of the dummy input
    dummyInput.select();
    document.execCommand("copy");

    // Remove the dummy input from the DOM
    document.body.removeChild(dummyInput);

    // Optionally, provide visual feedback to the user
    setShareLinkModalState(false);
  }

  if (isError) {
    return (
      <div>
        <Head>
          <title>Whoops!</title>
          <link rel="favicon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <div className={styles.containererror}>
          <h1>Page not found!</h1>
          <Link href="/">
            <button className={styles.backbutton}>
              <svg
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 1024 1024"
              >
                <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
              </svg>
              <span>Back</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.create}>
      <Head>
        <title>Page: {articleTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="prefetch" href="/64.png" />
      </Head>
      {isSaving && (<AutoSaveLoader />)}
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
                onBlur={handleTitleChange}
              >
                {articleTitle ? articleTitle : "Untitled"}
              </div>
            </div>
            <div className={styles.title_buttons} id="tut_title_btns_id">
              <ImportantNote classname={styles.title_buttons_btn} importt={importantNote} page={page} />
              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>My account settings</div>
                <Link
                  href="/u/me"
                  className={`${styles.title_buttons_btn}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 24 24"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                  >
                    <g>
                      <path d="M0,0h24v24H0V0z" fill="none" />
                    </g>
                    <g>
                      <g>
                        <path d="M10.67,13.02C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V19c0,0.55,0.45,1,1,1 h8.26C10.47,18.87,10,17.49,10,16C10,14.93,10.25,13.93,10.67,13.02z" />
                        <circle cx="10" cy="8" r="4" />
                        <path d="M20.75,16c0-0.22-0.03-0.42-0.06-0.63l0.84-0.73c0.18-0.16,0.22-0.42,0.1-0.63l-0.59-1.02c-0.12-0.21-0.37-0.3-0.59-0.22 l-1.06,0.36c-0.32-0.27-0.68-0.48-1.08-0.63l-0.22-1.09c-0.05-0.23-0.25-0.4-0.49-0.4h-1.18c-0.24,0-0.44,0.17-0.49,0.4 l-0.22,1.09c-0.4,0.15-0.76,0.36-1.08,0.63l-1.06-0.36c-0.23-0.08-0.47,0.02-0.59,0.22l-0.59,1.02c-0.12,0.21-0.08,0.47,0.1,0.63 l0.84,0.73c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-0.84,0.73c-0.18,0.16-0.22,0.42-0.1,0.63l0.59,1.02 c0.12,0.21,0.37,0.3,0.59,0.22l1.06-0.36c0.32,0.27,0.68,0.48,1.08,0.63l0.22,1.09c0.05,0.23,0.25,0.4,0.49,0.4h1.18 c0.24,0,0.44-0.17,0.49-0.4l0.22-1.09c0.4-0.15,0.76-0.36,1.08-0.63l1.06,0.36c0.23,0.08,0.47-0.02,0.59-0.22l0.59-1.02 c0.12-0.21,0.08-0.47-0.1-0.63l-0.84-0.73C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S18.1,18,17,18z" />
                      </g>
                    </g>
                  </svg>
                </Link>
              </div>
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
                      onChange={handleFileChange}
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
                <div className={styles.buttonlabel_label}>Share page</div>
                <button
                  type="button"
                  onClick={handleSharePage}
                  className={styles.title_buttons_btn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><rect fill="none" height="24" width="24" /></g><g><path d="M9,11h6c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H9c-0.55,0-1-0.45-1-1v0C8,11.45,8.45,11,9,11z M20.93,12L20.93,12 c0.62,0,1.07-0.59,0.93-1.19C21.32,8.62,19.35,7,17,7h-3.05C13.43,7,13,7.43,13,7.95v0c0,0.52,0.43,0.95,0.95,0.95H17 c1.45,0,2.67,1,3.01,2.34C20.12,11.68,20.48,12,20.93,12z M3.96,11.38C4.24,9.91,5.62,8.9,7.12,8.9l2.93,0 C10.57,8.9,11,8.47,11,7.95v0C11,7.43,10.57,7,10.05,7L7.22,7c-2.61,0-4.94,1.91-5.19,4.51C1.74,14.49,4.08,17,7,17h3.05 c0.52,0,0.95-0.43,0.95-0.95v0c0-0.52-0.43-0.95-0.95-0.95H7C5.09,15.1,3.58,13.36,3.96,11.38z M18,12L18,12c-0.55,0-1,0.45-1,1v2 h-2c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2v2c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-2h2c0.55,0,1-0.45,1-1v0 c0-0.55-0.45-1-1-1h-2v-2C19,12.45,18.55,12,18,12z" /></g></svg>
                </button>
              </div>

              <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Change page list icon</div>
                <button
                  type="button"
                  onClick={() => setIconModalState(true)}
                  className={styles.title_buttons_btn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><rect fill="none" height="24" width="24" /><path d="M24,4c0,0.55-0.45,1-1,1h-1v1c0,0.55-0.45,1-1,1s-1-0.45-1-1V5h-1c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1h1V2 c0-0.55,0.45-1,1-1s1,0.45,1,1v1h1C23.55,3,24,3.45,24,4z M21.52,8.95C21.83,9.91,22,10.94,22,12c0,5.52-4.48,10-10,10S2,17.52,2,12 C2,6.48,6.48,2,12,2c1.5,0,2.92,0.34,4.2,0.94C16.08,3.27,16,3.62,16,4c0,1.35,0.9,2.5,2.13,2.87C18.5,8.1,19.65,9,21,9 C21.18,9,21.35,8.98,21.52,8.95z M7,9.5C7,10.33,7.67,11,8.5,11S10,10.33,10,9.5S9.33,8,8.5,8S7,8.67,7,9.5z M16.31,14H7.69 c-0.38,0-0.63,0.42-0.44,0.75C8.2,16.39,9.97,17.5,12,17.5s3.8-1.11,4.75-2.75C16.94,14.42,16.7,14,16.31,14z M17,9.5 C17,8.67,16.33,8,15.5,8S14,8.67,14,9.5s0.67,1.5,1.5,1.5S17,10.33,17,9.5z" /></svg>
                </button>
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
      <AnimatePresence>
        {shareLinkModalState && (
          <>
            <ModalContainer events={() => setShareLinkModalState(false)}>
              <ModalForm>
                <ModalTitle>Share page</ModalTitle>
                <div className={styles.shareModal_link_alt_text}>
                  <div className={styles.shareModal_link_text}>
                    https://noti.jamesmowat.com/page/view/{page}

                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    onClick={copyToClip}
                  >
                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-160q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Z" />
                  </svg>
                </div>
                <AlternateButton click={unSharePage}>Hide</AlternateButton>
              </ModalForm>
            </ModalContainer>

          </>
        )}

        {iconModalState && (
          <>
            <Icons Select={handleSetcurrentPageIconValue} Close={() => setIconModalState(false)} Selected={`${currentPageIconValue.toString()}`} />
          </>
        )}
      </AnimatePresence>
      <div className={`${styles.creategrid} ${multi && styles.creategrid_lock}`}>
        <div className={styles.form}>
          <div className={styles.editor} ref={editorRef}></div>
        </div>
      </div>
    </div>
  );
}

export default Editor;


function AutoSaveLoader() {
  return (
    <div className={styles.autosaveloader}></div>
  )
}

//Pin note component

function ImportantNote({ classname, importt, page }) {
  const [checked, setChecked] = useState(importt)
  async function Save(e) {
    console.log(e.target.checked)
    if (checked) {
      const data = {
        "important": false
      };
      setChecked(false)
      await pb.collection('pages').update(page, data);
    } else {
      const data = {
        "important": true
      };
      setChecked(true)
      await pb.collection('pages').update(page, data);
    }
  }
  return (
    <div>
      <label className={styles.abookmark}>
        <input type="checkbox" onChange={(e) => Save(e)} defaultChecked={checked} />
        <div className={styles.bookmark}>
          <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><path d="M19,12.87c0-0.47-0.34-0.85-0.8-0.98C16.93,11.54,16,10.38,16,9V4l1,0 c0.55,0,1-0.45,1-1c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3c0,0.55,0.45,1,1,1l1,0v5c0,1.38-0.93,2.54-2.2,2.89 C5.34,12.02,5,12.4,5,12.87V13c0,0.55,0.45,1,1,1h4.98L11,21c0,0.55,0.45,1,1,1c0.55,0,1-0.45,1-1l-0.02-7H18c0.55,0,1-0.45,1-1 V12.87z" fill-rule="evenodd" /></g></svg>        </div>
      </label>
    </div>
  )
}





