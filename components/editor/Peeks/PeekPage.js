import { ToolTip, ToolTipCon, ToolTipTrigger } from "@/components/UI/Tooltip";
import { MenuBarButton } from "@/components/editor/Menubar";
import { Maximize2, X } from "lucide-react";
import Router from "next/router";
import { Suspense, lazy } from "react";
const EditorV3 = lazy(() => import("@/components/editor/Editor"))
export default function PeekPageBlock({ pageId }) {
    return (
        <>
            <>
                <div onClick={() => Router.push(window.location.pathname)} className="pt-[40px] print:hidden print:collapse flex items-center justify-center w-full h-screen">
                    <div onClick={(e) => e.stopPropagation()} className="relative w-full bg-[var(--background)] h-full overflow-hidden">
                        <Suspense>
                            <EditorV3 currentPage={pageId} peek />
                        </Suspense>
                    </div>
                </div >
            </>

        </>
    )
}