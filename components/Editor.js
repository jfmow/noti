import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import AttachesTool from "@editorjs/attaches";
import PocketBase from "pocketbase";
import styles from "@/styles/Create.module.css";
import Loader from "./Loader";
import Embed from "@editorjs/embed";
import { AES, enc } from "crypto-js";
import compressImage from "@/lib/CompressImg";
import dynamic from 'next/dynamic';

const ModalButton = dynamic(() => import('@/lib/Modal').then((module) => module.ModalButton));
const ModalContainer = dynamic(() => import('@/lib/Modal').then((module) => module.ModalContainer));
const ModalForm = dynamic(() => import('@/lib/Modal').then((module) => module.ModalForm));
const ModalInput = dynamic(() => import('@/lib/Modal').then((module) => module.ModalInput));
const ModalTitle = dynamic(() => import('@/lib/Modal').then((module) => module.ModalTitle));


const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

function Editor({ page, preview }) {
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
  const [isTitleEdit, setIsTitleEdit] = useState(false);
  const [importantNote, setImportantNote] = useState(false)

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
            const state = await pb.collection("pages").update(page, formData);
            console.log("Auto saved successfully!");
          } catch (error) {
            toast.error("Could not auto save!", {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            console.log(error);
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
      async function fetchArticles() {
        if (page === "firstopen") {
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
            toast.info("Note no longer encrypted on server.")
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
            "Could not get page data! Please do not attempt to save it",
            {
              position: toast.POSITION.TOP_LEFT,
            }
          );
          console.log(error);
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
          simpleEmbeds: {
            class: SimpleIframe,
            inlineToolbar: true,
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                codepen: true,
                customPdf: {
                  regex:
                    /https?:\/\/notidb\.suddsy\.dev\/api\/files\/videos\/([^\/\?\&]*)\/([^\/\?\&]*)\.pdf/,
                  embedUrl:
                    "https://notidb.suddsy.dev/api/files/videos/<%= remote_id %>.pdf",
                  html: "<iframe  width='100%' height='500' style='border: none;'></iframe>",
                  height: 300,
                  width: 600,
                  id: (groups) => groups.join("/"),
                },
                customDocs: {
                  regex:
                    /https?:\/\/notidb\.suddsy\.dev\/api\/files\/videos\/([^\/\?\&]*)\/([^\/\?\&]*)\.docx/,
                  embedUrl:
                    "https://docs.google.com/viewerng/viewer?url=https://notidb.suddsy.dev/api/files/videos/<%= remote_id %>.docx&embedded=true",
                  html: "<iframe  width='100%' height='500' style='border: none;'></iframe>",
                  height: 300,
                  width: 600,
                  id: (groups) => groups.join("/"),
                },
              },
            },
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
                      pb.collection("videos").create(formData),
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
                        url: `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/videos/${response.id}/${response.file_data}`,
                      },
                    };
                  }
                  return upload(file);
                },
              },
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  // your own uploading logic here
                  async function upl(file) {
                    const formData = new FormData();
                    const compressedBlob = await compressImage(file); // Maximum file size in KB (100KB in this example)
                    const compressedFile = new File(
                      [compressedBlob],
                      file.name,
                      { type: "image/jpeg" }
                    );
                    formData.append("file_data", compressedFile);
                    formData.append("uploader", pb.authStore.model.id);
                    const response = await toast.promise(
                      pb.collection("imgs").create(formData),
                      {
                        pending: "Saving img...",
                        success: "Saved successfuly. 📁",
                        error: "failed 🤯",
                      }
                    );
                    return {
                      success: 1,
                      file: {
                        url: `${process.env.NEXT_PUBLIC_POCKETURL}/api/files/imgs/${response.id}/${response.file_data}`,
                      },
                    };
                  }
                  return upl(file);
                },
              },
            },
          },
          table: Table,
        },
        data: editorData,
        placeholder: "Enter some text...",
      });

      setEditor(editorInstance, () => {
        // Cleanup logic
        if (editor) {
          try {
            editor.destroy();
          } catch (err) {
            console.warn(err);
            toast.error(`Error: Too fast, reloading editor`);
            setIsLoading(true);
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          }
        }
      });
    }

    return () => {
      // Cleanup logic
      if (editor) {
        try {
          editor.destroy();
        } catch (err) {
          console.warn(err);
          toast.error(`Error: Too fast, reloading editor`);
          setIsLoading(true);
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        }
      }
    };
  }, [editorData, page]);

  async function handleDeleteArticle() {
    await pb.collection("pages").delete(page);
    //router.replace('/');
  }

  async function handleTitleChange() {
    setIsTitleEdit(false);
    const title = document.getElementById('tit')
    setArticleTitle(title.innerText);
    const newTitle = {
      title: title.innerText
    };
    await pb.collection("pages").update(page, newTitle);
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
      try {
        const compressidToast = toast.loading("Compressing image...");
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
        toast.dismiss(compressidToast);
      } catch (error) {
        toast.error("Error uploading header img", {
          position: toast.POSITION.TOP_LEFT,
        });
      }
    }
  }

  async function handleSetcurrentPageIconValue() {
    const data = {
      icon: currentPageIconValue,
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
      </Head>
      {isSaving && (<AutoSaveLoader />)}
      <div className={styles.title}>
        <div className={styles.title}>
          {articleHeader && <img src={articleHeader} alt="Page header img" />}
          <div className={styles.headerstuff}>
            <div className={styles.titleeditorcontainer}>
              <div
                className={styles.titleinput}
                contentEditable
                type="text"
                id='tit'
                onFocus={() => setIsTitleEdit(true)}
              >
                {articleTitle ? articleTitle : "Untitled"}
              </div>
              {isTitleEdit && (
                <button
                  onClick={handleTitleChange}
                  type="button"
                  className={styles.savetitlebtn}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z" />
                  </svg>
                </button>
              )}
            </div>
            <div className={styles.title_buttons} id="tut_title_btns_id">
              <ImportantNote classname={styles.title_buttons_btn} importt={importantNote} page={page} />

              <Link
                href="/u/me"
                className={`${styles.title_buttons_btn} ${styles.title_buttons_btn_usrSettings_btn}`}
                title="Account settings"
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

              <div className={`${styles.title_buttons_btn}`}>
                <label className={styles.customfileupload} title="Upload page header image">
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
              <button
                type="button"
                onClick={handleSharePage}
                className={styles.title_buttons_btn}
                title="Share page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIconModalState(true)}
                className={styles.title_buttons_btn}
                title="Set Icon for page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enable-background="new 0 0 24 24"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <g>
                    <rect fill="none" height="24" width="24" />
                    <rect fill="none" height="24" width="24" />
                  </g>
                  <g>
                    <g />
                    <path d="M11.99,2C6.47,2,2,6.48,2,12c0,5.52,4.47,10,9.99,10C17.52,22,22,17.52,22,12C22,6.48,17.52,2,11.99,2z M8.5,8 C9.33,8,10,8.67,10,9.5S9.33,11,8.5,11S7,10.33,7,9.5S7.67,8,8.5,8z M16.71,14.72C15.8,16.67,14.04,18,12,18s-3.8-1.33-4.71-3.28 C7.13,14.39,7.37,14,7.74,14h8.52C16.63,14,16.87,14.39,16.71,14.72z M15.5,11c-0.83,0-1.5-0.67-1.5-1.5S14.67,8,15.5,8 S17,8.67,17,9.5S16.33,11,15.5,11z" />
                  </g>
                </svg>
              </button>
              <button
                type="button"
                onClick={handleDeleteArticle}
                className={styles.title_buttons_btn}
                title="Delete page"
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
      {shareLinkModalState && (
        <>
          <ModalContainer events={() => setShareLinkModalState(false)}>
            <ModalForm>
              <ModalTitle>Page icon</ModalTitle>
              <div className={styles.shareModal_link_text}>
                https://noti.jamesmowat.com/page/view/{page}
              </div>
              <ModalButton events={copyToClip}> <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-160q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Z" />
              </svg></ModalButton>
              <ModalButton classnm={`${styles.buttonred}`} events={unSharePage}>Hide</ModalButton>
            </ModalForm>
          </ModalContainer>

        </>
      )}
      {iconModalState && (
        <>
          <ModalContainer events={() => setIconModalState(false)}>
            <ModalForm>
              <ModalTitle>Page icon</ModalTitle>
              <ModalInput chngevent={setCurrentPageIconValue} place={"1 emoji only"} type={"text"} />
              <ModalButton events={handleSetcurrentPageIconValue} classnm={`${styles.buttonred}`}>Change</ModalButton>
            </ModalForm>
          </ModalContainer>
        </>
      )}
      <div className={styles.creategrid}>
        <div className={styles.form}>
          <div className={styles.editor} ref={editorRef}></div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
class SimpleIframe {
  static get toolbox() {
    return {
      title: "Embed",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g><path d="M20,3H4C2.9,3,2,3.9,2,5v12c0,1.1,0.89,2,2,2h4v1c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1v-1h4c1.1,0,2-0.9,2-2V5 C22,3.89,21.1,3,20,3z M20,17H4V5h16V17z"/><path d="M6.5,7.5h1.75C8.66,7.5,9,7.16,9,6.75v0C9,6.34,8.66,6,8.25,6H6C5.45,6,5,6.45,5,7v2.25C5,9.66,5.34,10,5.75,10h0 C6.16,10,6.5,9.66,6.5,9.25V7.5z"/><path d="M18.25,12L18.25,12c-0.41,0-0.75,0.34-0.75,0.75v1.75h-1.75c-0.41,0-0.75,0.34-0.75,0.75v0c0,0.41,0.34,0.75,0.75,0.75H18 c0.55,0,1-0.45,1-1v-2.25C19,12.34,18.66,12,18.25,12z"/></g></g></svg>',
    };
  }

  constructor({ data }) {
    this.data = data;
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("simple-image");
    try {
      if (this.data.url) {
        if (url.endsWith(".docx") || url.endsWith(".docx/")) {
          return toast.error('File type not supported please reupload as a pdf!');
        }
      }
    } catch (err) {
      return
    }

    if (this.data && this.data.fileId) {
      //const originalUrl = decodeURIComponent(this.data.url).replace(
      //  /&amp;/g,
      //  "&"
      //);
      this._createImage(this.data.fileId);
      return this.wrapper;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none"; // Set the input display to hidden
    fileInput.addEventListener("change", this._handleFileSelection.bind(this));

    const uploadBtn = document.createElement("button");
    uploadBtn.textContent = "Upload File";
    uploadBtn.classList.add("upload-button"); // Add a class for styling the button
    uploadBtn.style.background =
      "linear-gradient(45deg, white 40%, #03A9F4 60%)";
    uploadBtn.style.color = "#000";
    uploadBtn.style.border = "none";
    uploadBtn.style.padding = "1em";
    uploadBtn.style.width = "100%";
    uploadBtn.style.borderRadius = "5px";
    uploadBtn.style.cursor = "pointer";
    uploadBtn.style.fontWeight = "700";
    fileInput.click(); //open immediately
    uploadBtn.addEventListener("click", () => fileInput.click());

    this.wrapper.appendChild(uploadBtn);
    this.wrapper.appendChild(fileInput);

    return this.wrapper;
  }

  _handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const uploadFile = async (file) => {
      const fileInput = this.wrapper.querySelector('input[type="file"]');
      const uploadBtn = this.wrapper.querySelector("button");

      fileInput.disabled = true;
      uploadBtn.disabled = true;

      const formData = new FormData();
      formData.append("file_data", file);
      formData.append("uploader", pb.authStore.model.id);
      try {
        if (file.size > 5242880) {
          return toast.error('File too big. Must be < 5mb')
        }
        if (file.name.endsWith(".docx") || file.name.endsWith(".docx/")) {
          return toast.error('File type not supported yet!');
        }
        const record = await pb.collection("videos").create(formData);
        console.log(record);
        this._createImage(
          record.id // Pass the fileId as an argument
        );
      } catch (error) {
        console.error(error);
        // Handle error
      } finally {
        fileInput.disabled = false;
        uploadBtn.disabled = false;
      }
    };

    uploadFile(file);
  }

  async _createImage(fileId) {
    const iframe = document.createElement("iframe");
    iframe.classList.add(styles.embedIframe);
    iframe.style.width = "100%";
    iframe.style.height = "70vh";
    iframe.style.border = "2px solid #c29fff";
    iframe.style.borderRadius = "5px";
    const fileToken = await pb.files.getToken();
    // retrieve an example protected file url (will be valid ~5min)
    const record = await pb.collection('videos').getOne(fileId); // Use the fileId to retrieve the record
    const url = pb.files.getUrl(record, record.file_data, { 'token': fileToken });
    iframe.src = url;
    iframe.setAttribute('fileId', fileId); // Set the fileId as an attribute of the iframe

    this.wrapper.innerHTML = "";
    this.wrapper.appendChild(iframe);
  }

  save(blockContent) {
    const iframe = blockContent.querySelector("iframe");
    const fileId = iframe.getAttribute('fileId'); // Retrieve the fileId attribute

    return {
      fileId: fileId // Include the fileId in the saved data
    };
  }
}



function AutoSaveLoader() {
  return (
    <div className={styles.autosaveloader}></div>
  )
}

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
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><path d="M19,12.87c0-0.47-0.34-0.85-0.8-0.98C16.93,11.54,16,10.38,16,9V4l1,0 c0.55,0,1-0.45,1-1c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3c0,0.55,0.45,1,1,1l1,0v5c0,1.38-0.93,2.54-2.2,2.89 C5.34,12.02,5,12.4,5,12.87V13c0,0.55,0.45,1,1,1h4.98L11,21c0,0.55,0.45,1,1,1c0.55,0,1-0.45,1-1l-0.02-7H18c0.55,0,1-0.45,1-1 V12.87z" fill-rule="evenodd"/></g></svg>        </div>
      </label>
    </div>
  )
}