import { Settings, UserCircle } from 'lucide-react';
import SettingsPopover from '../Settings';
import pb from "@/lib/pocketbase"
export default function UserOptions({ clss }) {
    return (
        <>
            <div className={`${"relative sm:min-w-[260px] min-w-[100vw]  grid grid-cols-[1fr_3fr_1fr] items-center justify-items-center justify-between p-0 h-full text-[var(--userOptionText)] shadow bg-[var(--background)]"} ${clss}`}>
                <div className="flex items-center justify-center w-6 h-6 object-contain overflow-hidden rounded-[9999px]">
                    {pb.authStore.model?.avatar ? (
                        <img src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${pb.authStore.model?.id}/${pb.authStore.model?.avatar}?thumb=100x100`} />
                    ) : (
                        <UserCircle />
                    )}
                </div>
                <div className='select-none flex flex-col justify-center h-full ml-2 max-w-[156px]'>
                    <span className='text-xs text-ellipsis overflow-hidden w-[calc(1em_*_13)]'>{pb.authStore.model?.username || 'Example'}</span>
                    <span className='text-xs  font-light text-ellipsis overflow-hidden w-[calc(1em_*_13)]'>{pb.authStore.model?.email || 'example@youremail.com'}</span>
                </div>
                <div className="flex flex-col gap-1 relative">
                    <SettingsPopover>
                        <span className='sr-only'>Account settings</span>
                        <Settings className='w-4 h-4 cursor-pointer' />
                    </SettingsPopover>
                </div>
            </div>

        </>
    )
}
