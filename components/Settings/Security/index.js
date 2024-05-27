import OAuth from "@/components/Settings/Security/OAuth";

export default function SecurityTab() {

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4">
            <div className="border-b pb-2">
                <h3 className="text-md w-full mb-1">Security</h3>
                <p className="text-sm text-gray-500">Manage your accounts signin methods and recovery.</p>
            </div>
            <OAuth />
        </div>
    )
}