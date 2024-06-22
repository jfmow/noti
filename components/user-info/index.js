import { Settings2, UserCircle } from 'lucide-react';
import SettingsPopover from '../Settings';
import pb from "@/lib/pocketbase"
export default function UserOptions({ clss }) {
    return (
        <>
            <div className={`${"relative w-full sm:w-full flex items-center justify-between p-2 h-[70px] text-[var(--userOptionText)] border-t border-[var(--userinfoSectionBordertop)] bg-[var(--background)]"} ${clss}`}>
                <div className='flex items-center h-full'>
                    <div className="flex items-center justify-center w-8 h-8 object-contain overflow-hidden rounded-[9999px]">
                        {pb.authStore.model?.avatar ? (
                            <img src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${pb.authStore.model?.id}/${pb.authStore.model?.avatar}?thumb=100x100`} />
                        ) : (
                            <UserCircle />
                        )}
                    </div>
                    <div className='select-none flex flex-col justify-center h-full ml-2'>
                        <span className='text-sm text-ellipsis overflow-hidden w-[calc(1em_*_13)]'>{pb.authStore.model?.username || 'Example'}</span>
                        <span className='text-xs  font-light text-ellipsis overflow-hidden w-[calc(1em_*_13)]'>{pb.authStore.model?.email || 'example@youremail.com'}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1 relative">
                    <SettingsPopover>
                        <span className='sr-only'>Account settings</span>
                        <Settings2 className='w-4 h-4 cursor-pointer' />
                    </SettingsPopover>
                </div>
            </div>

        </>
    )
}
