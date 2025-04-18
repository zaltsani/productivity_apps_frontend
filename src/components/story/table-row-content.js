'use client'

import { useEffect, useState } from "react"
import { TableCell, TableRow } from "../ui/table"
import { format, parse, parseJSON } from "date-fns"
import { TextInput } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { deleteStory, patchStory } from "@/lib/data"
import { Button } from "../ui/button"
import { Trash } from "lucide-react"


export default function StoryTableRowContent({ data, setStories }) {
  const [date, setDate] = useState(new Date(data.date))
  const [title, setTitle] = useState(data.title)
  const [content, setContent] = useState(data.content)
  const [debounceNow, setDebounceNow] = useState(false)

  // Debounce Content
  useEffect(() => {
    const handler = setTimeout(async() => {
      if (debounceNow) {
        const res = await patchStory({
          id: data.id,
          content: content
        })
        console.log("Update Content", res.data)
      }
    }, 1500)
    return () => {
      clearTimeout(handler)
    }
  }, [content])

  // Debounce Title
  useEffect(() => {
    const handler = setTimeout(async() => {
      if (debounceNow) {
        const res = await patchStory({
          id: data.id,
          title: title
        })
        console.log("Update Title", res.data)
      }
    }, 1500)
    return () => {
      clearTimeout(handler)
    }
  }, [title])

  // Update Date
  const dateOnChange = async(newDate) => {
    setDate(newDate)
    const res = await patchStory({
      id: data.id,
      date: format(newDate, 'yyyy-MM-dd')
    })
    console.log("Update Date", res)
  }

  return (
    <TableRow>
      <TableCell className="text-left">
        <DateComponentChange date={date} dateOnChange={dateOnChange} />
      </TableCell>
      <TableCell className="text-left h-full">
        <TextInput
          value={title}
          onChange={(e) => {
            setDebounceNow(true)
            setTitle(e.target.value)
          }}
          placeholder="Give your story a title"
          className="h-full"
        />
      </TableCell>
      <TableCell className="text-left">
        <TextInput
          placeholder="Give your best storyworthy of the day"
          value={content}
          onChange={(e) => {
            setDebounceNow(true)
            setContent(e.target.value)
          }}
        />
      </TableCell>
      <TableCell>
        <div className="px-2">
          <Button size="icon" variant="ghost"
            onClick={async() => {
              const res = await deleteStory(data.id)
              setStories(prev => prev.filter(d => d.id !== data.id))
              console.log("Delete", res)
            }}
          >
            <Trash color="red" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

const DateComponentChange = ({ date, dateOnChange }) => {
  return (
    <Popover>
      <PopoverTrigger>{format(date, "MMMM dd, yyyy")}</PopoverTrigger>
      <PopoverContent>
        <Calendar
          initialFocus
          mode="single"
          selected={date}
          onSelect={dateOnChange}
        />
      </PopoverContent>
    </Popover>
  )
}