'use client'

import { format } from "date-fns";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TodoItemCard } from "./todo-item-card"
import { AddTodoItem } from "./add-item";

export const DailyDetail = ({ currentDate, todos, refetch }) => {
  const finishedTodos = todos?.filter((todo) => todo.status === "finished")
  const inProgressTodos = todos?.filter((todo) => todo.status === "in-progress")
  const notStartedTodos = todos?.filter((todo) => todo.status === "not-started")
  const pendingTodos = todos?.filter((todo) => todo.status !== "finished")

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{format(currentDate, "EEEE, MMMM d, yyyy")}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              {!!pendingTodos ? pendingTodos.length : 0} pending, {!!finishedTodos ? finishedTodos.length : 0} finished
            </span>
          </div>
          <AddTodoItem currentDate={currentDate} refetch={refetch} />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-[10px] sm:text-sm">All ({todos ? todos.length : 0})</TabsTrigger>
            <TabsTrigger value="not-started" className="text-[10px] sm:text-sm">Not Started ({notStartedTodos ? notStartedTodos.length : 0})</TabsTrigger>
            <TabsTrigger value="in-progress" className="text-[10px] sm:text-sm">In Progress ({inProgressTodos ? inProgressTodos.length : 0})</TabsTrigger>
            <TabsTrigger value="finished" className="text-[10px] sm:text-sm">Finished ({finishedTodos ? finishedTodos.length : 0})</TabsTrigger>
          </TabsList  >

          <TabsContent value="all" className="mt-4 space-y-2">
            {!!todos && todos.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No todos for this day. Add one to get started!
              </div>
            ) : (
              todos?.map((todo) => (
                <TodoItemCard key={todo.id} todo={todo} refetch={refetch}  />
              ))
            )}
          </TabsContent>

          <TabsContent value="not-started" className="mt-4 space-y-2">
            {notStartedTodos?.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No not started todos.</div>
            ) : (
              notStartedTodos?.map((todo) => (
                <TodoItemCard key={todo.id} todo={todo} refetch={refetch} />
              ))
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="mt-4 space-y-2">
            {inProgressTodos?.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No in progress todos.</div>
            ) : (
              inProgressTodos?.map((todo) => (
                <TodoItemCard key={todo.id} todo={todo} refetch={refetch} />
              ))
            )}
          </TabsContent>

          <TabsContent value="finished" className="mt-4 space-y-2">
            {finishedTodos?.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No finished todos yet.</div>
            ) : (
              finishedTodos?.map((todo) => (
                <TodoItemCard key={todo.id} todo={todo} refetch={refetch} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  )
}