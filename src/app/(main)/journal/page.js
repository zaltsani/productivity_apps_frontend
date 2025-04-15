'use client'

import ArticleCard from "@/components/article/article-card"
import JournalCard from "@/components/article/journal-card"
import Header from "@/components/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { addJournal, fetchJournalList, fetchMe } from "@/lib/data"
import { Fragment } from "react"
import { useQuery } from "react-query"

export default function Page() {
  const listBreadcrumb = [
    { title: "Journal", url: "/journal" }
  ]
  const { data: articles, refetch } = useQuery(
    ["journalList"],
    fetchJournalList,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="m-4">
        <Card>
          <CardHeader className='space-y-4'>
            <CardTitle>Journal</CardTitle>
            <div>
              <Button
                size='sm'
                onClick={async() => {
                  const me = await fetchMe()
                  addJournal(me)
                  refetch()
                }}
              >
                Write New Journal
              </Button>
            </div>
          </CardHeader>
          {/* <CardContent className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
          <CardContent className="flex flex-col gap-4">
            {articles && articles.map(article => (
              <Fragment key={article.id} >
                <JournalCard article={article} />
              </Fragment>
            ))}
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}