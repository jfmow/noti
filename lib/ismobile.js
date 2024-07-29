export default function isMobileScreen() {
    if (window) {
        if (window.innerWidth < 640) {
            return true
        }
    }
    return false
}