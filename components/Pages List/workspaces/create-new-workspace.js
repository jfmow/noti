import Icons from "@/components/editor/Page-cover-buttons/Icons-and-list-color/Icons";
import { toaster } from "@/components/toast";
import { Button, Modal, ModalContent, ModalHeader, ModalTrigger, TextInput } from "@/components/UI";
import pb from "@/lib/pocketbase";
import { DropDownItem } from "@/lib/Pop-Cards/DropDown";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateNewWorkspace() {
    const [selectedIcon, setSelectedIcon] = useState("")

    const [selectorOpen, setSelectorOpen] = useState(false)

    async function createWorkspace(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        if (formData.get("icon") === "") {
            return toaster.error("You must select an icon")
        }
        formData.set("user", pb.authStore.model.id)
        const loadingToast = await toaster.loading("Creating workspace...")
        pb.collection('workspaces').create(formData).then((successRes) => {
            toaster.update(loadingToast, "Workspace created", "success")
        }, (errorRes) => {
            console.error(errorRes)
            toaster.update(loadingToast, "An error occurred creating the workspace", "error")
        })
    }

    return (
        <Modal>
            <ModalContent width="small">
                <ModalHeader>Create Workspace</ModalHeader>
                <form onSubmit={createWorkspace} className="flex items-center justify-center flex-col gap-2 px-2 pb-2 w-[350px] mx-auto">
                    <TextInput required className="w-full" placeholder="Workspace name" name="name" />
                    <div className="grid grid-cols-1 gap-2 w-full items-center justify-center">


                        <Button className="w-full" type="button" onClick={() => setSelectorOpen("icon")}>
                            Select a icon
                        </Button>

                        <input type="hidden" name="icon" value={selectedIcon} />
                    </div>
                    {selectorOpen === "icon" ? (
                        <div className="h-[300px] overflow-y-scroll overflow-x-hidden grid">
                            <Icons Select={(emoji) => setSelectedIcon(emoji.image)} Selected={selectedIcon} />
                        </div>
                    ) : null}

                    <Button type="submit" className="w-full">
                        <Plus />
                        Create
                    </Button>
                </form>
            </ModalContent>
            <ModalTrigger asChild>
                <DropDownItem>
                    <Plus />
                    New workspace
                </DropDownItem>
            </ModalTrigger>
        </Modal>
    )
}