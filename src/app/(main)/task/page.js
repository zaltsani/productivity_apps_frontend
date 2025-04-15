'use client'

import Header from "@/components/headers"
import Task from "@/components/task/task"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { addTask, fetchMe, fetchTask } from "@/lib/data"
import { PlusIcon } from "lucide-react"
import { useQuery } from "react-query"

export default function TaskPage() {
  const listBreadcrumb = [
    { title: "Task", url: "/task" }
  ]
  const { data: task, refetch } = useQuery(
    ["task"],
    fetchTask,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="my-0 sm:mx-10">
        <Card className="border-0">
          <CardHeader className="text-3xl font-bold">Task</CardHeader>
          <CardContent className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!!task && task?.map(item => (
              <Task key={item.id} task={item} refetch={refetch} />
            ))}
          </CardContent>
          <CardFooter>
            <Button
              onClick={async() => {
                const me = await fetchMe()
                addTask(me)
                refetch()
              }}
            >
              Add Task
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Button className="sm:hidden md:hidden fixed m-4 bottom-0 right-0">
        <PlusIcon className="text-lg" />
      </Button>
    </div>
  )
}