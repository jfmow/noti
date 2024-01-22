import { Maximize2, PanelRightDashed } from "lucide-react";
import Router from "next/router";
import { Suspense, lazy } from "react";
import { createPortal } from "react-dom";
const EditorV3 = lazy(() => import("@/components/editor/Editor3"))
export default function NewPageModal({ pageId }) {
    return (
        <>
            {createPortal(
                <>
                    <div onClick={() => Router.push(window.location.pathname)} className="backdrop-brightness-50  fixed top-0 left-0 z-[1] flex items-center justify-center w-full h-[100dvh] ">
                        <div onClick={(e) => e.stopPropagation()} className="animate-fade-in-slow-middle z-[2] relative w-[900px] max-w-[80%] bg-[var(--background)] h-[85dvh] shadow-xl rounded-xl overflow-hidden">
                            <div className="gap-2 absolute top-0 z-[2] p-2 min-h-[50px] shadow-xl w-full bg-zinc-50 flex text-zinc-800 w-full justify-end">
                                <button onClick={() => { Router.push(`${window.location.pathname}?peekPage=${pageId}`) }} className="flex items-center justify-center py-1 px-3 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 bg-zinc-200">
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
