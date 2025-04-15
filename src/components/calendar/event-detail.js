import { deleteTodo, updateTodo } from "@/lib/data";
import { useMutation } from "react-query";
import { InputNoBorder } from "../ui/input";
import { ChevronDown, X } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { Button } from "../ui/button";
import { DateTimePicker } from "../ui/date-time-picker";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CalendarEvent({ event, refetch }) {
  const [thisTodo, setThisTodo] = useState(event)
  const formattedDate = new Date(event.date_time)
  const [date, setDate] = useState(formattedDate)
  const updateTodoMutation = useMutation((newData) => updateTodo(newData))
  const isMobile = useIsMobile()

  return (
    <>
      <div className="text-xs bg-gray-200 p-1 my-1 rounded flex items-center justify-between">
        <div className="flex space-x-2 items-center">
        <div className={`w-4 h-4 rounded rounded-full ${event.status === 'not-started' ? 'bg-red-600' : event.status === 'in-progress' ? 'bg-blue-500' : 'bg-green-400'}`} />

        <Dialog>
          <DialogTrigger>{event.title !== '' ? event.title : "New Todo"}</DialogTrigger>
          <DialogContent>
            
            {/* Title */}
            <DialogHeader>
              <DialogTitle>
                <InputNoBorder
                  className="bg-background text-xl font-semibold px-0 py-0 my-0 h-auto"
                  defaultValue={event.title ? event.title : 'Enter Todo'}
                  onChange={e => {
                    setThisTodo(prev => ({...prev, title: e.target.value}))
                    // updateTodoMutation.mutate({...event, title: e.target.value})
                    // refetch()
                  }}
                />
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-0">

              {/* Description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Description:</Label>
                <InputNoBorder
                  defaultValue={event.description ? event.description : '...'}
                  className="col-span-3 bg-background text-lg  px-0 py-0 my-0 h-auto"
                  onChange={e => {
                    setThisTodo(prev => ({...prev, description: e.target.value}))
                    // updateTodoMutation.mutate({...event, description: e.target.value})
                  }}
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Status:</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="col-span-3" asChild>
                    <div className={`flex space-x-2 w-fit px-4 rounded-xl ${thisTodo.status === 'not-started' ? 'bg-red-500/90 px-2' : thisTodo.status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'}`}>
                      <span>{thisTodo.status}</span>
                      <ChevronDown />  
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border border-gray-400">
                    <DropdownMenuGroup className="px-2">event
                      <DropdownMenuItem
                        onClick={() => setThisTodo(prev => ({...prev, status: 'not-started'}))}
                        className="w-fit px-4 rounded-xl bg-red-500 focus:bg-red-500 my-2 cursor-pointer">
                        not-started
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setThisTodo(prev => ({...prev, status: 'in-progress'}))}
                        className="w-fit px-4 rounded-xl bg-blue-500 focus:bg-blue-500 my-2 cursor-pointer">
                        in-progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setThisTodo(prev => ({...prev, status: 'finished'}))}
                        className="w-fit px-4 rounded-xl bg-green-500 focus:bg-green-500 my-2 cursor-pointer">
                        finished
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <InputNoBorder
                  defaultValue={event.status}
                  className="col-span-3 bg-background text-lg font-semibold py-0 my-0 h-auto"
                  onChange={e => {
                    updateTodoMutation.mutate({...event, status: e.target.value})
                  }}
                /> */}
              </div>

              {/* Date Time */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Date Time:</Label>
                <DateTimePicker
                  value={date}
                  // onChange={() => {
                  //   setThisTodo((prev) => setThisTodo(...prev, date_time: ))
                  // }}
                  onChange={setDate}
                  className="w-[280px]" />
              </div>
              
            </div>

            <DialogFooter>
              <Button
                onClick={() => {
                  updateTodoMutation.mutate({...thisTodo, date_time: date})
                  refetch()
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTodo(event)
            refetch()
          }}
          className="ml-1 text-red-500 hover:text-red-700"
        >
          <X size={12} />
        </button>
      </div>
    </>
  )
}