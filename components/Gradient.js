import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import styles from '@/styles/Unsplashpicker.module.css';
import Link from './Link';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);

export default function Gradient({ page, setArticleHeader, close }) {
    const [images, setImages] = useState([]);
    useEffect(() => {
        fetchImages()
    }, [])

    // Create a debounced version of handleSearch

    function randomColor() {
        let hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50; // Minimum saturation of 50%
        const lightness = Math.floor(Math.random() * 50) + 50; // Minimum lightness of 50%

        if (hue >= 180 && hue <= 240) {
            hue = (hue + 120) % 360;
        }

        return `hsla(${hue},${saturation}%,${lightness}%,1)`;
    }

    async function generateRandomMeshGradient(width, height, numSteps) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Generate random colors for the gradient
        const colors = [];
        for (let i = 0; i < numSteps; i++) {
            colors.push(randomColor());
        }

        // Create the gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        const stepSize = 1 / (numSteps - 1);
        for (let i = 0; i < numSteps; i++) {
            gradient.addColorStop(i * stepSize, colors[i]);
        }

        // Fill the canvas with the gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Export the canvas as a data URL
        const dataURL = canvas.toDataURL();
        return dataURL;
    }

    // Function to convert data URL to Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    async function fetchImages() {
        try {
            const numGradients = 10;
            const gradientPromises = [];

            for (let index = 0; index < numGradients; index++) {
                const gradientPromise = generateRandomMeshGradient(1920, 1080, 5).then((gradientVal) => ({
                    data: gradientVal,
                    id: self.crypto.randomUUID(),
                }));
                gradientPromises.push(gradientPromise);
            }

            const gradientsGen = await Promise.all(gradientPromises);
            setImages(gradientsGen);
        } catch (error) {
            console.error('Error creating gradients:', error);
        }
    }



    async function getFile(data) {
        const blob = dataURItoBlob(data)
        const file = new File([blob], 'generated-gradient.png', { type: blob.type });
        console.log(file);
        const reader = new FileReader();
        reader.onload = () => {
            setArticleHeader(reader.result);
        };
        reader.readAsDataURL(file);
        return file
    }

    async function uploadGradient(data) {
        const file = await getFile(data)
        let formData = new FormData()
        formData.append("header_img", file)
        formData.append("unsplash", "")
        const record = await pb.collection('pages').update(page, formData);
    }



    function Image({ image }) {
        return (
            <>
                <div className={` ${styles.img}`}>
                    <img
                        key={image.id}
                        src={image.data}
                        style={{ width: '106px', height: '64px' }}
                        onClick={() => {
                            uploadGradient(image.data)
                        }}
                    //style={loading ? ({ width: 0, height: 0 }) : (null)}
                    //onLoad={(e) => {
                    //    setLoading(false)
                    //}}
                    />
                    {/*{loading && (
                        <img src={handleBlurHashChange({ hash: image.blur_hash, width: 200, height: 64 })} />
                    )}*/}
                    <Link href='' className={styles.author}>Gradient randomly generated</Link>
                </div>
            </>
        )
    }

    async function RemoveCover() {
        const data = {
            "unsplash": "",
            "header_img": null
        };

        const record = await pb.collection('pages').update(page, data);
        setArticleHeader(null)
    }



    return (
        <>
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
                <button className={`${styles.pagebtn}`} type='button' onClick={() => fetchImages()}>Refresh {`(make more)`}</button>
                <button className={`${styles.pagebtn} ${styles.pagebtn_dark}`} type='button' onClick={() => RemoveCover()}>Remove cover</button>
            </div>
        </>
    );
}
