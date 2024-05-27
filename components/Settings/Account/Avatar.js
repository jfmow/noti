import { useSettingsPopoverContext } from "@/components/Settings";
import compressImage from "@/lib/CompressImg";
import { useReducer, useRef } from "react";
import { Pencil } from "lucide-react"

export default function Avatar() {
    const { pb, rerenderPage } = useSettingsPopoverContext()


    const fileInputRef = useRef(null);

    const handleEditAvatar = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const formData = new FormData();
            const compressedBlob = await compressImage(selectedFile);
            const compressedFile = new File([compressedBlob], selectedFile.name, { type: 'image/jpeg' });
            formData.append('avatar', compressedFile);

            try {
                const response = await pb.collection('users').update(pb.authStore.model.id, formData)
                await pb.collection('users').authRefresh();
                rerenderPage()
            } catch (error) {
                //console.log(error);
            }
        }
    };
    return (
        <div className="relative flex items-center justify-center w-14 h-14 overflow-hidden rounded-[9999px] group">
            <img
                src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}?thumb=100x100`}
                alt="Avatar"
                className="w-full h-full object-fill"
            />
            <div
                className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[2] items-center justify-center bg-gray-50/70 cursor-pointer hidden group-hover:flex"
                onClick={handleEditAvatar}
            >
                <Pencil className="opacity-50" />
            </div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}