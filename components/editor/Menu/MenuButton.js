import { PopUpCardDropMenuSection, PopUpCardDropMenuSectionItem, PopUpCardDropMenuSectionTitle, PopUpCardDropMenuStaticPos, PopDropMenuStatic } from "@/lib/Pop-Cards/PopDropMenu";

import dynamic from 'next/dynamic';
import styles from "@/styles/Create.module.css";
import compressImage from "@/lib/CompressImg";
import { useState } from "react";
import { toaster } from "@/components/toasty";

const TabbedDropMenuItem = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuItem));
const TabbedDropMenuItemSurround = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuItemSurround));
const TabbedDropMenuSelectorOptions = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuSelectorOptions));
const TabbedDropMenuStaticPos = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuStaticPos));
const TabbedDropMenuStaticPosSelectorSurround = dynamic(() => import('@/lib/Pop-Cards/Tabbed').then((module) => module.TabbedDropMenuStaticPosSelectorSurround));


const PopUpCardCorner = dynamic(() => import('@/lib/Pop-Cards/PopUpCard').then((module) => module.PopUpCardCorner));
const PopUpCardSubTitle = dynamic(() => import('@/lib/Pop-Cards/PopUpCard').then((module) => module.PopUpCardSubTitle));
const PopUpCardTitle = dynamic(() => import('@/lib/Pop-Cards/PopUpCard').then((module) => module.PopUpCardTitle));

const Gradient = dynamic(() => import("@/components/editor/Menu/gradient/adient"), {
    ssr: true,
});
const Icons = dynamic(() => import("@/components/editor/Menu/Icons"), {
    ssr: true,
});
const Img = dynamic(() => import("@/components/editor/Menu/Img"), {
    ssr: true,
});
const ColorSelector = dynamic(() => import("@/components/editor/Menu/ColorSelector"), {
    ssr: true,
});


