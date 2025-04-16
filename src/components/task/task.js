import { Fragment, useState } from "react"
import TaskDetail from "./task-detail"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { useMutation } from "react-query"
import { addTaskBody, deleteTask, updateTaskTitle } from "@/lib/data"
import { PlusIcon, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"


export default function Task({ task, refetch }) {
  const [Task, setTask] = useState(task)
  const updateMutation = useMutation((newData) => updateTaskTitle(newData))
  const router = useRouter()

  return (
    <Card className="border-2" onClick={() => router.push(`/task/${task.id}`)}>
      {/* <Link href={`/task/${task.id}/`}> */}
        <CardHeader>
          <div
            className="flex flex-row space-x-4 justify-between items-center"
            onClick={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
          >
            <input
              defaultValue={Task.title}
              placeholder="Task Title"
              onChange={e => {
                const updatedTask = { ...Task, title: e.target.value}
                setTask(updatedTask)
                updateMutation.mutate(updatedTask)
              }}
              className="border-0 focus-visible:ring-0 focus-visible:outline-none w-full"
            />
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                onClick={async () => {
                  const response = await addTaskBody(Task);
                  setTask((prev) => ({
                    ...prev,
                    task_body: [
                      ...prev.task_body,
                      {id: response.id, body: "", is_done: false, task: task.id}
                    ],
                  }));
                }}
              >
                <PlusIcon />
              </Button>
              <DialogDeleteTask task={Task} refetch={refetch} >
                <Button
                  size="icon"
                  variant="destructive"
                >
                  <Trash className=" cursor-pointer hover:text-red-600 size-5" />
                </Button>
              </DialogDeleteTask>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-[200px] overflow-y-auto pb-3">
          {!!Task && Task.task_body?.length > 0 && Task?.task_body?.map(itemm => (
            <div
              key={itemm.id}
              onClick={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
              }}
            >
              <TaskDetail
                task={itemm}
                setTask={setTask}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter></CardFooter>
        {/* <CardFooter>
          <div
            onClick={async () => {
              const response = await addTaskBody(Task);
              setTask((prev) => ({
                ...prev,
                task_body: [
                  ...prev.task_body,
                  {id: response.id, body: "", is_done: false, task: task.id}
                ],
              }));
            }}
            className="flex items-center space-x-4 text-sm pl-0 cursor-pointer w-fit"
          >
            <PlusIcon className="text-gray" />
            <p>Add Item</p>
          </div>
        </CardFooter> */}
      {/* </Link> */}
    </Card>
  )
}


function DialogDeleteTask({ task, children, refetch }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          Are you sure you want to delete task?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => {
                deleteTask(task)
                refetch()
              }}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}