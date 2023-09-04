import { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import debounce from "lodash/debounce"; // Import the debounce function from lodash
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)
export default function Draw({ pageId }) {
    const [Excalidraw, setExcalidraw] = useState(null);
    const [libaryItemsDefault, setDefaultLibraryItems] = useState([]);
    const [content, setContent] = useState([])

    useEffect(() => {


        // Load library items from local storage
        async function LoadData() {
            try {
                const record = await pb.collection('drawing_pads').getOne(pageId);
                setContent(record.content)
                console.log(record)
                const response = await fetch(decodedFragment);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsn = await response.json();

                // Append each item from jsn to the libraryItemsDefault state
                const setDefaultLibraryItems2 = [...record.lib, ...jsn.libraryItems.filter(item => {
                    // Check if an item with the same name exists in record.lib
                    return !record.lib.some(recordItem => recordItem.name === item.name);
                })];
                console.log(setDefaultLibraryItems2)
                setDefaultLibraryItems(setDefaultLibraryItems2)
            } catch (err) { }
        }
        LoadData()

        var fragment = window.location.hash;

        // Remove the "#" symbol if it exists at the beginning
        if (fragment.startsWith('#')) {
            fragment = fragment.slice(12);
        }

        var decodedFragment = decodeURIComponent(fragment);
        decodedFragment = decodedFragment.split('&')[0];


        import("@excalidraw/excalidraw").then((comp) => setExcalidraw(comp.Excalidraw));
    }, []);

    async function SaveLibraryItems(items) {
        try {
            const data = {
                "lib": items,
            };
            const record = await pb.collection('drawing_pads').update(pageId, data);
        } catch (err) { }
        //window.localStorage.setItem('libary', JSON.stringify(items))
    }

    // Define a debounced saveContent function
    const saveContentDebounced = debounce(saveContent, 500);

    async function saveContent(content) {
        console.log(content)
        try {
            const data = {
                "content": content,
                "lib": libaryItemsDefault
            };
            const record = await pb.collection('drawing_pads').update(pageId, data);
        } catch (err) { }
    }

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {Excalidraw && (
                <Excalidraw
                    initialData={{
                        elements: content,
                        libraryItems: libaryItemsDefault,
                        appState: { zenModeEnabled: false },
                        scrollToContent: true,
                    }}
                    onLibraryChange={(e) => {
                        // When library items change, save them to local storage
                        SaveLibraryItems(e);
                    }}
                    onChange={(e) => {
                        saveContentDebounced(e)
                    }}
                    libraryReturnUrl={`${process.env.NEXT_PUBLIC_CURRENTURL}/draw/${pageId}`}
                    generateIdForFile={(e) => {
                        console.log(e)
                        return 'https://i.natgeofe.com/n/5f35194b-af37-4f45-a14d-60925b280986/NationalGeographic_2731043_4x3.jpg'
                    }}
                />
            )}
        </div>
    );
}


export async function getServerSideProps({ params, req, res }) {
    // Check if params.id is null

    return {
        props: {
            pageId: params.id,
        },
    };
}


