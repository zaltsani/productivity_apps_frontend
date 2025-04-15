import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { InputNoBorder } from "../ui/input";
import { useMutation, useQuery } from "react-query";
import { addSubTaskBody, deleteTaskBody, updateTaskBody } from "@/lib/data";
import { PlusIcon, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


const handleAddSubtask = async( task, setTask ) => {
  const response = await addSubTaskBody(task);
  const newSubtask = response.data

  setTask(prev => ({
    ...prev,
    task_body: addSubtaskRecursive(prev.task_body, task.id, newSubtask)
  }))
}

const addSubtaskRecursive = (tasks, targetId, newSubtask) => {
  return tasks.map(task => {
    // If current task is the parent, add subtask
    if (task.id === targetId) {
      return {
        ...task,
        subtask_body: [...task.subtask_body, newSubtask]
      };
    }
    
    // Otherwise, recursively process subtasks
    return {
      ...task,
      subtask_body: addSubtaskRecursive(task.subtask_body, targetId, newSubtask)
    }
  })
}

const handleDeleteSubtask = (subtaskIdToDelete, setTask) => {
  setTask(prev => ({
    ...prev,
    task_body: deleteSubtaskRecursive(prev.task_body, subtaskIdToDelete),
  }));
};

// Recursive helper function to delete subtask by ID
const deleteSubtaskRecursive = (tasks, subtaskIdToDelete) => {
  return tasks
    .filter(task => task.id !== subtaskIdToDelete) // Remove the matching task
    .map(task => ({
      ...task,
      subtask_body: deleteSubtaskRecursive(task.subtask_body, subtaskIdToDelete), // Recursively filter subtasks
    }));
};

function ItemComponent({ task, setTask }) {
  const [taskDetail, setTaskDetail] = useState(task)
  const updateMutation = useMutation((newData) => updateTaskBody(newData))

  const [input, setInput] = useState(null)
  const [debouncedInput, setDebouncedInput] = useState(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input)
    }, 1500)
    
    return () => {
      clearTimeout(handler)
    }
  }, [input])

  useEffect(() => {
    if (debouncedInput) {
      updateMutation.mutate({
        id: taskDetail.id,
        body: debouncedInput
      })
    }
  }, [debouncedInput])

  return (
    <Accordion type="single" collapsible className="">
      <AccordionItem value="item-1" className="border-b-0">
        <div className="flex items-center space-x-2">
          <AccordionTrigger />
          <div className="flex items-center space-2 px-1 justify-between w-full">
            <div className="flex items-center w-full">
              <Checkbox
                checked={taskDetail.is_done}
                onCheckedChange={() => {
                  const updateTaskDetail = { ...taskDetail, is_done: !taskDetail.is_done } 
                  setTaskDetail(updateTaskDetail)
                  updateMutation.mutate(updateTaskDetail)
                }}
              />
              <InputNoBorder
                defaultValue={taskDetail.body}
                placeholder="Item"
                onChange={e => {
                  const updateTaskDetail = { ...taskDetail, body: e.target.value}
                  setTaskDetail(updateTaskDetail);
                  // updateMutation.mutate(updateTaskDetail)
                  setInput(e.target.value)
                }}
                className={`field-sizing-content ${taskDetail.is_done ? "line-through" : ""}`}
              />
            </div>
            <div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  handleDeleteSubtask(taskDetail.id, setTask)
                  deleteTaskBody(taskDetail)
                }}
              >
                <X className="cursor-pointer hover:text-red-700 size-5" />
              </Button>
              {/* <Dialog>
                <DialogTrigger asChild>
                  <X className="cursor-pointer hover:text-red-700 size-5" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                  </DialogHeader>
                  <div className="my-2">
                    Are you sure you want to delete task?
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button>Cancel</Button>
                    </DialogClose>
                    <DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          // setTask((prev) => ({
                          //   ...prev,
                          //   task_body: prev.task_body.filter((item) => item.id !== taskDetail.id)
                          // }));
                          handleDeleteSubtask(taskDetail.id, setTask)
                          deleteTaskBody(taskDetail)
                        }}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog> */}
            </div>
          </div>
        </div>
        <AccordionContent>
          {!!task.subtask_body && task.subtask_body.map(subtask => (
            <ItemList key={subtask.id} task={subtask} setTask={setTask} />
          ))}
          <button
            className="ml-6 w-full text-start flex items-center space-x-2 p-1 bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              handleAddSubtask(task, setTask)
            }}
          >
            <PlusIcon />
            <span>New Sub Item</span>
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}


function ItemList({ task, setTask }) {
  return (
    <div className="ml-4">
      <ItemComponent task={task} setTask={setTask} />
    </div>
  )
}

export default function TaskDetail({ task, setTask }) {
  return (
    <div key={task.id} >
      <ItemComponent task={task} setTask={setTask} />
    </div>
  )
}








{/* <div key={taskDetail.id} >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-2 px-1">
            <Checkbox
              checked={taskDetail.is_done}
              onCheckedChange={() => {
                const updateTaskDetail = { ...taskDetail, is_done: !taskDetail.is_done } 
                setTaskDetail(updateTaskDetail)
                updateMutation.mutate(updateTaskDetail)
              }}
            />
            <InputNoBorder
              defaultValue={taskDetail.body}
              placeholder="Item"
              onChange={e => {
                const updateTaskDetail = { ...taskDetail, body: e.target.value}
                setTaskDetail(updateTaskDetail);
                updateMutation.mutate(updateTaskDetail)
              }}
              className={`field-sizing-content ${taskDetail.is_done ? "line-through" : ""}`}
            />
            <Dialog>
              <DialogTrigger asChild>
                <X className="cursor-pointer hover:text-red-700 size-5" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                </DialogHeader>
                <div className="my-2">
                  Are you sure you want to delete task?
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Cancel</Button>
                  </DialogClose>
                  <DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setTask((prev) => ({
                          ...prev,
                          task_body: prev.task_body.filter((item) => item.id !== taskDetail.id)
                        }));
                        deleteTaskBody(taskDetail)
                      }}
                    >
                      Delete
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>Add Sub Task</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
      {/* <Checkbox
        checked={taskDetail.is_done}
        onCheckedChange={() => {
          const updateTaskDetail = { ...taskDetail, is_done: !taskDetail.is_done } 
          setTaskDetail(updateTaskDetail)
          updateMutation.mutate(updateTaskDetail)
        }}
      />
      <InputNoBorder
        defaultValue={taskDetail.body}
        placeholder="Item"
        onChange={e => {
          const updateTaskDetail = { ...taskDetail, body: e.target.value}
          setTaskDetail(updateTaskDetail);
          updateMutation.mutate(updateTaskDetail)
        }}
        className={`field-sizing-content ${taskDetail.is_done ? "line-through" : ""}`}
      />
      <Dialog>
        <DialogTrigger asChild>
          <X className="cursor-pointer hover:text-red-700 size-5" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <div className="my-2">
            Are you sure you want to delete task?
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  setTask((prev) => ({
                    ...prev,
                    task_body: prev.task_body.filter((item) => item.id !== taskDetail.id)
                  }));
                  deleteTaskBody(taskDetail)
                }}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      {/* <X
        className="cursor-pointer hover:text-red-700 size-5"
        onClick={() => {
          setTask((prev) => ({
            ...prev,
            task_body: prev.task_body.filter((item) => item.id !== taskDetail.id)
          }));
          deleteTaskBody(taskDetail)
        }}
      /> */}