import { Settings, UserCircle } from 'lucide-react';
import SettingsPopover from '../Settings';
import pb from "@/lib/pocketbase"
export default function UserOptions({ clss }) {
    return (
        <>
            <SettingsPopover>
                <div className={`${"relative w-fit flex items-center p-0 h-full font-[600] text-zinc-600"} ${clss}`}>
                    <div className="flex items-center relative">
                        <div className="flex items-center justify-center w-6 h-6 object-contain overflow-hidden rounded-[9999px]">
                            {pb.authStore.model?.avatar ? (
                                <img src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${pb.authStore.model?.id}/${pb.authStore.model?.avatar}?thumb=100x100`} />
                            ) : (
                                <UserCircle />
                            )}
                        </div>

                    </div>
                </div>
            </SettingsPopover>
        </>
    )
}
