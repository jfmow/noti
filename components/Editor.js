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
import Router from "next/router";
import { AnimatePresence } from "framer-motion";
import { AlternateButton, ModalTempLoader } from "@/lib/Modal";
import { createRandomMeshGradients } from "@/lib/randomMeshGradient";

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
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                codepen: true,
                customPdf: {
                  regex:
                    /https?:\/\/notidb\.suddsy\.dev\/api\/files\/files\/([^\/\?\&]*)\/([^\/\?\&]*)\.pdf/,
                  embedUrl:
                    "https://notidb.suddsy.dev/api/files/files/<%= remote_id %>.pdf",
                  html: "<iframe  width='100%' height='500' style='border: none;'></iframe>",
                  height: 300,
                  width: 600,
                  id: (groups) => groups.join("/"),
                },
                customDocs: {
                  regex:
                    /https?:\/\/notidb\.suddsy\.dev\/api\/files\/files\/([^\/\?\&]*)\/([^\/\?\&]*)\.docx/,
                  embedUrl:
                    "https://docs.google.com/viewerng/viewer?url=https://notidb.suddsy.dev/api/files/files/<%= remote_id %>.docx&embedded=true",
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
    editor.destroy()
    Router.push('/page/firstopen')
  }

  async function handleTitleChange() {
    const title = document.getElementById('tit')
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
                id='tit'
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
                  className={`${styles.title_buttons_btn} ${styles.title_buttons_btn_usrSettings_btn}`}
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


//Custom editor js plugins

class SimpleIframe {
  static get toolbox() {
    return {
      title: "Embed",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g><path d="M20,3H4C2.9,3,2,3.9,2,5v12c0,1.1,0.89,2,2,2h4v1c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1v-1h4c1.1,0,2-0.9,2-2V5 C22,3.89,21.1,3,20,3z M20,17H4V5h16V17z"/><path d="M6.5,7.5h1.75C8.66,7.5,9,7.16,9,6.75v0C9,6.34,8.66,6,8.25,6H6C5.45,6,5,6.45,5,7v2.25C5,9.66,5.34,10,5.75,10h0 C6.16,10,6.5,9.66,6.5,9.25V7.5z"/><path d="M18.25,12L18.25,12c-0.41,0-0.75,0.34-0.75,0.75v1.75h-1.75c-0.41,0-0.75,0.34-0.75,0.75v0c0,0.41,0.34,0.75,0.75,0.75H18 c0.55,0,1-0.45,1-1v-2.25C19,12.34,18.66,12,18.25,12z"/></g></g></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data;
    this.wrapper = undefined;
    this.config = config || {};
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
    try {
      fileInput.click(); //open immediately
    } catch (err) {
      console.warn(err)
    }
    uploadBtn.addEventListener("click", () => fileInput.click());

    this.wrapper.appendChild(uploadBtn);
    this.wrapper.appendChild(fileInput);

    return this.wrapper;
  }

  async _handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const fileInput = this.wrapper.querySelector('input[type="file"]');
    const uploadBtn = this.wrapper.querySelector("button");

    fileInput.disabled = true;
    uploadBtn.disabled = true;
    const data2 = await this.config.storeFile.uploadFile(file)

    fileInput.disabled = false;
    uploadBtn.disabled = false;
    if (data2.success === 1) {
      await this._createImage(
        data2.file.recid // Pass the fileId as an argument
      );
      this.config.saveData.saveAll()
    } else {
      return
    }

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
    
    const record = await pb.collection('files').getOne(fileId); // Use the fileId to retrieve the record
    const url = pb.files.getUrl(record, record.file_data, { 'token': fileToken });
    iframe.src = url;
    iframe.setAttribute('fileId', fileId); // Set the fileId as an attribute of the iframe

    this.wrapper.innerHTML = "";
    this.wrapper.appendChild(iframe);
  }

  save(blockContent) {
    try {
      const iframe = blockContent.querySelector("iframe");
      const fileId = iframe.getAttribute('fileId'); // Retrieve the fileId attribute

      return {
        fileId: fileId // Include the fileId in the saved data
      };
    } catch (err) {
      console.log(err)
    }
  }
}

class SimpleTodo {
  static get toolbox() {
    return {
      title: "Todo",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><path d="M22,8c0-0.55-0.45-1-1-1h-7c-0.55,0-1,0.45-1,1s0.45,1,1,1h7C21.55,9,22,8.55,22,8z M13,16c0,0.55,0.45,1,1,1h7 c0.55,0,1-0.45,1-1c0-0.55-0.45-1-1-1h-7C13.45,15,13,15.45,13,16z M10.47,4.63c0.39,0.39,0.39,1.02,0,1.41l-4.23,4.25 c-0.39,0.39-1.02,0.39-1.42,0L2.7,8.16c-0.39-0.39-0.39-1.02,0-1.41c0.39-0.39,1.02-0.39,1.41,0l1.42,1.42l3.54-3.54 C9.45,4.25,10.09,4.25,10.47,4.63z M10.48,12.64c0.39,0.39,0.39,1.02,0,1.41l-4.23,4.25c-0.39,0.39-1.02,0.39-1.42,0L2.7,16.16 c-0.39-0.39-0.39-1.02,0-1.41s1.02-0.39,1.41,0l1.42,1.42l3.54-3.54C9.45,12.25,10.09,12.25,10.48,12.64L10.48,12.64z"/></g></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {
      items: []
    };
    this.wrapper = undefined;
    this.config = config;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add(styles.todo_container);

    const list = document.createElement("ul");
    list.classList.add(styles.todolist);

    if (this.data && this.data.items) {
      this.data.items.forEach((item, index) => {
        const listItem = document.createElement("li");

        const label = document.createElement("label");
        label.classList.add(styles.todocontainer);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.checked;

        const checkmark = document.createElement("div");
        checkmark.classList.add(styles.todocheckmark);

        label.appendChild(checkbox);
        label.appendChild(checkmark);

        listItem.appendChild(label);

        const content = document.createElement("span");
        content.textContent = item.content;
        content.contentEditable = true; // Make the content editable

        content.addEventListener("input", () => {
          item.content = content.textContent;
        });

        listItem.appendChild(content);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add(styles.tododeletebtn)
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>`
        deleteButton.addEventListener("click", () => {
          this.data.items.splice(index, 1);
          listItem.remove();
        });
        checkbox.addEventListener("change", () => {
          item.checked = checkbox.checked;
          if (item.checked) {
            listItem.appendChild(deleteButton);
          } else {
            listItem.removeChild(deleteButton);
          }

          this.config.saveData.saveAll()
        });
        if (item.checked) {
          listItem.appendChild(deleteButton);
        }


        list.appendChild(listItem);
      });
    } else {
      this.data = { items: [] };
    }

    const addItemInput = document.createElement("input");
    addItemInput.type = "text";
    addItemInput.placeholder = "+ Add an item";
    addItemInput.classList.add(styles.todoiteminput);
    addItemInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && addItemInput.value.trim() !== "") {
        const newItem = {
          content: addItemInput.value.trim(),
          checked: false
        };
        this.data.items.push(newItem);

        const listItem = document.createElement("li");

        const label = document.createElement("label");
        label.classList.add(styles.todocontainer);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const checkmark = document.createElement("div");
        checkmark.classList.add(styles.todocheckmark);

        label.appendChild(checkbox);
        label.appendChild(checkmark);

        listItem.appendChild(label);

        const content = document.createElement("span");
        content.textContent = newItem.content;
        content.contentEditable = true; // Make the content editable

        content.addEventListener("input", () => {
          newItem.content = content.textContent;
        });

        listItem.appendChild(content);



        checkbox.addEventListener("change", () => {
          newItem.checked = checkbox.checked;

          this.config.saveData.saveAll()
        });

        list.appendChild(listItem);


        addItemInput.value = "";
      }
    });

    this.wrapper.appendChild(list);
    this.wrapper.appendChild(addItemInput);

    return this.wrapper;
  }


  save() {
    return this.data;
  }
}

//END custom editorjs plugins

//autosave loader component

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