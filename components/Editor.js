import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Compressor from 'compressorjs';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import ImageTool from '@editorjs/image';
import AttachesTool from '@editorjs/attaches';
import PocketBase from 'pocketbase';
import styles from '@/styles/Create.module.css';
import Loader from './Loader';
import Embed from '@editorjs/embed';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

function Editor({ page, preview }) {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const [editorData, setEditorData] = useState({});
    const [isError, setError] = useState(false);
    const [articleTitle, setArticleTitle] = useState('');
    const [articleHeader, setArticleHeader] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastTypedTime, setLastTypedTime] = useState(Date.now());
    const [lastTypedTimeIdle, setLastTypedTimeIdle] = useState(false);
    const [pageShared, setPageShared] = useState(false)
    const [linkSHow, setLinkShow] = useState(false)

    useEffect(() => {
        if (preview === 'true') {
            return
        }
        let timer;

        // Function to save the article after the specified delay
        const saveArticle = async () => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - lastTypedTime;

            if (elapsedTime >= 500 && !lastTypedTimeIdle) {  // Auto-save 3 seconds after the user stops typing
                setLastTypedTimeIdle(true)
                if (editor) {
                    const articleContent = await editor.saver.save();
                    let formData = new FormData();

                    formData.append("title", articleTitle);
                    formData.append("content", JSON.stringify(articleContent));
                    try {
                        const state = await pb.collection('pages').update(page, formData);
                        console.log('Auto saved successfully!')
                    } catch (error) {
                        toast.error('Could not auto save!', {
                            position: toast.POSITION.BOTTOM_LEFT,
                        });
                        console.log(error);
                    }
                    console.log('Auto-save executed.');
                }
                setLastTypedTimeIdle(true)
            }
        };

        // Function to update the last typing timestamp
        const updateLastTypedTime = () => {
            setLastTypedTime(Date.now());
        };

        // Event listener for detecting user typing
        const typingEventListener = () => {
            updateLastTypedTime();
            setLastTypedTimeIdle(false)
        };

        // Event listener for detecting mouse movement
        const mouseMovementEventListener = () => {
            updateLastTypedTime();
        };

        // Attach event listeners
        window.addEventListener('keydown', typingEventListener);
        window.addEventListener('mousemove', mouseMovementEventListener);

        // Start the auto-save timer
        timer = setTimeout(() => {
            saveArticle();
        }, 500);  // Initial auto-save 3 seconds after component mount

        return () => {
            // Clean up the event listeners and timer on component unmount
            window.removeEventListener('keydown', typingEventListener);
            window.removeEventListener('mousemove', mouseMovementEventListener);
            clearTimeout(timer);
        };
    }, [lastTypedTime]);

    useEffect(() => {
        if (page) {
            async function fetchArticles() {
                if (page === 'firstopen') {
                    return
                }
                if (preview === 'true') {
                    try {
                        const record = await pb.collection('preview').getOne(page);
                        setEditorData(record.content);
                        setArticleTitle(record.title);
                        if (record.header_img) {
                            setArticleHeader(`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/preview/${page}/${record.header_img}`);
                        } else {
                            setArticleHeader(null)
                        }
                    } catch (error) {
                        toast.error('Could not get article data! Please do not attempt to save it', {
                            position: toast.POSITION.TOP_LEFT,
                        });
                        console.log(error);
                        setError(true);
                    }
                } else {
                    try {
                        const record = await pb.collection('pages').getOne(page);
                        setEditorData(record.content);
                        setArticleTitle(record.title);
                        setPageShared(record.shared);
                        if (record.header_img) {
                            setArticleHeader(`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/pages/${page}/${record.header_img}`);
                        } else {
                            setArticleHeader(null)
                        }
                        setError(false)
                    } catch (error) {
                        toast.error('Could not get page data! Please do not attempt to save it', {
                            position: toast.POSITION.TOP_LEFT,
                        });
                        console.log(error);
                        setError(true);
                    }
                }
            }
            fetchArticles();
            setIsLoading(false)
        } else {
            setError(true);
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        if (editorRef.current && (editorData == null || Object.keys(editorData).length > 0)) {
            const editorInstance = new EditorJS({
                holder: editorRef.current,
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                    },
                    embed: {
                        class: Embed,
                        config: {
                            services: {
                                youtube: true,
                                codepen: true,
                                customPdf: {
                                    regex: /https?:\/\/notidb\.suddsy\.dev\/api\/files\/videos\/([^\/\?\&]*)\/([^\/\?\&]*)\.pdf/,
                                    embedUrl: 'https://notidb.suddsy.dev/api/files/videos/<%= remote_id %>.pdf',
                                    html: "<iframe  width='100%' height='500' style='border: none;'></iframe>",
                                    height: 300,
                                    width: 600,
                                    id: (groups) => groups.join('/')
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
                                        formData.append('file_data', file);
                                        formData.append('uploader', pb.authStore.model.id);
                                        const response = await toast.promise(
                                            pb.collection('videos').create(formData),
                                            {
                                                pending: 'Saving img...',
                                                success: 'Saved successfully. 📁',
                                                error: 'Failed 🤯',
                                            }
                                        );
                                        function getFileExtension(file) {
                                            const filename = file.name;
                                            const extension = filename.split('.').pop();
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
                                        const compressedFile = await toast.promise(
                                            new Promise((resolve, reject) => {
                                                new Compressor(file, {
                                                    quality: 1,
                                                    // Set the quality of the output image to a high value
                                                    maxWidth: 2000, // Limit the maximum width of the output image to 1920 pixels
                                                    maxHeight: 2000, // Limit the maximum height of the output image to 1920 pixels
                                                    mimeType: "image/webp",
                                                    maxSize: 3 * 1024 * 1024,

                                                    // The compression process is asynchronous,
                                                    // which means you have to access the `result` in the `success` hook function.
                                                    success(result) {
                                                        resolve(result);
                                                    },
                                                    error(err) {
                                                        reject(err);
                                                    },
                                                });
                                            }),
                                            {
                                                pending: "Compressing img's... 📸",
                                                error: "failed 🤯",
                                            }
                                        );
                                        formData.append('file_data', compressedFile);
                                        formData.append('uploader', pb.authStore.model.id);
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
                                            }
                                        };
                                    };
                                    return upl(file);
                                },
                            },
                        },
                    },
                    table: Table,
                },
                data: editorData,
                placeholder: 'Enter some text...',
            });





            setEditor(editorInstance, () => {
                // Cleanup logic
                if (editor) {
                    try {
                        editor.destroy();
                    } catch (err) {
                        console.warn(err)
                        toast.error(`Error: Too fast, reloading editor`)
                        setIsLoading(true)
                        setTimeout(() => {
                            window.location.reload()
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
                    console.warn(err)
                    toast.error(`Error: Too fast, reloading editor`)
                    setIsLoading(true)
                    setTimeout(() => {
                        window.location.reload()
                    }, 1200);
                }
            }
        };
    }, [editorData, page]);

    async function handleSaveArticle() {
        const articleContent = await editor.saver.save();
        let formData = new FormData();

        formData.append("title", articleTitle);
        formData.append("content", JSON.stringify(articleContent));

        if (page) {
            try {
                await pb.collection('pages').update(page, formData);
                toast.success('Saved successfully!', {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            } catch (error) {
                toast.error('Could not save!', {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
                console.log(error);
            }
        } else {
            try {
                const response = await toast.promise(pb.collection('pages').create(article), {
                    pending: 'Saving article...',
                    success: 'Saved successfully. 📄',
                    error: 'Failed 🤯',
                });

                if (response.error) {
                    throw new Error(response.error);
                }

                toast.success('Saved successfully!', {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            } catch (error) {
                toast.warning('Could not save!', {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
                console.log(error);
            }
        }
    }

    async function handleDeleteArticle() {
        await pb.collection('pages').delete(page);
        //router.replace('/');
    }

    function handleTitleChange(e) {
        setArticleTitle(e.target.value);
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
                const compressedFile = await toast.promise(
                    new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 1,
                            mimeType: "image/webp",
                            maxSize: 4 * 1024 * 1024,
                            success(result) {
                                resolve(result);
                            },
                            error(err) {
                                reject(err);
                                console.log(err)
                            },
                        });
                    }),
                    {
                        pending: "Compressing img's... 📸",
                        error: "failed 🤯",
                    }
                );
                formData.append("header_img", compressedFile);
                if (compressedFile.size > 4508876.8) {
                    return toast.error('Compresed file too big!')
                }
                await pb.collection('pages').update(page, formData);
            } catch (error) {
                toast.error('Error uploading header img', {
                    position: toast.POSITION.TOP_LEFT,
                });

            }
        }
    }

    async function handleSharePage() {
        if (pageShared) {
            return setLinkShow(true)
        } else {
            const data = {
                "shared": true
            };

            const record = await pb.collection('pages').update(page, data);
            setPageShared(true)
            setLinkShow(true)
            toast.success('Page now public for anyone with the link.')
        }

    }

    async function unSharePage() {
        const data = {
            "shared": false
        };

        const record = await pb.collection('pages').update(page, data);
        setPageShared(false)
        setLinkShow(false)
        toast.success('Page now hidden.')
    }

    function copyToClip() {
        // Create a dummy input element
        var dummyInput = document.createElement('input');
        dummyInput.setAttribute('value', `https://noti.jamesmowat.com/page/view/${page}`);

        // Append it to the body
        document.body.appendChild(dummyInput);

        // Select and copy the value of the dummy input
        dummyInput.select();
        document.execCommand('copy');

        // Remove the dummy input from the DOM
        document.body.removeChild(dummyInput);

        // Optionally, provide visual feedback to the user
        setLinkShow(false)
    }

    if (isError) {
        return (<div>
            <Head>
                <title>Whoops!</title>
                <link rel="favicon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap" rel="stylesheet"></link>
            </Head>
            <div className={styles.containererror}>
                <h1>Page not found!</h1>
                <Link href="/">
                    <button className={styles.backbutton}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button></Link>
            </div>
        </div>)
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={styles.create}>
            <Head>
                <title>{page ? 'Edit Article' : 'Create Article'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.title}>

                <div className={styles.title}>
                    {articleHeader &&
                        <Image src={articleHeader} alt="Page header img" width={600} height={400} />}
                    <div className={styles.headerstuff}>
                        <input
                            className={styles.titleinput}
                            type="text"
                            name="articleTitle"
                            value={articleTitle}
                            onChange={handleTitleChange}
                            placeholder="Untitled"
                        />

                        <div className={styles.title_buttons}>
                            <div className={`${styles.title_buttons_btn}`}>
                                <label className={styles.customfileupload}>
                                    <input
                                        type="file"
                                        name="file"
                                        id="fileInput"
                                        accept="image/*"
                                        className={styles.finput}
                                        onChange={handleFileChange}
                                    />
                                    <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z" /></svg></span>
                                </label>
                            </div>
                            <button type='button' onClick={handleSharePage} className={styles.title_buttons_btn}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" /></svg></button>
                            <button type='button' onClick={handleDeleteArticle} className={styles.title_buttons_btn}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg></button>
                        </div>
                    </div>
                </div>
            </div>
            {linkSHow && (
                <>
                    <div className={styles.sharemodal_container} onClick={() => setLinkShow(false)}>
                        <div className={styles.shareModal} onClick={(event) => event.stopPropagation()}>
                            <div className={styles.shareModal_link}>
                                <div className={styles.shareModal_link_text}>
                                    https://noti.jamesmowat.com/page/view/{page}
                                </div>
                                <button onClick={copyToClip} className={styles.shareModal_link_btn}><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-160q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Z" /></svg></button>
                                <button className={`${styles.buttondefault} ${styles.buttonred}`} onClick={unSharePage} type='button' >Un-share</button>
                            </div>
                        </div>
                    </div>
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
