import TasksList from '@/components/tasks/list'
import Tasks from '@/components/tasks/tasks'
import PocketBase from 'pocketbase'
import { createContext, useContext, useState } from 'react'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

const tasksContext = createContext()

export default function TasksContainer() {
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
                    <Tasks />
                </div>
            </tasksContext.Provider>
        </>
    )
}

export const useTasksContext = () => {
    return useContext(tasksContext)
}