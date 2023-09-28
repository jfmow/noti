import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import compressImage from "@/lib/CompressImg";
import styles from '@/styles/Unsplashpicker.module.css';
import { ModalContainer, ModalForm, ModalTitle } from '@/lib/Modal';
import { handleBlurHashChange } from '@/lib/idk';
import Link from './Link';
import debounce from 'lodash/debounce'; // Import the debounce function from Lodash

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);

export default function Unsplash({ page, setArticleHeader, close }) {
    const [images, setImages] = useState([]);
    const [currentPageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(-1);
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = debounce(handleSearch, 500); // Adjust the debounce delay as needed

    useEffect(() => {
        debouncedSearch()
    }, [currentPageNumber, searchTerm]);

    // Create a debounced version of handleSearch

    async function fetchImages() {
        try {
            if (currentPageNumber >= totalPages && totalPages !== -1) {
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/api/getunsplash`, {
                method: 'POST',
                body: JSON.stringify({ query: searchTerm || '*rand**', page: currentPageNumber }),
            });

            const data = await response.json();
            setImages(data.results);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    // Use the debouncedSearch function instead of handleSearch
    function handleSearch() {
        setPageNumber(1);
        fetchImages();
    }


    async function downloadAndCreateFileObjects(data) {
        const fullImageUrl = data.urls.full;

        setArticleHeader(fullImageUrl);
        try {
            await pb.collection("pages").update(page, { "unsplash": fullImageUrl, header_img: null });
            const response = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/api/downloadunsplash`, {
                method: "POST", // Use POST method for sending form data
                body: JSON.stringify({ "image": data.id }),   // Send the FormData object as the request body
            });
            const state = await response.json()
            if (state.code !== 0) {
                throw Error("Download api error")
            }
        } catch (err) {
            console.error('Error downloading and creating file objects:', err);
        }
    }


    function Image({ image, setArticleHeader, close }) {
        const [loading, setLoading] = useState(true)
        return (
            <>
                <div className={`${!loading && styles.loading} ${styles.img}`}>
                    <img
                        key={image.id}
                        src={image.urls.raw + '?q=65&w=200'}
                        alt={image.alt_description}
                        onClick={() => {
                            async function Down() {
                                setLoading(false)
                                await downloadAndCreateFileObjects(image, setArticleHeader);
                                setLoading(true)
                            }
                            Down()
                        }}
                    //style={loading ? ({ width: 0, height: 0 }) : (null)}
                    //onLoad={(e) => {
                    //    setLoading(false)
                    //}}
                    />
                    {/*{loading && (
                        <img src={handleBlurHashChange({ hash: image.blur_hash, width: 200, height: 64 })} />
                    )}*/}
                    <Link href={image.user.links.html + `?utm_source=${process.env.NEXT_PUBLIC_CURRENTURL}`} className={styles.author}>Photo by: <span className={styles.author_name}>{image.user.name}</span></Link>
                </div>
            </>
        )
    }



    return (
        <>
            <div className={styles.sinputcontainer}>
                <input
                    placeholder="Search for an image..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            debouncedSearch(); // Call the debouncedSearch function on Enter key press
                        }
                    }}
                    type="text"
                    className={styles.sinput}
                    id={styles.sinput}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className={styles.sunderline}></div>
            </div>

            <div className={styles.imgs}>
                {
                    images?.map((image) => (
                        <>
                            <Image image={image} close={close} />
                        </>
                    ))
                }
            </div>
            <div className={styles.buttons}>

                <button className={styles.pagebtn} type='button' onClick={() => { setPageNumber((prev) => prev - 1); }} disabled={currentPageNumber <= 1}>Back</button>
                <button className={styles.pagebtn} type='button' onClick={() => { setPageNumber((prev) => prev + 1); }} disabled={totalPages === -1}>Next</button>

            </div>

        </>
    );
}
