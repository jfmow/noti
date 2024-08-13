import ThemesList from "./themes-list";

export default function ThemeTab() {

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4">
            <div className="border-b pb-2">
                <h3 className="text-md w-full mb-1">Theme</h3>
                <p className="text-sm text-gray-500">Select your editor theme.</p>
            </div>
            <ThemesList />
        </div>
    )
}