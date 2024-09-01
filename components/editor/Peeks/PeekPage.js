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
                <div id="hidemewhenprinting" onClick={() => Router.push(window.location.pathname)} className="flex items-center justify-center w-full h-screen">
                    <div onClick={(e) => e.stopPropagation()} className="relative w-full bg-[var(--background)] h-full overflow-hidden">
                        <div className="overflow-x-hidden w-full h-[40px] min-h-[40px] max-h-[40px] z-[3] pl-2 pr-2 flex justify-between items-center bg-zinc-50 overflow-y-hidden">
                            <div></div>
                            <div className="flex items-center justify-end gap-1  min-w-[100px]">
                                <ToolTipCon>
                                    <ToolTipTrigger>
                                        <MenuBarButton onClick={() => {
                                            const queryParams = new URLSearchParams(window.location.search)
                                            queryParams.delete("pm")
                                            queryParams.delete("p")
                                            Router.push(`/page?${queryParams.toString()}`)
                                        }} type="button">
                                            <X />
                                        </MenuBarButton>
                                    </ToolTipTrigger>
                                    <ToolTip>
                                        Close
                                    </ToolTip>

                                </ToolTipCon>
                                <ToolTipCon>
                                    <ToolTipTrigger>
                                        <MenuBarButton onClick={() => { Router.push(`/page?edit=${pageId}`) }} type="button">
                                            <Maximize2 />
                                        </MenuBarButton>
                                    </ToolTipTrigger>
                                    <ToolTip>
                                        Fullscreen
                                    </ToolTip>
                                </ToolTipCon>
                            </div>
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