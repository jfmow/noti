export default function Link({ href, className, style, children }) {
    return (
        <>
            <a className={className} style={style} href={href}>{children}</a>
        </>)
}