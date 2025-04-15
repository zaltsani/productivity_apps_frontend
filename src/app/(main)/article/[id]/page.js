'use client'

import ArticleStyleMenu from "@/components/article/article-styles-menu"
import Header from "@/components/headers"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { TextInput } from "@/components/ui/textarea"
import { fetchArticleDetail, updateArticle } from "@/lib/data"
import { PlusIcon } from "lucide-react"
import { Fragment, use, useEffect, useState } from "react"
import { useMutation, useQuery } from "react-query"

export default function Page({ params }) {
  const { id } = params

  const { data: data } = useQuery(
    ["articleDetail", id],
    () => fetchArticleDetail(id),
    { refetchOnWindowFocus: false, refetchOnMount: true, refetchOnReconnect: false, enabled: true },
  )

  const [article, setArticle] = useState(null)
  useEffect(() => {
    setArticle(data)
  }, [data])

  const listBreadcrumb = [
    { title: "Article", url: "/article" },
    { title: article ? article.title : '', url: `/task/${id}` }
  ]

  const updateMutation = useMutation((newData) => updateArticle(newData))

  const styles = [
    {type: "heading", level: 1, className: "text-xl font-semibold text-justify"},
    {type: "heading", level: 2, className: "text-lg font-medium  text-justify"},
    {type: "heading", level: 3, className: "text-md font-medium text-justify"},
    {type: "paragraph", className: "text-justify"}
  ]

  // Debounce Update
  const [triggerDebounce, setTriggerDebounce] = useState(0)
  const [debouncedQuery, setDebouncedQuery] = useState(null)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(article)
    }, 1500)
    return () => clearTimeout(handler)
  }, [triggerDebounce])
  useEffect(() => {
    if (triggerDebounce) {
      updateMutation.mutate(article)
    }
  }, [debouncedQuery])
    
  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="m-4 mx-20 mr-20">

        {/* Heading and Description */}
        {article && (
          <div className="flex flex-col items-center justify-center py-4 max-w-4xl">
            <TextInput
              value={article.title  ? article.title : ''}
              placeholder="Title"
              onChange={(e) => {
                const updatedData = {
                  ...article,
                  title: e.target.value
                }
                setArticle(updatedData)
                setTriggerDebounce(prev => (prev+1))
                // updateMutation.mutate(updatedData)
              }}
              className="text-2xl font-bold text-center w-1/2"
            />
            <TextInput
              value={article.description ? article.description : ''}
              placeholder="Description"
              onChange={(e) => {
                const updatedData = {
                  ...article,
                  description: e.target.value
                }
                setArticle(updatedData)
                setTriggerDebounce(prev => (prev+1))
                // updateMutation.mutate(updatedData)
              }}
              className="text-lg font-base text-center"
            />
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-4 gap-y-0 gap-x-10">
            {article && article.content.map((item, index) => (
              <Fragment key={index}>
              <div key={index} className="col-span-3 flex flex-col max-w-2xl">
                <div className="relative m-2 flex bottom-0 left-0 opacity-0 hover:opacity-100 transition">
                  <button
                    onClick={() => {
                      const updatedSection = article?.content
                      const newSection = { type: "paragraph", text: "" }
                      updatedSection.splice(index, 0, newSection)
                      const updatedData = {
                        ...article,
                        content: updatedSection
                      }
                      setArticle(updatedData)
                      setTriggerDebounce(prev => (prev+1))
                      // updateMutation.mutate(updatedData)
                    }}
                    className="flex items-center space-x-2"
                  >
                    <PlusIcon size={15} />
                    <div className="text-sm">Add Content</div>
                  </button>
                </div>
                <TextInput
                  key={index}
                  value={item.text ? item.text : ''}
                  placeholder="Write Something"
                  onChange={(e) => {
                    const updatedData = {
                      ...article,
                      content: article["content"].map((itemm, i) => 
                        i === index ? { ...item, text: e.target.value } : itemm
                    )}
                    setArticle(updatedData)
                    setTriggerDebounce(prev => (prev+1))
                    // updateMutation.mutate(updatedData)
                  }}
                  className={styles.find(style => style.type === item.type && (style.level === undefined || style.level === item.level)).className}
                  article={article}
                />
              </div>
              <div className="col-span-1 flex items-center mt-8">
                <ArticleStyleMenu content={item} index={index} article={article} setArticle={setArticle} updateMutation={updateMutation} />
              </div>
              </Fragment>
            ))}
            <div className="relative m-2 my-8 flex bottom-0 left-0 transition">
              <button
                onClick={() => {
                  const updatedSection = article?.content
                  const newSection = { type: "paragraph", text: "" }
                  updatedSection.push(newSection)
                  const updatedData = {
                    ...article,
                    content: updatedSection
                  }
                  setArticle(updatedData)
                  setTriggerDebounce(prev => (prev+1))
                  // updateMutation.mutate(updatedData)
                }}
                className="flex items-center space-x-2"
              >
                <PlusIcon size={15} />
                <div className="text-sm">Add Content</div>
              </button>
            </div>
        </div>

      </div>
    </div>
  )
}