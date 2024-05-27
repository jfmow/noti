import { Button, useSettingsPopoverContext } from "@/components/Settings"
import { toaster } from "@/components/toast"
import { useEditorContext } from "@/pages/page"
import Router from "next/router"

export default function Pages() {
    const { pb, rerenderPage } = useSettingsPopoverContext()
    const { setShowArchivedPages } = useEditorContext()

    return (
        <div className="grid p-1 gap-4">
            <div className="border-t pt-2">
                <h3 className="text-sm w-full">Pages</h3>
            </div>
            <div className="flex justify-between items-center">
                <div className="grid">
                    <span className="font-medium text-sm text-zinc-600">Show archived pages</span>
                    <span className="font-medium text-xs">(This session only)</span>
                </div>
                <Button onClick={() => setShowArchivedPages(prev => !prev)}>
                    Toggle
                </Button>
            </div>
        </div>
    )
}



