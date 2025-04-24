import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { deleteArticle, updateArticle } from "@/lib/data"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { TextInput } from "../ui/textarea"
import { Trash } from "lucide-react"
import { Button } from "../ui/button"

export default function ArticleTable ({ articles, setArticles }) {
  const handleDeleteArticle = async(article) => {
    setArticles(prev => (prev.filter(d => d.id !== article.id)))
    const res = await deleteArticle(article)
    console.log("Delete Article Status", res.status)
  }

  return (
    <Table className="mx-4">
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead className="text-left min-w-[150px]">Title</TableHead>
          <TableHead className="text-left min-w-[200px]">Description</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article, index) => (
          <ArticleTableRowItem
            key={article.id}
            article={article}
            index={index}
            handleDeleteArticle={handleDeleteArticle}
          />
        ))}
      </TableBody>
    </Table>
  )
}


const ArticleTableRowItem = ({ article, index, handleDeleteArticle }) => {
  const router = useRouter()
  const [titleDebounceNow, setTitleDebounceNow] = useState(false)
  const [descriptionDebounceNow, setDescriptionDebounceNow] = useState(false)
  const [title, setTitle] = useState(article.title)
  const [description, setDescription] = useState(article.description)

  // Debounce Title
  useEffect(() => {
    const handler = setTimeout(async() => {
      if (titleDebounceNow) {
        const res = await updateArticle({
          id: article.id,
          title: title
        })
        console.log("Update Article Title", res.data)
      }
    }, 1500)
    return () => {
      clearTimeout(handler)
    }
  }, [title])

  // Debounce Description
  useEffect(() => {
    const handler = setTimeout(async() => {
      if (descriptionDebounceNow) {
        const res = await updateArticle({
          id: article.id,
          description: description
        })
        console.log("Update Article Description", res.data)
      }
    }, 1500)
    return () => {
      clearTimeout(handler)
    }
  }, [description])

  return (
    <TableRow
      key={article.id}
      onClick={() => router.push(`/article/${article.id}/`)}
      className="hover:bg-accent hover:cursor-pointer"
    >
      <TableCell className="w-[10px]">{index+1}</TableCell>
      <TableCell className="text-left">
        <TextInput
          value={title ? title : ''}
          onChange={(e) => {
            setTitleDebounceNow(true)
            setTitle(e.target.value)
          }}
          placeholder="Set the title of this article"
          onClick={(e) => {
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
          }}
        />
      </TableCell>
      <TableCell className="text-left">
        <TextInput
          value={description ? description : ''}
          onChange={(e) => {
            setDescriptionDebounceNow(true)
            setDescription(e.target.value)
          }}
          onClick={(e) => {
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
          }}
          placeholder="Set description of this article"
        />
      </TableCell>
      <TableCell>
        <DialogDeleteArticle
          article={article}
          handleDeleteArticle={handleDeleteArticle}
          onClick={(e) => {
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
          }}
        >
          <Button
            size="icon"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              // handleDeleteArticle(article)
            }}
          >
            <Trash />
          </Button>
        </DialogDeleteArticle>
      </TableCell>
    </TableRow>
  )
}


const DialogDeleteArticle = ({ article, handleDeleteArticle, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="gap-4"
        onClick={(e) => {
          e.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Article</DialogTitle>
        </DialogHeader>
        <div>Are you sure want to delete {article.title ? `"${article.title}"` : 'this'} article</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => handleDeleteArticle(article)} 
            >Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}