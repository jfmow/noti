import AccountButtons from '@/components/user-info/Account';
import { DropDown, DropDownContainer, DropDownSectionTitle, DropDownTrigger } from '@/lib/Pop-Cards/DropDown';
import ThemePicker from '@/components/user-info/Themes'
import { useEditorContext } from '@/pages/page';
import { Paintbrush, Settings2, UserCircle } from 'lucide-react';
export default function UserOptions({ clss }) {
    const { pb } = useEditorContext()
    return (
        <>
            <div className={`${"relative w-full sm:w-full flex items-center justify-between px-4 md:px-2 h-[70px] text-[var(--userOptionText)] border-t border-[var(--userinfoSectionBordertop)] bg-[var(--background)]"} ${clss}`}>
                <div className='flex items-center h-full'>
                    <div className="flex items-center justify-center w-8 h-8 object-contain overflow-hidden rounded-[9999px]">
                        {pb.authStore.model?.avatar ? (
                            <img src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${pb.authStore.model?.id}/${pb.authStore.model?.avatar}?thumb=100x100`} />
                        ) : (
                            <UserCircle />
                        )}
                    </div>
                    <div className='flex flex-col justify-center h-full ml-2'>
                        <span className='text-sm text-ellipsis overflow-hidden w-[calc(1em_*_13)]'>{pb.authStore.model?.username || 'Example'}</span>
                        <span className='text-sm font-semibold underline text-ellipsis overflow-hidden w-[calc(1em_*_13)]'>{pb.authStore.model?.email || 'example@youremail.com'}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1 relative">
                    <DropDownContainer>
                        <DropDownTrigger>
                            <span className='sr-only'>Theme picker</span>
                            <Paintbrush className='w-4 h-4 cursor-pointer' />
                        </DropDownTrigger>
                        <DropDown>
                            <DropDownSectionTitle>
                                Themes
                            </DropDownSectionTitle>
                            <ThemePicker />
                        </DropDown>
                    </DropDownContainer>

                    <DropDownContainer>
                        <DropDownTrigger>
                            <span className='sr-only'>Account settings</span>
                            <Settings2 className='w-4 h-4 cursor-pointer' />
                        </DropDownTrigger>
                        <DropDown>
                            <AccountButtons />
                        </DropDown>
                    </DropDownContainer>
                </div>
            </div>

        </>
    )
}
