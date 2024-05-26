import { Maximize2, X } from "lucide-react";
import Router from "next/router";
import { Suspense, lazy } from "react";
const EditorV3 = lazy(() => import("@/components/editor/Editor"))
export default function PeekPageBlock({ pageId }) {
    return (
        <>
            <>
                <div onClick={() => Router.push(window.location.pathname)} className="flex items-center justify-center w-full h-screen">
                    <div onClick={(e) => e.stopPropagation()} className="relative w-full bg-[var(--background)] h-full overflow-hidden">
                        <div className="gap-2 z-[2] p-2 min-h-[45px] shadow-xl w-full bg-zinc-50 flex text-zinc-800 w-full justify-end">
                            <button onClick={() => { Router.push(window.location.pathname) }} className="flex items-center justify-center py-1 px-3 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 bg-zinc-200">
                                <X className="w-4 h-4 mr-2" />
                                Close
                            </button>
                            <button onClick={() => { Router.push(`/page?edit=${pageId}`) }} className="flex items-center justify-center py-1 px-3 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 bg-zinc-200">
                                <Maximize2 className="w-4 h-4 mr-2" />
                                Maximize
                            </button>
                        </div>
                        <Suspense>
                            <EditorV3 currentPage={pageId} peek />
                        </Suspense>
                    </div>
                </div >
            </>

        </>
    )
}