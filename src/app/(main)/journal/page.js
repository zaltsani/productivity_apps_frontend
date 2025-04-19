'use client'

import ArticleTable from "@/components/article/article-table"
import Header from "@/components/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { addJournal, fetchJournalList, fetchMe } from "@/lib/data"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useQuery } from "react-query"

export default function Page() {
  const listBreadcrumb = [
    { title: "Journal", url: "/journal" }
  ]
  const [articles, setArticles] = useState(null)
  const { refetch } = useQuery(
    ["journalList"],
    fetchJournalList,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true, onSuccess: (data) => setArticles(data)},
  )
  console.log(articles)

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="m-4">
        <Card className='border-0'>
          <CardHeader>
            <CardTitle>Daily Journal</CardTitle>
            <CardDescription>Write your dairy journal</CardDescription>
            <div>
              <Button
                size='sm'
                variant="blue"
                onClick={async() => {
                  const me = await fetchMe()
                  const response = await addJournal(me)
                  setArticles(prev => ([response, ...prev]))
                }}
              >
                <Plus /> Add Journal
              </Button>
            </div>
          </CardHeader>
          {/* <CardContent className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
          <CardContent className="flex flex-col gap-4">
            {!!articles && (
              <ArticleTable
                articles={articles}
                setArticles={setArticles}
              /> 
            )}
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}