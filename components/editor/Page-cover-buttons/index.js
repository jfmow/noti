import { ToolTip, ToolTipCon, ToolTipTrigger } from "@/components/UI/Tooltip";
import { DropDown, DropDownContainer, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from "@/lib/Pop-Cards/DropDown";
import { Paragraph } from "@/components/UI";
import { PopUpTrigger, Popup, PopupContainer } from "@/lib/Pop-Cards/Popup";
import { TabContent, TabGroup, TabMenu, TabMenuItem, TabsProvider, Tabtrigger } from "@/lib/Pop-Cards/Tabs";
import Img from "@/components/editor/Page-cover-buttons/Cover-image/unsplash"
import Icons from "@/components/editor/Page-cover-buttons/Icons"
import Gradient from '@/components/editor/Page-cover-buttons/Cover-image/gradient';
import ColorSelector from '@/components/editor/Page-cover-buttons/ColorSelector';
import { SendPageChanges } from "@/lib/Page state manager";
import { Paintbrush, Trash2, Waves } from "lucide-react";

export default function MenuButtons({ currentPage }) {

    async function updateIcon(newIcon = '') {
        if (!newIcon) {
            return new Error('Please include a new icon')
        }
        try {
            SendPageChanges(currentPage, { icon: newIcon.image })
        } catch {
            return new Error('Something went wrong updating the page icon')
        }
    }

    async function updateColor(newColor = '') {
        if (!newColor) {
            return new Error('No color provided')
        }
        try {
            SendPageChanges(currentPage, { color: newColor })
        } catch {
            return new Error('An error occured while updating page color')
        }
    }

    async function removePageCover() {
        const data = {
            "unsplash": "",
            "header_img": null
        };

        try {
            SendPageChanges(currentPage, data)
        } catch (error) {
            console.error('Error removing cover:', error);
            // Handle the error, e.g., set an error state or show an error message
        }
    }

    return (
        <div className="print:hidden print:collapse  flex items-center justify-center gap-2">
            <ToolTipCon>
                <DropDownContainer>
                    <ToolTipTrigger>
                        <DropDownTrigger>
                            <button
                                aria-label="Page cover options"
                                type="button"
                                className="flex items-center justify-center p-3 cursor-pointer shadow-lg rounded-md text-zinc-100 bg-zinc-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30"
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
                                    <Img page={currentPage} />
                                </Popup>
                            </PopupContainer>
                            <PopupContainer>
                                <PopUpTrigger >
                                    <DropDownItem>
                                        <Waves />
                                        <p>Gradient</p>
                                    </DropDownItem>
                                </PopUpTrigger>
                                <Popup style={{ width: 520, height: 400 }}>
                                    <h1>Gradient covers</h1>
                                    <Paragraph>
                                        Choose a gradient cover for your page
                                    </Paragraph>
                                    <Gradient page={currentPage} />
                                </Popup>
                            </PopupContainer>
                            <DropDownItem onClick={() => removePageCover()}>
                                <Trash2 />
                                Remove Cover
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
                                className="flex items-center justify-center  rounded p-3  cursor-pointer shadow-lg rounded-md text-zinc-100 bg-zinc-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30"
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
                        <TabContent style={{ paddingTop: 0 }} name="icon">
                            <>
                                <Icons Select={updateIcon} />
                            </>
                        </TabContent>
                        <TabContent name="color" >
                            <ColorSelector onSelectColor={updateColor} page={currentPage} />
                        </TabContent>
                    </TabGroup>
                </TabsProvider>

            </ToolTipCon>
        </div>
    )
}