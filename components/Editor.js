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
    const [selectedFile, setSelectedFile] = useState(null);
    const [articleHeader, setArticleHeader] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [lastTypedTime, setLastTypedTime] = useState(Date.now());
    const [lastTypedTimeIdle, setLastTypedTimeIdle] = useState(false);

    useEffect(() => {
        let timer;

        // Function to save the article after the specified delay
        const saveArticle = async () => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - lastTypedTime;

            if (elapsedTime >= 1000 && !lastTypedTimeIdle) {  // Auto-save 3 seconds after the user stops typing
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
        }, 1000);  // Initial auto-save 3 seconds after component mount

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
        router.replace('/');
    }

    function handleTitleChange(e) {
        setArticleTitle(e.target.value);
    }

    async function handleFileChange(e) {
        const file = e.target.files[0];
        setSelectedFile(file);

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
                            quality: 0.9,
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
                    </div>
                </div>
            </div>
            <div className={styles.specialinputs}>

            </div>
            <div className={styles.creategrid}>
                <div className={styles.form}>


                    <div className={styles.editor} ref={editorRef}></div>

                    <div className={styles.formbuttons}>
                        <button className={styles.submitbutton} type="button" onClick={handleSaveArticle}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M840 374v495.334q0 27-19.833 46.833T773.334 936H186.666q-27 0-46.833-19.833T120 869.334V282.666q0-27 19.833-46.833T186.666 216H682l158 158Zm-66.666 29.333L652.667 282.666H186.666v586.668h586.668V403.333ZM479.843 812.667q45.49 0 77.49-31.844 32-31.843 32-77.333 0-45.49-31.843-77.49-31.843-31.999-77.333-31.999-45.49 0-77.49 31.843-32 31.843-32 77.333 0 45.49 31.843 77.49 31.843 32 77.333 32ZM235.333 480H594V331.333H235.333V480Zm-48.667-76.667v466.001-586.668 120.667Z" /></svg>
                        </button>
                        <div
                            className={`${styles.submitbutton}`}
                        >
                            <label class={styles.customfileupload}>
                                <input
                                    type="file"
                                    name="file"
                                    id="fileInput"
                                    accept="image/*"
                                    className={styles.finput}
                                    onChange={handleFileChange}
                                />
                                <p id="fileInputName"><svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M146.666 896q-27 0-46.833-19.833T80 829.334V322.666q0-27 19.833-46.833T146.666 256h666.668q27 0 46.833 19.833T880 322.666v506.668q0 27-19.833 46.833T813.334 896H146.666Zm0-66.666h666.668V405.333H146.666v424.001Z" /></svg></p>
                            </label>
                        </div>
                        <button className={styles.submitbutton} type="button" onClick={handleDeleteArticle}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="m366 756.667 114-115.334 114.667 115.334 50-50.667-114-115.333 114-115.334-50-50.667L480 540 366 424.666l-50.667 50.667L430 590.667 315.333 706 366 756.667ZM267.333 936q-27 0-46.833-19.833t-19.833-46.833V315.999H160v-66.666h192V216h256v33.333h192v66.666h-40.667v553.335q0 27-19.833 46.833T692.667 936H267.333Zm425.334-620.001H267.333v553.335h425.334V315.999Zm-425.334 0v553.335-553.335Z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Editor;
