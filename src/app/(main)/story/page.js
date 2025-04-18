'use client'

import Header from "@/components/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, CaseSensitive, LetterText, Plus, Smile } from "lucide-react"
import StoryTableRowContent from "@/components/story/table-row-content"
import { useQuery } from "react-query"
import { fetchStories, postStory } from "@/lib/data"
import { useState } from "react"


export default function Page() {
  const listBreadcrumb = [
    { title: "Homework for Life", url: "/story" },
  ]

  const [stories, setStories] = useState([])

  const { data } = useQuery(
    ["stories"],
    fetchStories,
    { refetchOnWindowFocus: false, refetchOnMount: true, refetchOnReconnect: false, enabled: true,
      onSuccess: (data) => { setStories(data) }
     },
  )

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="m-4 mt-2">
        <Card className="border-0">
          <CardHeader>
            <div className="space-y-1">
              <CardTitle>Homework for Life</CardTitle>
              <CardDescription>Reflecting our days by writing most story-worthy thing that happened in the day.</CardDescription>
            </div>
            <div>
              <Button
                variant='blue'
                size="sm"
                className=""
                onClick={async() => {
                  const res = await postStory({
                    title: '',
                    content: ''
                  })
                  setStories(prev => [res.data, ...prev])
                  console.log("Add", res, "Updated Stories", stories)
                }}
              >
                <Plus />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table className='overflow-x-auto'>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center space-x-2 px-2">
                      <CalendarDays />
                      <span>Date</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2 px-2">
                      <CaseSensitive />
                      <span>Story Title</span>
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[300px] md:min-w-[700px]">
                    <div className="flex items-center space-x-2 px-2">
                      <LetterText/>
                      <span>Story Notes</span>
                    </div>
                  </TableHead>
                  {/* <TableHead>
                    <div className="flex items-center space-x-2 px-2">
                      <Smile />
                      <span>Today's Mood</span>
                    </div>
                  </TableHead> */}
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.length > 0 && stories.map(item => (
                  <StoryTableRowContent key={item.id} data={item} setStories={setStories} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}