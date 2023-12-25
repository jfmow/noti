import dynamic from 'next/dynamic';
import styles from "@/styles/Create.module.css";
import { useState } from "react";
import { ToolTip, ToolTipCon, ToolTipTrigger } from "@/components/UX-Components/Tooltip";
import { useEditorContext } from "@/pages/page/[...id]";
import { DropDown, DropDownContainer, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from "@/lib/Pop-Cards/DropDown";
import { Paragraph } from "@/components/UX-Components";
import { PopUpTrigger, Popup, PopupContainer } from "@/lib/Pop-Cards/Popup";
import { TabContent, TabGroup, TabMenu, TabMenuItem, TabsProvider, Tabtrigger } from "@/lib/Pop-Cards/Tabs";
import Img from "@/components/editor/Menu/Img"
import Icons from "@/components/editor/Menu/Icons"
import Gradient from '@/components/editor/Menu/gradient/adient';
import ColorSelector from '@/components/editor/Menu/ColorSelector';
import { openPageContext } from '../Editor3';
import { toaster } from '@/components/toast';

export default function MenuButtons() {
    const { pb, currentPage, setListedPageItems } = useEditorContext()
    const { openPageData, setOpenPageData, updateOpenPageData } = openPageContext()

    async function setHeader(img) {
        setOpenPageData(prevData => {
            return { ...prevData, header_img: "", unsplash: img }
        })
    }

    async function updateIcon(newIcon = '') {
        if (!newIcon) {
            return new Error('Please include a new icon')
        }
        try {
            setListedPageItems(prevItems => {
                return prevItems.map((item) => {
                    if (item.id === currentPage) {
                        return { ...item, icon: newIcon.image }
                    } else {
                        return item
                    }
                })
            })
            await pb.collection('pages').update(currentPage, { icon: newIcon.image });
        } catch {
            return new Error('Something went wrong updating the page icon')
        }
    }

    async function updateColor(newColor = '') {
        if (!newColor) {
            return new Error('No color provided')
        }
        try {
            setListedPageItems(prevItems => {
                return prevItems.map((item) => {
                    if (item.id === currentPage) {
                        return { ...item, color: newColor }
                    } else {
                        return item
                    }
                })
            })
            await pb.collection('pages').update(currentPage, { color: newColor });
        } catch {
            return new Error('An error occured while updating page color')
        }
    }

    async function customHeaderHandler(e) {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = (event) => {
            setHeader(event.target.result);
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
                setOpenPageData(prevData => {
                    return { ...prevData, header_img: "", unsplash: compressedFile }
                })
                await pb.collection("pages").update(currentPage, formData);

            } catch (error) {
                toaster.error(loadingToast, "Error uploading header image, please try again.", "error");
            }
        }
    }

    return (
        <>
            <ToolTipCon>
                <DropDownContainer>
                    <ToolTipTrigger>
                        <DropDownTrigger>
                            <button
                                aria-label="Page cover options"
                                type="button"
                                className={styles.title_buttons_btn}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallpaper"><circle cx="8" cy="9" r="2" /><path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
                            </button>
                        </DropDownTrigger>
                    </ToolTipTrigger>
                    <ToolTip>
                        Change cover
                    </ToolTip>
                    <DropDown>
                        <DropDownSectionTitle>
                            Page cover
                        </DropDownSectionTitle>
                        <DropDownSection>
                            <PopupContainer>
                                <PopUpTrigger>
                                    <DropDownItem>
                                        <svg width="24" height="24" viewBox="0 0 32 32" version="1.1" aria-labelledby="unsplash-home" aria-hidden="false"><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg>
                                        <p>Unsplash</p>
                                    </DropDownItem>
                                </PopUpTrigger>
                                <Popup style={{ width: 520, height: 400 }}>
                                    <h1>Unsplash covers</h1>
                                    <Paragraph>
                                        Chose a cover for your page from unsplash's image libary
                                    </Paragraph>
                                    <Img setArticleHeader={setHeader} page={currentPage} />
                                </Popup>
                            </PopupContainer>
                            <PopupContainer>
                                <PopUpTrigger >
                                    <DropDownItem>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush-2"><path d="M14 19.9V16h3a2 2 0 0 0 2-2v-2H5v2c0 1.1.9 2 2 2h3v3.9a2 2 0 1 0 4 0Z" /><path d="M6 12V2h12v10" /><path d="M14 2v4" /><path d="M10 2v2" /></svg>
                                        <p>Gradient</p>
                                    </DropDownItem>
                                </PopUpTrigger>
                                <Popup style={{ width: 520, height: 400 }}>
                                    <h1>Gradient covers</h1>
                                    <Paragraph>
                                        Choose a gradient cover for your page
                                    </Paragraph>
                                    <Gradient setArticleHeader={setHeader} page={currentPage} pb={pb} />
                                </Popup>
                            </PopupContainer>


                            <DropDownItem>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                <label className={styles.customfileupload} >
                                    <input
                                        type="file"
                                        name="file"
                                        id="fileInput"
                                        accept="image/*"
                                        className={styles.finput}
                                        onChange={customHeaderHandler}
                                    />
                                    <p>Custom</p>
                                </label>
                            </DropDownItem>
                        </DropDownSection>
                    </DropDown>
                </DropDownContainer>
            </ToolTipCon>

            <ToolTipCon>
                <TabsProvider>
                    <ToolTipTrigger>
                        <Tabtrigger>
                            <button
                                aria-label="Customise page menu opener"
                                type="button"
                                className={styles.title_buttons_btn}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
                            </button>
                        </Tabtrigger>
                    </ToolTipTrigger>
                    <ToolTip>
                        Page customisation
                    </ToolTip>

                    <TabGroup>
                        <TabMenu>
                            <TabMenuItem for="icon">
                                Icons
                            </TabMenuItem>
                            <TabMenuItem for="color">
                                Color
                            </TabMenuItem>
                        </TabMenu>
                        <TabContent name="icon">
                            <>
                                <Icons Select={updateIcon} />
                            </>
                        </TabContent>
                        <TabContent name="color">
                            <ColorSelector onSelectColor={updateColor} page={currentPage} />
                        </TabContent>
                    </TabGroup>
                </TabsProvider>

            </ToolTipCon>
        </>
    )
}