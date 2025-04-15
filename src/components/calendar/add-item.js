'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input, InputNoBorder } from "../ui/input"
import { DateTimePicker } from "../ui/date-time-picker"
import { Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { addTodo, fetchMe } from "@/lib/data"
import { Textarea } from "../ui/textarea"

export const AddTodoItem = ({ currentDate, refetch }) => {
  const [todo, setTodo] = useState({
    title: '',
    description: '',
    status: 'not-started',
    date_time: currentDate
  })
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const onToggle = (status) => {
    setTodo(prev => ({...prev, status: status}))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "not-started":
        return "bg-muted text-muted-foreground"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "finished":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "not-started":
        return "Not Started"
      case "in-progress":
        return "In Progress"
      case "finished":
        return "Finished"
      default:
        return "Unknown"
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">

          {/* Title */}
          <div className="grid grid-cols-4 items-center">
            <Label>Title</Label>
            <Input
              onChange={(e) => setTodo(prev => ({...prev, title: e.target.value}))}
              defaultValue={todo.title}
              className="col-span-3"
              placeholder="Title"
            />
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-center">
            <Label>Description</Label>
            <Textarea
              onChange={(e) => setTodo(prev => ({...prev, description: e.target.value}))}
              defaultValue={todo.description}
              className="col-span-3"
              placeholder="Description Todo"
            />
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center">
            <Label>Status</Label>
            <Popover open={isStatusOpen} onOpenChange={setIsStatusOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-6 px-2 text-xs rounded-full mt-1 ${getStatusColor(todo.status)}`}
                >
                  {getStatusText(todo.status)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => {
                      onToggle("not-started")
                      setIsStatusOpen(false)
                    }}
                  >
                    Not Started
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => {
                      onToggle("in-progress")
                      setIsStatusOpen(false)
                    }}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => {
                      onToggle("finished")
                      setIsStatusOpen(false)
                    }}
                  >
                    Finished
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date Time */}
          <div className="grid grid-cols-4 items-center">
            <Label>Date Time</Label>
            <DateTimePicker
              value={new Date(currentDate.setHours(7,0,0))}
              className="col-span-3"
              onChange={(date) => setTodo(prev => ({...prev, date_time: date}))}
            />
          </div>

        </div>

        <DialogFooter>
          <DialogTrigger asChild>
            <Button
              onClick={async () => {
                const me = await fetchMe()
                const data = {
                  ...todo,
                  owner: me.id
                }
                console.log("Add Todo", data)
                const response = addTodo(data)
                refetch()
              }}
            >
              Add Todo
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}