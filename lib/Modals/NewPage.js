import { useEditorContext } from "@/pages/page";
import { Maximize2, PanelRightDashed } from "lucide-react";
import Router from "next/router";
import { Suspense, lazy, useEffect, useState } from "react";
import { createPortal } from "react-dom";
const EditorV3 = lazy(() => import("@/components/editor/Editor3"))
export default function NewPageModal({ pageId }) {
    const { listedPageItems } = useEditorContext()
    const [filteredItems, setFilteredItems] = useState([]);
    useEffect(() => {
        const mainItem = listedPageItems.find((Apage) => Apage.id === pageId);
        let tree = [mainItem];
        let parent = mainItem;
        while (parent?.parentId) {
            parent = listedPageItems.find((Apage) => Apage.id === parent.parentId);
            if (parent) {
                tree.push(parent);
            } else {
                break;
            }
        }
        tree.reverse();
        setFilteredItems(tree);
    }, [listedPageItems, pageId]);
    return (
        <>
            {createPortal(
                <>
                    <div onClick={() => Router.push(`/page?edit=${new URLSearchParams(window.location.search).get("edit")}`)} className="backdrop-brightness-50  fixed top-0 left-0 z-[1] flex items-center justify-center w-full h-[100dvh] ">
                        <div onClick={(e) => e.stopPropagation()} className="animate-fade-in-slow-middle z-[2] relative w-[900px] max-w-[80%] bg-[var(--background)] h-[85dvh] shadow-xl rounded-xl overflow-hidden">
                            <div className="gap-2 absolute top-0 z-[2] p-2 min-h-[50px] shadow-xl w-full bg-zinc-50 flex text-zinc-800 w-full justify-end">
                                <div className="flex items-center text-zinc-800 w-full overflow-x-scrolly">
                                    {filteredItems.map((item, index) => (
                                        <>
                                            <div className="flex items-center justify-center relative cursor-pointer" key={index}>
                                                <div className="flex gap-1 items-center text-[14px] font-[600] text-zinc-600 rounded p-[0.5em] hover:bg-zinc-200">
                                                    {item?.icon && (
                                                        <div className="w-4 h-4 flex items-center justify-center">
                                                            {item?.icon && item?.icon.includes('.png') ? (<img src={`/emoji/twitter/64/${item?.icon}`} />) : (!isNaN(parseInt(item?.icon, 16)) && String.fromCodePoint(parseInt(item?.icon, 16)))}
                                                        </div>
                                                    )}
                                                    {item?.title || item?.id}
                                                </div>
                                            </div>
                                            {index < filteredItems.length - 1 && (
                                                <div className='text-zinc-300 flex items-center justify-center mx-1'>
                                                    /
                                                </div>
                                            )}
                                        </>
                                    ))}
                                </div>
                                <button onClick={() => { Router.push(`${window.location.pathname}?p=${pageId}&pm=s`) }} className="flex items-center justify-center py-1 px-3 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 bg-zinc-200">
                                    <PanelRightDashed className="w-4 h-4 mr-2" />
                                    Peek
                                </button>
                                <button onClick={() => { Router.push(`/page/${pageId}`) }} className="flex items-center justify-center py-1 px-3 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 bg-zinc-200">
                                    <Maximize2 className="w-4 h-4 mr-2" />
                                    Maximize
                                </button>
                            </div>
                            <Suspense>
                                <EditorV3 currentPage={pageId} />
                            </Suspense>
                        </div>
                    </div >
                </>,
                document.body
            )
            }
        </>
    )
}
