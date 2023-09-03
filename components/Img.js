import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase'
import compressImage from "@/lib/CompressImg";
import styles from '@/styles/Unsplashpicker.module.css'
import { ModalContainer, ModalForm, ModalTitle } from '@/lib/Modal';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
function Unsplash({ page, setArticleHeader, close }) {
    const [images, setImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPageNumber, setPageNumber] = useState(1)

    useEffect(() => {
        fetchImages();
    }, [currentPageNumber]);

    async function fetchImages() {
        try {
            if (currentPageNumber > 10) {
                return
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_CURRENTURL}/api/getunsplash?type=${searchTerm}&page=${currentPageNumber}`
            );
            const data = await response.json();
            setImages(data.results);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    function setArticleHeader2(e) {
        setArticleHeader(e)
    }

    async function downloadAndCreateFileObjects(data, page) {
        const fullImageUrl = data.urls.full;
        setArticleHeader2(fullImageUrl)
        try {
            await pb.collection("pages").update(page, { "unsplash": `${fullImageUrl}`, header_img: null });
            await fetch(data.links.download)
        } catch (err) { }
        return
    }


    return (
        <ModalContainer events={close}>
            <ModalForm>
                <ModalTitle>Unsplash</ModalTitle>
                <div>
                    <div className={styles.search}>
                        <input onChange={(e) => {
                            setSearchTerm(e.target.value)
                        }} type="text" value={searchTerm} className={styles.search__input} placeholder="Search..." />
                        <button className={styles.search__button} type='button' onClick={fetchImages}>
                            <svg className={styles.search__icon} aria-hidden="true" viewBox="0 0 24 24">
                                <g>
                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                </g>
                            </svg>
                        </button>
                    </div>


                </div>
                <div className={styles.imgs}>
                    {images?.map((image) => (
                        <img
                            key={image.id}
                            src={image.urls.regular}
                            alt={image.alt_description}
                            className={styles.img}
                            onClick={() => {
                                downloadAndCreateFileObjects(image, page)
                                close()
                            }}
                        />
                    ))}
                    <button className={styles.pagebtn} type='button' onClick={() => { setPageNumber(prev => prev - 1) }} disabled={currentPageNumber <= 1}>Back</button>
                    <button className={styles.pagebtn} type='button' onClick={() => { setPageNumber(prev => prev + 1) }}>Next</button>
                </div>
            </ModalForm>
        </ModalContainer >
    );
}

export default Unsplash;





