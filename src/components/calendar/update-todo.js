import { useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { updateTodo } from "@/lib/data";
import { DateTimePicker } from "./date-time-picker";

export const UpdateTodoCard = ({ todo, refetch }) => {
  const [updatedTodo, setUpdatedTodo] = useState(todo)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const onToggle = (status) => {
    setUpdatedTodo(prev => ({...prev, status: status}))
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{todo.title}</DialogTitle>
      </DialogHeader>

      <div className="space-y-2">

        {/* Title */}
        <div className="grid grid-cols-4 items-center">
          <Label>Title</Label>
          <Input
            onChange={(e) => setUpdatedTodo(prev => ({...prev, title: e.target.value}))}
            defaultValue={updatedTodo.title}
            className="col-span-3"
            placeholder="Title"
          />
        </div>

        {/* Description */}
        <div className="grid grid-cols-4 items-center">
          <Label>Description</Label>
          <Input
            onChange={(e) => setUpdatedTodo(prev => ({...prev, description: e.target.value}))}
            defaultValue={updatedTodo.description}
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
                {getStatusText(updatedTodo.status)}
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
            value={new Date(updatedTodo.date_time)}
            className="col-span-3"
            onChange={(date) => setUpdatedTodo(prev => ({...prev, date_time: date}))}
          />
        </div>

      </div>

      <DialogFooter>
        <Button onClick={async () => {
          console.log("Update Todo", updatedTodo)
          const response = updateTodo(updatedTodo)
          refetch()
        }}>
          Update Todo
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}