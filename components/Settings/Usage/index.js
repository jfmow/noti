import UsagePie from "@/components/Settings/Usage/Piechart";

export default function UsageTab() {

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4">
            <div className="border-b pb-2">
                <h3 className="text-md w-full mb-1">Usage</h3>
                <p className="text-sm text-gray-500">View your total file usage and upgrade your plan.</p>
            </div>
            <UsagePie />
        </div>
    )
}