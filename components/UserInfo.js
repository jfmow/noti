import AccountButtons from './user/AccountButtons2';
import { DropDown, DropDownContainer, DropDownSectionTitle, DropDownTrigger } from '@/lib/Pop-Cards/DropDown';
import UserHelpModal from '@/components/user/ThemePicker'
import { useEditorContext } from '@/pages/page/[...id]';
export default function UserOptions({ clss }) {
    const { pb } = useEditorContext()
    return (
        <>
            <div className={`${"relative w-full sm:w-[300px] flex items-center justify-around px-2 h-[70px] text-[var(--userOptionText)] border-t border-[var(--userinfoSectionBordertop)] bg-[var(--background)]"} ${clss}`}>
                <div className="flex items-center justify-center w-8 h-8 object-contain overflow-hidden rounded-[9999px]">
                    {pb.authStore.model?.avatar ? (
                        <img src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${pb.authStore.model?.id}/${pb.authStore.model?.avatar}?thumb=100x100`} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>)}
                </div>
                <div>
                    <span>{pb.authStore.model?.email || 'missing@youremail.com'}</span>
                </div>
                <div className="flex flex-col gap-1 relative">
                    <DropDownContainer>
                        <DropDownTrigger>
                            <span className="w-4 h-4 object-contain overflow-hidden cursor-pointer" aria-label='Theme picker button' >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" /><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" /><path d="M14.5 17.5 4.5 15" /></svg>
                            </span>
                        </DropDownTrigger>
                        <DropDown>
                            <DropDownSectionTitle>
                                Themes
                            </DropDownSectionTitle>
                            <UserHelpModal />
                        </DropDown>
                    </DropDownContainer>

                    <DropDownContainer>
                        <DropDownTrigger>
                            <span aria-label='Accout settings button' aria-haspopup className="w-4 h-4 cursor-pointer object-contain overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                            </span>
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
