export default function Link({ href, className, style, target, onClick, children }) {
    return (
        <>
            <a className={className} style={{ cursor: 'pointer', ...style }} onClick={onClick} target={target} href={href}>{children}</a>
        </>)
}