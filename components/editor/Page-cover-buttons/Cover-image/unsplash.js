import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import Link from '@/components/Link';
import { toaster } from '@/components/toast';
import { Button, TextInput } from '@/components/UI';
import { SendPageChanges } from '@/lib/Page state manager';


export default function Unsplash({ page }) {
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

        try {
            SendPageChanges(page, { "unsplash": fullImageUrl, header_img: null });
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

    return (
        <>
            <TextInput
                className="w-full mb-2"
                placeholder="Search for an image..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        debouncedSearch();
                    }
                }}
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex flex-wrap items-center justify-between overflow-y-scroll overflow-x-hidden max-h-[200px]">
                {images?.map((image) => (
                    <div key={image.id} className={`${loading === image.id && "opacity-45"} ${"p-1 w-[100px] flex flex-col relative object-cover overflow-hidden"}`}>
                        <img
                            src={image.urls.raw + '?q=65&w=200'}
                            alt={image.alt_description}
                            onClick={() => !loading && downloadAndCreateFileObjects(image)}
                            onLoad={() => setLoading(false)}
                            className='rounded w-full h-full cursor-pointer'
                        />
                        <Link target={'_blank'} href={image.user.links.html + `?utm_source=${process.env.NEXT_PUBLIC_CURRENTURL}&utm_medium=referral`} className="inline overflow-hidden text-ellipsis text-[8px] text-nowrap">
                            Photo by: <span className="underline">{image.user.name}</span>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center gap-3 w-full mt-4">
                <Button type="button" onClick={() => setPageNumber((prev) => prev - 1)} disabled={currentPageNumber <= 1}>
                    Back
                </Button>
                <Button type="button" onClick={() => setPageNumber((prev) => prev + 1)} disabled={currentPageNumber >= totalPages || totalPages === -1}>
                    Next
                </Button>
            </div>
        </>
    );
}
