export default function Link({ href, className, style, target, children }) {
    return (
        <>
            <a className={className} style={{ cursor: 'pointer', ...style }} target={target} href={href}>{children}</a>
        </>)
}