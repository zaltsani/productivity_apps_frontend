'use client'

import ArticleCard from "@/components/article/article-card"
import Header from "@/components/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { addArticle, fetchArticleList, fetchMe } from "@/lib/data"
import { useRouter } from "next/navigation"
import { Fragment } from "react"
import { useQuery } from "react-query"

export default function Page() {
  const listBreadcrumb = [
    { title: "Article", url: "/article" }
  ]
  const { data: articles, refetch } = useQuery(
    ["articleList"],
    fetchArticleList,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )

  const router = useRouter()

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="m-4">
        <Card>
          <CardHeader className=''>
            <CardTitle>Articles</CardTitle>
            <CardDescription>Write your article here</CardDescription>
            <div className="mt-2">
              <Button
                size='sm'
                variant="blue"
                onClick={async() => {
                  const me = await fetchMe()
                  addArticle(me)
                  refetch()
                }}
              >
                Add Article
              </Button>
            </div>
          </CardHeader>
          {/* <CardContent className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
          <CardContent className="flex flex-col gap-4">
            {!!articles && (
              <Table className="mx-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead className="text-left">Title</TableHead>
                    <TableHead className="text-left">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article, index) => (
                    <TableRow
                      key={index}
                      onClick={() => router.push(`/article/${article.id}/`)}
                      className="hover:bg-accent hover:cursor-pointer"
                    >
                      <TableCell className="w-[10px]">{index+1}</TableCell>
                      <TableCell className="text-left">{article.title}</TableCell>
                      <TableCell className="text-left">{article.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {/* {articles && articles.map(article => (
              <Fragment key={article.id} >
                <ArticleCard article={article} />
              </Fragment>
            ))} */}
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}