import TasksList from '@/components/tasks/list'
import PocketBase from 'pocketbase'
import { createContext, useContext, useState } from 'react'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

const tasksContext = createContext()

export default function Tasks() {
    const [tasks, setTasks] = useState([
        {
            folderName: "Folder 1", id: "abc", tasks: [
                { id: "aa", content: "test", checked: false },
                { id: "afdsa", content: "tdfest", checked: true }
            ]
        }
    ])
    return (
        <>
            <tasksContext.Provider value={{ pb, tasks, setTasks }}>
                <div className='flex'>
                    <TasksList />
                    <div>
                        Everything else
                    </div>
                </div>
            </tasksContext.Provider>
        </>
    )
}

export const useTasksContext = () => {
    return useContext(tasksContext)
}