import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom'; // Import your CSS module
const modalContext = React.createContext()
export function Modal({ style, close, visibleDef = false, children }) {
    const [visible, setVisible] = useState(visibleDef)
    return (
        <modalContext.Provider value={{ visible, setVisible }}>
            {children}
        </modalContext.Provider>
    );
}

export function ModalContent({ ...props }) {
    const { visible, setVisible } = useContext(modalContext)
    if (visible) {
        return ReactDOM.createPortal(
            <div onClick={() => setVisible(false)} className="flex items-center justify-center w-full h-screen backdrop-blur-sm fixed z-[888] top-0 left-0 right-0 bottom-0">
                <div onClick={(e) => e.stopPropagation()} style={props.style} className="flex w-[450px] flex-col fixed bg-zinc-50 shadow-sm rounded-xl text-zinc-800 p-[32px]">
                    {props.children}
                </div>
            </div>,
            document.body
        )
    }
    return <></>
}

export function ModalTrigger({ ...props }) {
    const { setVisible } = useContext(modalContext)
    return (
        <div onClick={() => setVisible(true)} {...props}>
            {props.children}
        </div>
    )
}

export function Gap({ ...props }) {
    return (
        <div style={{ width: '100%', height: props.children + 'px' }} />
    )
}