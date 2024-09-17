import { Loader2, X } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
//TODO: Add invert to all

export function TextInput({ ...props }) {
    props.className = "font-light bg-zinc-100 border border-zinc-300 rounded-md py-2 px-3 text-zinc-800 shadow-sm text-sm" + " " + props.className
    return (
        <>
            <input {...props} />
        </>
    )
}

export function NumberInput({ ...props }) {
    props.className = "font-light bg-zinc-100 border border-zinc-300 rounded-md p-2 text-zinc-800 shadow-sm text-input" + " " + props.className;

    const handleInput = (e) => {
        const value = e.target.value;
        // Use a regular expression to remove any non-numeric characters
        e.target.value = value.replace(/[^0-9]/g, '');
    };

    return (
        <input
            type="tel"
            pattern="[0-9]*"
            inputMode="numeric"
            onInput={handleInput}
            {...props}
        />
    );
}

export function Button({ filled = false, inverted = false, loading = false, ...props }) {
    let className
    if (!inverted) {
        className = "text-sm py-2 px-3 rounded-md border border-zinc-300 text-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-200 [&>svg]:text-zinc-800 [&>svg]:mr-1 [&>svg]:w-4 [&>svg]:h-4 " + props.className
    } else {
        className = "text-sm py-2 px-3 rounded-md border border-zinc-700 text-zinc-300 flex items-center justify-center cursor-pointer hover:bg-zinc-700 [&>svg]:text-zinc-300 [&>svg]:mr-1 [&>svg]:w-4 [&>svg]:h-4 " + props.className
    }
    if (filled) {
        if (!inverted) {
            className = "bg-zinc-100 " + className
        } else {
            className = "bg-zinc-900 " + className
        }

    }
    props.className = className
    return (
        <button {...props}>
            {loading ? (
                <>
                    {"​"}
                    <Loader2 className="h-4 w-4 animate-spin" style={{ margin: "unset !important" }} />
                    {"​"}
                </>
            ) : (
                <>
                    {props.children}
                </>
            )
            }
        </button>
    )
}

export function CheckBox({ ...props }) {
    return (
        <div className="flex justify-center items-center w-fit">
            <label className="flex">
                <input
                    className="peer cursor-pointer hidden after:opacity-100"
                    type="checkbox"
                    {...props}
                />
                <span
                    className="inline-block w-5 h-5 border-2 relative cursor-pointer after:content-[''] after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[10px] after:h-[10px] after:bg-[#333] after:rounded-[2px] after:opacity-0 peer-checked:after:opacity-100"
                ></span>
            </label>
        </div>
    )
}

const ModalContext = createContext()

export function Modal({ defaultOpen = false, children }) {

    const [modalOpen, setModalOpen] = useState(defaultOpen)


    function OpenModal() {
        setModalOpen(true)
    }

    function CloseModal() {
        setModalOpen(false)
    }

    return (
        <ModalContext.Provider value={{ OpenModal, modalOpen, CloseModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export function ModalTrigger({ asChild, children }) {
    const { OpenModal } = useContext(ModalContext)
    if (asChild) {
        return (
            <div onClick={OpenModal}>
                {children}
            </div>
        )
    }
    return (
        <button onClick={OpenModal}>
            {children}
        </button>
    )
}

export function ModalContent({ width = "normal", children }) {
    const { modalOpen, CloseModal } = useContext(ModalContext)
    if (!modalOpen) return <></>
    const className = `max-w-[100vw] w-[${width === "normal" ? "600px" : width === "small" ? "400px" : width === "large" ? "800px" : "600px"}] max-h-[600px] min-h-[200px] bg-gray-100 mx-3 sm:mx-0 rounded-xl overflow-hidden shadow-lg p-1 animate-fade-up animate-once animate-duration-[350ms] animate-ease-in-out animate-normal animate-fill-both`
    return (
        <>
            {createPortal(
                <div onClick={CloseModal} className="fixed z-[100] top-0 left-0 right-0 bottom-0 w-full h-[100dvh] backdrop-blur-sm bg-zinc-800/20 flex items-center justify-center">
                    <div onClick={(e) => e.stopPropagation()} className={className}>
                        <div className="fixed top-5 right-4 cursor-pointer" title="close" onClick={CloseModal}>
                            <X className="w-4 h-4  text-zinc-800" />
                        </div>
                        {children}

                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export function ModalHeader({ ...props }) {
    props.className = "w-full p-4 border-b mb-2" + " " + props.className
    return (
        <div {...props}>
            <h3 className="text-md w-full mb-1 text-zinc-800">{props.children}</h3>
        </div>
    )
}

export function Paragraph({ ...props }) {
    return (
        <p {...props} className="text-[14px] text-zinc-500 font-[500] mb-2">
            {props?.children}
        </p>
    )
}