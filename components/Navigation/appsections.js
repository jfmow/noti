import Link from "../Link"

export default function AppSectionsBar() {
    const activeRoute = "pages"
    return (
        <>
            <div className="w-full bg-zinc-50 text-zinc-800 font-semibold text-sm">
                <div className="grid grid-cols-3">
                    <Link href={"/page"} className={`px-3 py-2 w-full h-full flex items-center justify-center cursor-pointer hover:bg-blue-100 bg-blue-50 text-blue-600 ${activeRoute === "pages" ? "bg-blue-100 text-blue-500" : ""}`}>
                        Pages
                    </Link>
                    <Link href={"/task"} className={`px-3 py-2 w-full h-full flex items-center justify-center cursor-pointer hover:bg-blue-100 bg-blue-50 text-blue-600 ${activeRoute === "tasks" ? "bg-blue-100 text-blue-500" : ""}`}>
                        Tasks
                    </Link>
                    <Link href={"/draw"} className={`px-3 py-2 w-full h-full flex items-center justify-center cursor-pointer hover:bg-blue-100 bg-blue-50 text-blue-600 ${activeRoute === "draw" ? "bg-blue-100 text-blue-500" : ""}`}>
                        Draw
                    </Link>
                </div>
            </div>
        </>
    )
}