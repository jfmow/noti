import { useTasksContext } from "@/pages/task"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

export default function Tasks({ currentFolder }) {
    const { pb } = useTasksContext()
    const [tasks, setTasks] = useState([
        { id: "aa", content: "test a really long peice of text that should wrap down hopefully without breaking the text", checked: false },
        { id: "afdsa", content: "tdfest", checked: true }
    ])
    useEffect(() => {

    }, [currentFolder])
    return (
        <>
            <div className="w-full h-[100dvh] bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 text-sky-600">
                <div className="w-full h-[100dvh] flex items-center justify-center">
                    <div className="flex flex-col w-full w-[90%] max-w-[600px]">
                        <div className="mb-2 p-1 bg-purple-100 shadow rounded w-full flex items-center justify-between gap-2">
                            <input className="text-zinc-800 w-full p-2 text-wrap rounded border-none bg-transparent" placeholder="New task..." />
                            <div className="cursor-pointer p-1 hover:bg-purple-200 rounded">
                                <Plus className="w-6 h-6 text-zinc-800 " />
                            </div>
                        </div>
                        {tasks.map((task) => (
                            <div className="mb-2 p-3 bg-blue-100 shadow rounded w-full flex items-center justify-between" key={task.id}>
                                <span className="max-w-[80%] text-wrap">
                                    {task.content}
                                </span>
                                <div>
                                    <div class="flex">
                                        <input type="checkbox" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-200 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-checked-checkbox" defaultChecked={task.checked} />
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </>
    )
}