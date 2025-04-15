'use client'

import Header from "@/components/headers"
import TaskDetail from "@/components/task/task-detail"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { addTaskBody, fetchTaskId, updateTaskTitle } from "@/lib/data"
import { PlusIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useMutation, useQuery } from "react-query"

export default function Page() {
  const pathName = usePathname()
  const taskId = pathName.split('/')[2]
  const [Task, setTask] = useState(null)

  const { data: task, isLoading } = useQuery(
    ["task", taskId],
    () => fetchTaskId(taskId),
    {
      refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true,
      onSuccess: (data) => setTask(data)
    },
  )

  const listBreadcrumb = [
    { title: "Task", url: "/task" },
    { title: !!task ? task.title : taskId, url: `/task/${taskId}/` },
  ]

  const updateMutation = useMutation((newData) => updateTaskTitle(newData))
  
  // console.log(Task)

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="my-0 sm:mx-10">
        <Card className="border-0">
          <CardHeader className="text-3xl font-bold">
            <input
              defaultValue={Task?.title}
              placeholder="Task Title"
              onChange={e => {
                const updatedTask = { ...Task, title: e.target.value}
                setTask(updatedTask)
                updateMutation.mutate(updatedTask)
              }}
              className="border-0 focus-visible:ring-0 focus-visible:outline-none w-full"
            />
            <div>
              <Button
                size='sm'
                onClick={async () => {
                  const response = await addTaskBody(Task);
                  setTask((prev) => ({
                    ...prev,
                    task_body: [
                      ...prev.task_body,
                      {id: response.id, body: response.body, is_done: false, task: task.id}
                    ],
                  }));
                }}
              >
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="">
            {!!Task && (
              <>
                {Task?.task_body?.map(item => (
                  <TaskDetail task={item} setTask={setTask} />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Button className="sm:hidden md:hidden fixed m-4 bottom-0 right-0">
        <PlusIcon className="text-lg" />
      </Button>
    </div>
  )
}