'use client'

import ArticleCard from "@/components/article/article-card";
import Header from "@/components/headers";
import Task from "@/components/task/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addArticle, addTask, fetchArticleList, fetchMe, fetchTask } from "@/lib/data";
import { Fragment } from "react";
import { useQuery } from "react-query";

export default function Home() {
  const listBreadcrumb = [
    { title: "Home", url: "/" },
  ]
  
  const { data: task, refetch, isLoading: loadingTask } = useQuery(
    ["task"],
    fetchTask,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )
  const { data: articles, refetch: refetchArticles } = useQuery(
    ["articleList"],
    fetchArticleList,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="m-4 space-y-6">

        {/* Task Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Task</CardTitle>
            <CardDescription>Manage your task for better organizing</CardDescription>
            <div>
              <Button
                variant="blue"
                size="sm"
                onClick={async() => {
                  console.log("Add ")
                  const me = await fetchMe()
                  addTask(me)
                  refetch()
                }}
              >
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
            {!loadingTask && task.map(item => (
              <Task key={item.id} task={item} refetch={refetch} />
            ))}
          </CardContent>
          <CardFooter className="py-4">
          </CardFooter>
        </Card>

        {/* Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
            <CardDescription>Let's write article</CardDescription>
            <div>
              <Button
                variant="blue"
                size="sm"
                onClick={async() => {
                  const me = await fetchMe()
                  addArticle(me)
                  refetchArticles()
                }}
              >
                Add Article
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 mah-h-10">
            {articles && articles.map(article => (
              <Fragment key={article.id} >
                <ArticleCard article={article} />
              </Fragment>
            ))}
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
