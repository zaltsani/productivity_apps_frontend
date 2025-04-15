import { useState } from "react";
import { dayNames, hours, monthNames } from "./utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Clock, Pencil, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils"
import { useQuery } from "react-query";
import { fetchTodoList, updateTodo } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { UpdateTodoCard } from "./update-todo";

export default function DailyView ({ currentDate, setCurrentDate, data, refetch, isLoading }) {
  // let { data: data, refetch, isLoading } = useQuery(
  //   ["task"],
  //   fetchTodoList,
  //   {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  // )

  data = data?.map(d => ({ ...d, date_time: new Date(d.date_time) }))
  const events = data?.filter(d => {
    return (
      d.date_time.getFullYear() === currentDate.getFullYear() &&
      d.date_time.getMonth() === currentDate.getMonth() &&
      d.date_time.getDate() === currentDate.getDate() 
    )
  })

  const onToggle = (todo, newStatus) => {
    updateTodo({
      ...todo,
      status: newStatus
    })
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i + 0
    return hour < 10 ? `0${hour}:00` : `${hour}:00`
  })

  const getTasksForTimeSlot = (timeSlot) => {
    return events?.filter((task) => {
      const taskHour = task.date_time.getHours().toString().padStart(2, "0")
      const slotHour = timeSlot.split(":")[0]
      return taskHour === slotHour
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
        return "Not Started"
    }
  }

  if (isLoading) {
    return (
      <div>Wait</div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}
        </h2>
        <div className="isolate flex -space-x-px">
          <Button
            variant="outline"
            size="sm"
            className="rounded-r-none"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-l-none"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div> */}

      <div className="space-y-1">
      {timeSlots.map((timeSlot) => (
        <div key={timeSlot} className="grid grid-cols-[50px_1fr] sm:grid-cols-[80px_1fr] gap-4">
          <div className="text-right text-sm text-muted-foreground py-3">{timeSlot}</div>
          <div>
            <div className="border-l pl-4 pb-1 pt-3 relative">
              <div className="absolute w-2 h-2 bg-primary rounded-full -left-1 top-4" />
              <div className="space-y-2">
                {getTasksForTimeSlot(timeSlot).map((task) => (
                  <Card
                    key={task.id}
                    className={cn(
                      "overflow-hidden shadow-lg",
                      task.status === "finished" && "opacity-60 shadow-green-300",
                      task.status === "in-progress" && "shadow-blue-300",
                      task.status === 'not-started' && "shadow-gray-600"
                    )}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-start gap-3 flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "h-6 px-2 text-xs rounded-full mt-1",
                                  getStatusColor(task.status || "not-started"),
                                )}
                              >
                                {getStatusText(task.status || "not-started")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <div className="flex flex-col p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start font-normal"
                                  onClick={() => {
                                    onToggle(task, "not-started")
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
                                    onToggle(task, "in-progress")
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
                                    onToggle(task, "finished")
                                    refetch()
                                  }}
                                >
                                  Finished
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <div className="space-y-1 flex-1">
                            <h4
                              className={cn(
                                "font-medium",
                                task.status === "finished" && "line-through text-muted-foreground",
                              )}
                            >
                              {task.title}
                            </h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {task.date_time.getHours().toString().padStart(2, "0")}:
                                {task.date_time.getMinutes().toString().padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Update */}
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
                          <UpdateTodoCard todo={task} refetch={refetch} />
                        </Dialog>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTask(task.id)}
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <Separator className="mt-1" />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}