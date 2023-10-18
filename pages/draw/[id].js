import { useState, useEffect } from "react";
import PocketBase from 'pocketbase'
import { toast } from "sonner";
import Router from "next/router";
import { debounce } from "lodash";
import Loader from "@/components/Loader";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation = false
export default function App({ page }) {
    const [Excalidraw, setExcalidraw] = useState(null);
    const [data, setData] = useState([]);
    const [libItemsState, setLibItemsState] = useState([]);

    useEffect(() => {
        async function getDrawPad() {
            let newLibItems = { libraryItems: [] };

            function hasAddLibraryParam(url) {
                return url.includes('#addLibrary');
            }

            if (hasAddLibraryParam(window.location.href)) {
                function getHashParams(url) {
                    const hashIndex = url.indexOf('#');
                    if (hashIndex !== -1) {
                        const hashParams = url.slice(hashIndex + 1).split('&');
                        const paramsObject = {};

                        hashParams.forEach(param => {
                            const [key, value] = param.split('=');
                            paramsObject[key] = decodeURIComponent(value);
                        });

                        return paramsObject;
                    }

                    return null;
                }

                const hashParams = getHashParams(window.location.href);
                if (hashParams) {
                    try {
                        const dt = await fetch(hashParams.addLibrary);
                        newLibItems = await dt.json();
                    } catch (error) {
                        console.error("Error fetching library items:", error);
                    }
                }
            }

            try {
                const record = await pb.collection('excaliDraw').getOne(page);
                delete record.appState.collaborators;
                const dateFromDatabase = new Date(record.lastUpdated);
                const localRecord = JSON.parse(window.localStorage.getItem(`drawpad-${page}`));
                let currentDate = null;

                if (localRecord) {
                    currentDate = new Date(localRecord.lastUpdated);
                }

                if (currentDate && record.lastUpdated) {
                    if (dateFromDatabase < currentDate) {
                        console.log("The date from the database is older than the current date.");
                        const updatedLocalRecord = { ...localRecord };
                        delete updatedLocalRecord.appState.collaborators;
                        setData({ ...updatedLocalRecord, libraryItems: [...record.libraryItems, ...newLibItems.libraryItems] });
                    } else if (dateFromDatabase > currentDate) {
                        console.log("The date from the database is newer than the current date.");
                        setData({ ...record, libraryItems: [...record.libraryItems, ...newLibItems.libraryItems] });
                    } else {
                        console.log("The dates are the same.");
                        setData({ ...record, libraryItems: [...record.libraryItems, ...newLibItems.libraryItems] });
                    }
                } else {
                    setData({ ...record, libraryItems: [...record.libraryItems, ...newLibItems.libraryItems] });
                }

                setLibItemsState([...record.libraryItems, ...newLibItems.libraryItems]);

            } catch (err) {
                console.error("Error fetching drawpad:", err);
            }
        }

        if (page === 'new' || !page) {
            NewDrawPad();
        } else {
            getDrawPad();
        }

        import("@excalidraw/excalidraw").then((comp) => setExcalidraw(comp.Excalidraw));
    }, []);


    const canvaschange = debounce(HandleCanvasChange, 200)

    async function NewDrawPad() {
        try {
            const data = {
                "owner": pb.authStore.model.id,
                "libraryItems": []
            };

            const record = await pb.collection('excaliDraw').create(data);
            Router.push(`/draw/${record.id}`);
        } catch (err) {
            console.error("Error creating drawpad:", err);
        }
    }

    async function HandleCanvasChange(data2, state, files) {
        if (!data2 || !state) {
            return
        }
        try {

            const data5 = {
                "elements": data2,
                "appState": state,
                "files": files,
                "libaryItems": libItemsState,
                "owner": pb.authStore.model.id,
                "lastUpdated": new Date().toISOString(),
                "state": "unsaved"
            };

            //const record = await pb.collection('excaliDraw').update(page, data5);
            window.localStorage.setItem(`drawpad-${page}`, JSON.stringify(data5))

        } catch (err) {
            if (err.status === 0) {
                return
            }
            toast.error('Unable to save drawpad')
        }
    }

    if (!data || !Excalidraw) {
        return <Loader />
    }

    return <div style={{ width: '100%', height: '100dvh' }}>
        {Excalidraw && data &&
            <Excalidraw
                onChange={canvaschange}
                initialData={data.elements ? { elements: data?.elements, appState: data?.appState, files: data?.files, libraryItems: data?.libraryItems } : {}}
            />
        }
    </div>;
}

export async function getServerSideProps({ params }) {
    return {
        props: {
            page: params.id,
        },
    };
}

