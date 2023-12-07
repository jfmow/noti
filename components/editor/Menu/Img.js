import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import debounce from 'lodash/debounce';
import Link from '../../Link';
import styles from '@/styles/Single/Unsplashpicker.module.css'
import { toaster } from '@/components/toast';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);

export default function Unsplash({ page, setArticleHeader, close }) {
    const [images, setImages] = useState([]);
    const [currentPageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(-1);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const debouncedSearch = debounce(() => {
        setPageNumber(1);
        fetchImages();
    }, 500);

    useEffect(() => {
        try {
            debouncedSearch();
        } catch { }
        return debouncedSearch.cancel;
    }, [searchTerm]);

    useEffect(() => {
        try {
            fetchImages();
        } catch { }
    }, [currentPageNumber]);

    async function fetchImages() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/api/getunsplash`, {
                method: 'POST',
                body: JSON.stringify({ query: searchTerm || '*rand**', page: currentPageNumber }),
            });

            const data = await response.json();
            setImages(data.results);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error fetching images:', error);
            // Handle the error, e.g., set an error state or show an error message
        }
    }

    async function downloadAndCreateFileObjects(data) {
        const loadingToast = await toaster.loading("Setting cover...")

        const fullImageUrl = data.urls.full;
        setLoading(data.id);
        setArticleHeader(fullImageUrl);

        try {
            await pb.collection("pages").update(page, { "unsplash": fullImageUrl, header_img: null });
            const response = await fetch(data.links.download_location + `&client_id=${process.env.NEXT_PUBLIC_UNSPLASH}`, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Download API error");
            }
            toaster.update(loadingToast, "Cover set successfully!", "success")
        } catch (err) {
            console.error('Error downloading and creating file objects:', err);
            toaster.error('An error occured while setting the page cover')
            // Handle the error, e.g., set an error state or show an error message
        } finally {
            setLoading(null);
        }
    }

    async function removeCover() {
        const data = {
            "unsplash": "",
            "header_img": null
        };

        try {
            await pb.collection('pages').update(page, data);
            setArticleHeader(null);
        } catch (error) {
            console.error('Error removing cover:', error);
            // Handle the error, e.g., set an error state or show an error message
        }
    }

    return (
        <>
            <div className={styles.sinputcontainer}>
                <input
                    placeholder="Search for an image..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            debouncedSearch();
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
                {images?.map((image) => (
                    <div key={image.id} className={`${loading === image.id && styles.loading} ${styles.img}`}>
                        <img
                            src={image.urls.raw + '?q=65&w=200'}
                            alt={image.alt_description}
                            onClick={() => !loading && downloadAndCreateFileObjects(image)}
                            onLoad={() => setLoading(false)}
                        />
                        <Link href={image.user.links.html + `?utm_source=note.suddsy.dev&utm_medium=referral`} className={styles.author}>
                            Photo by: <span className={styles.author_name}>{image.user.name}</span>
                        </Link>
                    </div>
                ))}
            </div>
            <div className={styles.buttons}>
                <button className={styles.pagebtn} type="button" onClick={() => setPageNumber((prev) => prev - 1)} disabled={currentPageNumber <= 1}>
                    Back
                </button>
                <button className={styles.pagebtn} type="button" onClick={() => setPageNumber((prev) => prev + 1)} disabled={currentPageNumber >= totalPages || totalPages === -1}>
                    Next
                </button>
                <button className={`${styles.pagebtn} ${styles.pagebtn_dark}`} type="button" onClick={() => removeCover()}>
                    Remove cover
                </button>
            </div>
        </>
    );
}
