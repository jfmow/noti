import { UserCircle, HeartHandshake, PieChart, Pencil } from "lucide-react"
import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";

import { createPortal } from "react-dom";
import AccountTab from "./Account";
import SecurityTab from "./Security";
import UsageTab from "./Usage";

const SettingsPopoverContext = createContext()
const forceUpdateReducer = (x) => x + 1;

export default function SettingsPopover({ pb, children }) {
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [opentab, setTab] = useState("account")
    const [, rerenderPage] = useReducer(forceUpdateReducer, 0);
    const [isonmobile, setIsOnMobile] = useState(false)
    const [menuHidden, setMenuHidden] = useState(false)
    useEffect(() => {
        if (window) {
            if (window.innerWidth < 640) {
                setIsOnMobile(true)
            }
        }
    }, [])

    function setOpenTab(tab) {
        if (isonmobile) {
            setMenuHidden(true)
        } else {
            setMenuHidden(false)
        }
        setTab(tab)
    }

    return (
        <SettingsPopoverContext.Provider value={{ pb, rerenderPage }}>
            <>
                <button onClick={() => setPopoverOpen(prev => !prev)}>
                    {children}
                </button>
                {popoverOpen ? (
                    <>
                        {createPortal(
                            <div onClick={() => setPopoverOpen(false)} className="overflow-hidden fixed z-[50] top-0 left-0 right-0 bottom-0 h-[100svh] w-full bg-zinc-800/20 backdrop-blur-sm flex items-center justify-center">
                                <div onClick={(e) => e.stopPropagation()} className="w-[600px] h-[500px] bg-gray-100 mx-3 sm:mx-0 rounded-xl overflow-hidden shadow-lg flex p-1 animate-fade-up animate-once animate-duration-[350ms] animate-ease-in-out animate-normal animate-fill-both">
                                    {menuHidden ? (
                                        <>

                                        </>) : (
                                        <div className="select-none flex-none min-w-[200px] w-fit h-full grid p-1 px-2">
                                            <div>
                                                <div className="p-3">
                                                    <h4 className="text-xs text-gray-300">Account</h4>
                                                </div>
                                                <ul className="text-gray-600 flex flex-col text-sm">
                                                    <li onClick={() => setOpenTab("account")} className="flex items-center hover:bg-gray-200 py-1 px-2 rounded-lg hover:cursor-pointer"><UserCircle className="w-4 h-4 mr-1" /> Account</li>
                                                    <li onClick={() => setOpenTab("security")} className="flex items-center hover:bg-gray-200 py-1 px-2 rounded-lg hover:cursor-pointer"><HeartHandshake className="w-4 h-4 mr-1" /> Security</li>
                                                    <li onClick={() => setOpenTab("usage")} className="flex items-center hover:bg-gray-200 py-1 px-2 rounded-lg hover:cursor-pointer"><PieChart className="w-4 h-4 mr-1" /> Usage</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                    {!menuHidden && isonmobile ? null : (
                                        <main className="flex-1 text-gray-800 h-full overflow-y-scroll" id="showscrollbaronme">
                                            {menuHidden && isonmobile ? (<div className="p-3 border-b">
                                                <Button onClick={() => setMenuHidden(false)}>Menu</Button>
                                            </div>) : null}
                                            {opentab === "" || opentab === "account" ? (
                                                <AccountTab />
                                            ) : null}
                                            {opentab === "security" ? (
                                                <SecurityTab />
                                            ) : null}
                                            {opentab === "usage" ? (
                                                <UsageTab />
                                            ) : null}

                                        </main>
                                    )}

                                </div >
                            </div >,
                            document.body
                        )}
                    </>
                ) : null}
            </>
        </SettingsPopoverContext.Provider >
    )
}

export const useSettingsPopoverContext = () => {
    return useContext(SettingsPopoverContext);
};

export function Button({ ...props }) {
    return (
        <button type="button" className="text-sm px-3 py-1 rounded border border-gray-300 cursor-pointer hover:bg-gray-200" {...props}>{...props.children}</button>
    )
}