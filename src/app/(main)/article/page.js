'use client'

import ArticleTable from "@/components/article/article-table"
import Header from "@/components/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { addArticle, deleteArticle, fetchArticleList, fetchMe } from "@/lib/data"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useQuery } from "react-query"

export default function Page() {
  const listBreadcrumb = [
    { title: "Article", url: "/article" }
  ]

  const [articles, setArticles] = useState(null)

  const {  } = useQuery(
    ["articleList"],
    fetchArticleList,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true, onSuccess: (data) => setArticles(data) },
  )

  const handleDeleteArticle = async(article) => {
    setArticles(prev => (prev.filter(d => d.id !== article.id)))
    const res = await deleteArticle(article)
    console.log("Delete Article Status", res.status)
  }

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="m-4">
        <Card className="border-0">
          <CardHeader className=''>
            <CardTitle>Articles</CardTitle>
            <CardDescription>Write your article here</CardDescription>
            <div className="mt-2">
              <Button
                size='sm'
                variant="blue"
                onClick={async() => {
                  const me = await fetchMe()
                  const response = await addArticle(me)
                  setArticles(prev => ([response, ...prev]))
                }}
              >
                <Plus /> Add Article
              </Button>
            </div>
          </CardHeader>
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

{/* {articles && articles.map(article => (
  <Fragment key={article.id} >
    <ArticleCard article={article} />
  </Fragment>
))} */}