export default function MenuButtons({ listedPageItems, setListedPageItems, pb, page, currentPageIconValue, setArticleHeader, setCurrentPageIconValue }) {


    //Modal states
    const [iconModalState, setIconModalState] = useState(false);


    const [popUpEmojiState, setPopUpEmojiState] = useState({ activeItem: 'Icons', active: false })

    //PopUps
    const [popUpClickEventUnsplash, setpopUpClickEventUnsplash] = useState(null)
    const [popUpClickEventGradient, setpopUpClickEventGradient] = useState(null)
    const [popUpClickEventEmoji, setpopUpClickEventEmoji] = useState(null)
    const [popUpClickEventPageCoverOptions, setpopUpClickEventPageCoverOptions] = useState(null)





    async function handlePageHeaderImageUpload(e) {
        toaster.toast("Uploading...", "loading", { id: "upload" })

        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            setArticleHeader(event.target.result);
        };
        reader.readAsDataURL(file);
        let formData = new FormData();
        if (file) {

            try {
                const compressedBlob = await compressImage(file, 200); // Maximum file size in KB (100KB in this example)
                const compressedFile = new File([compressedBlob], file.name, {
                    type: "image/jpeg",
                });
                formData.append("header_img", compressedFile);
                formData.append("unsplash", '');
                //if (compressedFile.size > 4547000) {
                //    return toast.error('Compresed file may be too big (>4.5mb)!')
                //}
                await pb.collection("pages").update(page, formData);

                toaster.dismiss("upload")
                toaster.toast("Image uploaded successfully!", "success")

            } catch (error) {
                toaster.dismiss("upload")
                toaster.toast("Error uploading header img", "error");
            }
        }
    }


    async function handleChangePageListDisplayColor(color, page) {
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const oldItem = listedPageItems.filter((item) => item.id === page)[0]
            const filteredItems = prevItems.filter(item => item.id !== oldItem.id);

            // Add the new record at the appropriate position based on its created date
            let insertIndex = filteredItems.findIndex(item => item.created < oldItem.created);
            if (insertIndex === -1) {
                insertIndex = filteredItems.length;
            }

            return [
                ...filteredItems.slice(0, insertIndex),
                { ...oldItem, color: color },
                ...filteredItems.slice(insertIndex)
            ];
            //return [...prevItems.filter(item => item.id !== page), { ...oldItem, icon: `${e.unified}.png` }]
        })
        const data = {
            "color": color
        };

        await pb.collection('pages').update(page, data);
    }
    async function handlePageDisplayIconChange(e) {
        setCurrentPageIconValue(`${e.unified}.png`)
        const data = {
            icon: e.image,
        };
        //icon.codePointAt(0).toString(16)
        setIconModalState(false);
        await pb.collection("pages").update(page, data);
        setListedPageItems(prevItems => {
            // Remove any previous item with the same ID
            const oldItem = listedPageItems.filter((item) => item.id === page)[0]
            const filteredItems = prevItems.filter(item => item.id !== oldItem.id);

            // Add the new record at the appropriate position based on its created date
            let insertIndex = filteredItems.findIndex(item => item.created < oldItem.created);
            if (insertIndex === -1) {
                insertIndex = filteredItems.length;
            }

            return [
                ...filteredItems.slice(0, insertIndex),
                { ...oldItem, icon: `${e.unified.toLowerCase()}.png` },
                ...filteredItems.slice(insertIndex)
            ];
            //return [...prevItems.filter(item => item.id !== page), { ...oldItem, icon: `${e.unified}.png` }]
        })
    }

    return (
        <>
            <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Cover options</div>
                <button
                    aria-label="Page cover options"
                    type="button"
                    onClick={(e) => setpopUpClickEventPageCoverOptions(e)}
                    className={styles.title_buttons_btn}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallpaper"><circle cx="8" cy="9" r="2" /><path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
                </button>

                <PopUpCardDropMenuStaticPos animationOrgin={'top right'} mobilepos={{
                    top: `70px`,
                    left: `0`,
                    width: `200px`,
                    position: 'absolute',
                    zIndex: '5',
                }} style={{ position: 'absolute', right: '0', top: '50px' }} event={popUpClickEventPageCoverOptions} className={styles.title_buttons_btn}>
                    <PopUpCardDropMenuSectionTitle>
                        Page cover
                    </PopUpCardDropMenuSectionTitle>
                    <PopUpCardDropMenuSection>
                        <PopUpCardDropMenuSectionItem
                            onClick={(e) => setpopUpClickEventUnsplash(e)}>
                            <svg width="24" height="24" viewBox="0 0 32 32" version="1.1" aria-labelledby="unsplash-home" aria-hidden="false"><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg>
                            <p>Unsplash</p>
                        </PopUpCardDropMenuSectionItem>
                        <PopUpCardDropMenuSectionItem
                            onClick={(e) => setpopUpClickEventGradient(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush-2"><path d="M14 19.9V16h3a2 2 0 0 0 2-2v-2H5v2c0 1.1.9 2 2 2h3v3.9a2 2 0 1 0 4 0Z" /><path d="M6 12V2h12v10" /><path d="M14 2v4" /><path d="M10 2v2" /></svg>
                            <p>Gradient</p>
                        </PopUpCardDropMenuSectionItem>
                        <PopUpCardDropMenuSectionItem>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                            <label className={styles.customfileupload} >
                                <input
                                    type="file"
                                    name="file"
                                    id="fileInput"
                                    accept="image/*"
                                    className={styles.finput}
                                    onChange={handlePageHeaderImageUpload}
                                />
                                <p>Custom</p>
                            </label>
                        </PopUpCardDropMenuSectionItem>
                    </PopUpCardDropMenuSection>

                </PopUpCardDropMenuStaticPos>
                <PopUpCardCorner event={popUpClickEventUnsplash} className={styles.title_buttons_btn}>
                    <PopUpCardTitle>Unsplash</PopUpCardTitle>
                    <PopUpCardSubTitle>Choose a cover image for your page.</PopUpCardSubTitle>
                    {popUpClickEventUnsplash && (
                        <Img setArticleHeader={setArticleHeader} page={page} />
                    )}

                </PopUpCardCorner>
                <PopUpCardCorner event={popUpClickEventGradient} className={styles.title_buttons_btn}>
                    <PopUpCardTitle>Gradients</PopUpCardTitle>
                    <PopUpCardSubTitle>Choose a gradient cover for your page.</PopUpCardSubTitle>
                    {popUpClickEventGradient && (
                        <Gradient setArticleHeader={setArticleHeader} page={page} pb={pb} />
                    )}

                </PopUpCardCorner>
            </div>

            <div className={styles.buttonlabel}>
                <div className={styles.buttonlabel_label}>Customise</div>
                <button
                    aria-label="Customise page menu opener"
                    type="button"
                    onClick={(e) => setpopUpClickEventEmoji(e)}
                    className={styles.title_buttons_btn}
                    onMouseOver={() => setPopUpEmojiState({ ...popUpEmojiState, active: true })
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
                </button>
                <TabbedDropMenuStaticPos mobilepos={{
                    top: `50px`,
                    right: `0`,
                    width: `100%`,
                }} event={popUpClickEventEmoji} style={{ position: 'absolute', right: 0, top: '50px' }}>
                    <TabbedDropMenuStaticPosSelectorSurround>
                        <TabbedDropMenuSelectorOptions active={popUpEmojiState.activeItem === 'Icons'} click={() => setPopUpEmojiState({ ...popUpEmojiState, activeItem: 'Icons' })}>
                            Page Icon
                        </TabbedDropMenuSelectorOptions>
                        <TabbedDropMenuSelectorOptions active={popUpEmojiState.activeItem === 'Color'} click={() => setPopUpEmojiState({ ...popUpEmojiState, activeItem: 'Color' })}>
                            Color
                        </TabbedDropMenuSelectorOptions>
                    </TabbedDropMenuStaticPosSelectorSurround >
                    <TabbedDropMenuItemSurround>
                        <TabbedDropMenuItem active={popUpEmojiState.activeItem === 'Icons'}>
                            {(popUpEmojiState.activeItem === 'Icons' && popUpClickEventEmoji !== null) || popUpEmojiState.active ? (
                                <>
                                    <Icons Select={handlePageDisplayIconChange} Selected={`${currentPageIconValue.toString()}`} />
                                </>
                            ) : (
                                <div className={styles.LongBarLoaderDiv}>
                                    <div className={styles.LongBarLoader}></div>
                                </div>
                            )}
                        </TabbedDropMenuItem>
                        <TabbedDropMenuItem active={popUpEmojiState.activeItem === 'Color'}>
                            <ColorSelector onSelectColor={handleChangePageListDisplayColor} page={page} />
                        </TabbedDropMenuItem>
                    </TabbedDropMenuItemSurround>
                </TabbedDropMenuStaticPos>
            </div>
        </>
    )
}