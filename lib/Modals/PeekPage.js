import { MenuBarButton } from "@/components/editor/Menubar";
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
                        <div className="gap-2 z-[2] p-2 h-[40px] shadow-xl w-full bg-zinc-50 flex text-zinc-800 w-full justify-end">
                            <MenuBarButton onClick={() => { Router.push(window.location.pathname) }} type="button">
                                <X />
                            </MenuBarButton>
                            <MenuBarButton onClick={() => { Router.push(`/page?edit=${pageId}`) }} type="button">
                                <Maximize2 />
                            </MenuBarButton>
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