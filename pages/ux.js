import { MenuBarButton } from "@/components/editor/Menubar";
import Icons from "@/components/editor/Page-cover-buttons/Icons";
import { Button, CheckBox, Modal, ModalContent, ModalHeader, ModalTrigger, NumberInput, TextInput } from "@/components/UI";
import pb from "@/lib/pocketbase";
import { DropDown, DropDownContainer, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from "@/lib/Pop-Cards/DropDown";
import { Folder, Plus } from "lucide-react";
import { useState } from "react";

export default function UXComp() {
    const [selectedColor, setSelectedColor] = useState("")
    const [selectedIcon, setSelectedIcon] = useState("")

    const [selectorOpen, setSelectorOpen] = useState(false)

    function createWorkspace(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.set("user", pb.authStore.model.id)
        pb.collection('workspaces').create(formData)
    }

    return (
        <div className="bg-zinc-100 text-zinc-800 w-full h-screen p-2 flex items-center justify-center gap-1">
            <Modal>
                <ModalContent width="small">
                    <ModalHeader>Create Workspace</ModalHeader>
                    <form onSubmit={createWorkspace} className="flex items-center justify-center flex-col gap-2 px-2 pb-2 w-[350px] mx-auto">
                        <TextInput required className="w-full" placeholder="Workspace name" name="name" />
                        <div className="grid grid-cols-2 gap-2 w-full items-center justify-center">
                            <Button className="w-full" type="button" onClick={() => setSelectorOpen("color")}>
                                Select a color
                            </Button>

                            <Button className="w-full" type="button" onClick={() => setSelectorOpen("icon")}>
                                Select a icon
                            </Button>

                            <input type="hidden" name="color" value={selectedColor} />
                            <input type="hidden" name="icon" value={selectedIcon} />
                        </div>

                        {selectorOpen === "color" ? (
                            <div className="h-[300px] overflow-y-scroll">
                                <ColorSelector selectedColor={selectedColor} onSelectColor={(color) => setSelectedColor(color)} />
                            </div>
                        ) : null}
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

        </div>
    )
}

const colors = [
    '#FF00001a', // Red with opacity 1a

    '#00FF001a', // Green with opacity 1a

    '#0000FF1a', // Blue with opacity 1a

    '#FFFF001a', // Yellow with opacity 1a

    '#FF00FF1a', // Magenta with opacity 1a

    '#00FFFF1a', // Cyan with opacity 1a

    '#FFA5001a', // Orange with opacity 1a

    '#8000801a', // Purple with opacity 1a

    '#FFC0CB1a', // Pink with opacity 1a

    '#8080801a', // Gray with opacity 1a

    '#FFFFFF1a', // White with opacity 1a

    '#0000001a',

    '#49abff1a',


    '#60ff491a', // Light green with opacity 1a


    '#FF14931a', // Deep pink with opacity 1a

    '#0080001a', // Dark green with opacity 1a

    '#7B68EE1a', // Medium slate blue with opacity 1a

    '#FF45001a', // Orange red with opacity 1a

    '#1E90FF1a', // Dodger blue with opacity 1a

    '#BA55D31a', // Medium orchid with opacity 1a

    '#A9A9A91a', // Dark gray with opacity 1a

    '#FAEBD71a', // Antique white with opacity 1a

    '#8B45131a', // Saddle brown with opacity 1a

    '#EE82EE1a', // Violet with opacity 1a

    '#CD853F1a', // Peru with opacity 1a

    '#FF63471a', // Tomato with opacity 1a

    '#00CED11a', // Dark turquoise with opacity 1a

    '#4682B41a', // Sea green with opacity 1a

    '#FF7F501a', // Coral with opacity 1a

    '#48D1CC1a', // Medium turquoise with opacity 1a

    '#DAA5201a', // Goldenrod with opacity 1a

    '#2E8B571a', // Sea green (2) with opacity 1a

    '#FF69B41a', // Hot pink with opacity 1a

    '#DC143C1a', // Crimson with opacity 1a

];


function ColorSelector({ onSelectColor, selectedColor }) {
    return (
        <>
            <div style={{ height: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                {colors.map((color, index) => {
                    return (
                        <>
                            <div
                                key={index + 'norm'}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    background: color,
                                    margin: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => onSelectColor(color)}
                                className={selectedColor === color ? "border border-red-300 border-[2px]" : ""}
                            />
                        </>
                    );
                })}
            </div>
        </>
    );
};





