import { useState } from "react"
import { Modal, ModalContent, ModalTrigger } from '@/lib/Modals/Modal';
import { useEditorContext } from '@/pages/page/[...id]';
import { updateListedPages } from '../Item';
import { Paragraph } from '../UX-Components';
import { ToolTip, ToolTipCon, ToolTipTrigger } from '../UX-Components/Tooltip';
import { toaster } from "@/components/toast";
import { DropDownItem, DropDownSection } from '@/lib/Pop-Cards/DropDown';
export default function DeletedPagesManager() {
    const { pb } = useEditorContext()
    const [itemLoading, setItemLoading] = useState([])
    const { listedPageItems, setListedPageItems } = useEditorContext()
    async function handleRecoverDeletedPage(item) {
        const loadingToast = await toaster.loading('Restoring page...')
        try {
            if (!itemLoading.includes(item.id)) {
                setItemLoading([...itemLoading, item.id])
                await pb.collection("pages").update(item.id, { deleted: false })
                setListedPageItems(updateListedPages(item.id, { deleted: false }, listedPageItems))
                toaster.update(loadingToast, 'Page restored', "success")
            }
        } catch {
            toaster.update(loadingToast, 'An error occured while attempting to recover the page', "error")
        }
        setItemLoading([...itemLoading.filter(item2 => item2 !== item.id)])

    }
    async function handlePermaDeletePage(item) {
        const loadingToast = await toaster.loading('Deleting page...')
        try {
            if (!itemLoading.includes(item.id)) {
                setItemLoading([...itemLoading, item.id])
                await pb.collection("pages").delete(item.id)
                setListedPageItems(listedPageItems.filter((page) => page.id !== item.id))
                toaster.update(loadingToast, 'Page deleted', "success")
            }
        } catch {
            toaster.update(loadingToast, 'An error occured while attempting to delete the page', "error")
        }
        setItemLoading([...itemLoading.filter(item2 => item2 !== item.id)])

    }
    return (
        <DropDownSection>
            <Modal>
                <ModalTrigger>
                    <DropDownItem>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                        Recover pages
                    </DropDownItem>
                </ModalTrigger>
                <ModalContent>
                    <h1>Deleted pages</h1>
                    <Paragraph>Recover your deleted pages here</Paragraph>
                    <div style={{ maxHeight: '50svh', overflowY: 'scroll', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {listedPageItems.filter(item => item.deleted).map((item) => (
                            <div style={{ display: 'grid', gridTemplateColumns: '8fr 1fr 1fr' }}>
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    <div aria-label='Page icon' style={{ display: 'flex', alignItems: 'center' }}>
                                        {item.icon && item.icon.includes('.png') ? (<img width={18} height={18} src={`/emoji/twitter/64/${item.icon}`} />) : (!isNaN(parseInt(item.icon, 16)) && String.fromCodePoint(parseInt(item.icon, 16)))}
                                    </div>
                                    {item.title || item.id}
                                </div>
                                <ToolTipCon>
                                    <ToolTipTrigger>
                                        <DropDownItem onClick={() => handlePermaDeletePage(item)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg style={{ margin: 0 }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        </DropDownItem>
                                    </ToolTipTrigger>
                                    <ToolTip>
                                        Delete permantly
                                    </ToolTip>
                                </ToolTipCon>
                                <ToolTipCon>
                                    <ToolTipTrigger>
                                        <DropDownItem onClick={() => handleRecoverDeletedPage(item)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg style={{ margin: 0 }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                        </DropDownItem>
                                    </ToolTipTrigger>
                                    <ToolTip>
                                        Restore
                                    </ToolTip>
                                </ToolTipCon>
                            </div>
                        )
                        )}
                    </div>
                </ModalContent>
            </Modal>


        </DropDownSection>
    )
}