'use client'

import { useState } from "react";
import { dayNames, generateDays, monthNames } from "./utils";
import { fetchTodoList, updateTodo } from "@/lib/data";
import { useMutation, useQuery } from "react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { DailyDetail } from "./daily-detail";

export default function MonthlyView ({ currentDate, setCurrentDate, events, refetchTodo, isLoading }) {
  const [newEvent, setNewEvent] = useState('');
  const updateTodoMutation = useMutation((newData) => updateTodo(newData))
  const isMobile = useIsMobile()

  if (isLoading) <div>Wait...</div>

  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold py-2 bg-gray-200 rounded-md">
            {!isMobile ? day : day.slice(0, 2)}
          </div>
        ))}
        {!!events && generateDays(currentDate).map((day, index) => {
          const dateKey = day ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}` : null;
          const eventThisDay = events && events?.length > 0 ? events?.filter(e => e?.date_time?.split('T')[0] == dateKey) : undefined

          return (
            <div
              key={index}
              className={`
                p-0 sm:p-2 min-h-20 max-h-auto sm:min-h-24 md:min-h-32 lg:min-h-40 border border-1 border-gray-200
                rounded-lg overflow-y-autoo
                flex flex-col
                ${!day ? 'bg-transparent border-0' : 'hover:bg-gray-100 cursor-pointer sm:shadow-lg'}
              `}
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(day)
                setCurrentDate(newDate)
              }}
            >
              {!!events && day && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="w-full h-full">
                      <div className={`${isMobile && "text-center"} font-medium text-sm sm:text-base border border-0 border-b-2`}>{day}</div>
                      <div className="flex-1 min-h-0 overflow-y-auto mt-1 space-y-1">
                        {eventThisDay && eventThisDay.slice(0, 3).map((todo, eventIndex) => (
                          <div
                            key={todo.id}
                            className={`
                              text-xs sm:text-sm p-1 rounded truncate cursor-pointer overflow-x-auto shadow-sm
                              ${todo.status === "not-started" && "bg-gray-200 shadow-gray-600"}
                              ${todo.status === "finished" && "bg-green-200 text-green-800 line-through shadow-green-300"}
                              ${todo.status === "in-progress" && "bg-blue-200 text-blue-800 dark:text-blue-400 shadow-blue-300"}
                            `}
                          >
                            {todo.title}
                          </div>  
                        ))}
                        {!!eventThisDay && eventThisDay.length > 3 && (
                          <div className="pl-1 text-xs truncate text-muted-foreground">+{eventThisDay.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  </DialogTrigger>
                  <DailyDetail currentDate={currentDate} todos={eventThisDay} refetch={refetchTodo} />
                </Dialog>
              )}
            </div>
          );
        })}
      </div>
    </>
  )
}