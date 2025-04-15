import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Clock, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { deleteTodo, updateTodo } from "@/lib/data"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { UpdateTodoCard } from "./update-todo"

export const TodoItemCard = ({ todo, refetch }) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  
  const onToggle = (newStatus) => {
    updateTodo({
      ...todo,
      status: newStatus
    })
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
    <div className={`p-3 border rounded-lg ${todo.status === "finished" ? "bg-muted/50" : "bg-card"}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
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
                    refetch()
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
                    refetch()
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
                    refetch()
                  }}
                >
                  Finished
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="space-y-1 flex-1">
            <h4 className={`font-medium ${todo.status === "finished" ? "line-through text-muted-foreground" : ""}`}>
              {todo.title}
            </h4>
            {todo.description && (
              <p
                className={`text-sm ${todo.status === "finished" ? "text-muted-foreground/70 line-through" : "text-muted-foreground"}`}
              >
                {todo.description}
              </p>
            )}
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{format(new Date(todo.date_time), "MMM d, h:mm a")}</span>
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <UpdateTodoCard todo={todo} refetch={refetch} />
        </Dialog>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => {
            deleteTodo(todo)
            refetch()
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}