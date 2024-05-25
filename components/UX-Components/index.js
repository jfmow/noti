export function Input({ label, ...props }) {
    const id = crypto.randomUUID()
    return (
        <div className="w-full h-fit">
            {label && (
                <label className="block mb-1 font-[500] text-[14px]" for={id}>{label}</label>
            )}
            <input className="w-full py-[12px] px-[16px] rounded-lg outline-none border border-slate-100 bg-slate-50 text-zinc-800 text-[14px] mb-2 font-[400]" name={id} {...props} />
        </div>
    )
}

export function FileInput({ alt, ...props }) {
    const className = `mt-1 min-h-[43px] flex justify-center items-center  border-2 border-zinc-800 w-full px-1 py-2 gap-2 cursor-pointer rounded-xl text-[14px] transition-all transition-ease-in-out font-[500] ${alt ? 'bg-none text-zinc-800 hover:bg-zinc-800 hover:text-zinc-50' : 'text-zinc-50 bg-zinc-800 hover:bg-none hover:text-zinc-800'}`
    return (
        <label className={className}>
            <input onChange={props.onChange} accept={props.accept} style={{ display: 'none' }} type={'file'} />
            {props.children}
        </label>
    )
}

export function SubmitButton({ alt, ...props }) {
    const className = `mt-1 min-h-[43px] disabled:opacity-75 flex justify-center items-center  border-2 border-zinc-800 w-full px-1 py-2 gap-2 cursor-pointer rounded-xl text-[14px] transition-all transition-ease-in-out font-[500] ${alt ? 'bg-none text-zinc-800 hover:bg-zinc-800 hover:text-zinc-50' : 'text-zinc-50 bg-zinc-800 hover:bg-zinc-50 hover:text-zinc-800'}`
    if (!props?.type) {
        return (
            <>
                <button type='button' {...props} className={className} >{props?.children}</button>
            </>
        )
    }
    return (
        <>
            <button {...props} className={className} >{props?.children}</button>
        </>
    )
}

export function Paragraph({ ...props }) {
    return (
        <p {...props} className="text-[14px] text-zinc-500 font-[500] mb-2">
            {props?.children}
        </p>
    )
}

export function Link({ ...props }) {
    return (
        <a {...props} className={`${props.className} ${"font-[500] text-[14px] text-zinc-800"}`}>{props.children}</a>
    )
}