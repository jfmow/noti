import { useTasksContext } from "@/pages/task"
import AppSectionsBar from "../Navigation/appsections"
import { ChevronRight, Router } from "lucide-react"
export default function TasksList() {
    const { pb, tasks, setTasks } = useTasksContext()
    /**
     * Tasks will be part of a folder, that folder is the db entry and will have tasks in json array to be mapped
     */
    return (
        <>
            <div className="w-[250px] h-[100dvh] bg-zinc-50 text-zinc-800">
                <AppSectionsBar />
                <div className="p-3">
                    {tasks.map((task) => (
                        <>
                            <div onClick={ } className="p-3 bg-zinc-100 shadow-sm rounded-lg mb-2 flex items-center justify-between cursor-pointer hover:bg-zinc-200" key={task.id}>
                                <span className="font-semibold text-sm">
                                    {task.folderName}
                                </span>

                                <div>
                                    <ChevronRight className="w-4 h-4" />
                                </div>

                            </div>
                        </>
                    ))}
                </div>

            </div>
        </>
    )
}