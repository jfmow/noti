export default function Link({ href, className, style, target, children }) {
    return (
        <>
            <a className={className} style={style} target={target} href={href}>{children}</a>
        </>)
}