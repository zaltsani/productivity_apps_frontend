import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function ArticleStyleMenu({ content, index, article, setArticle, updateMutation }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">Style</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Heading</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    const updatedData = {
                      ...article,
                      content: article["content"].map((item, i) => 
                        i === index ? { type: "heading", level: 1, text: content.text } : item
                    )}
                    setArticle(updatedData)
                    updateMutation.mutate(updatedData)
                  }}
                >
                  Level 1
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const updatedData = {
                      ...article,
                      content: article["content"].map((item, i) => 
                        i === index ? { type: "heading", level: 2, text: content.text } : item
                    )}
                    setArticle(updatedData)
                    updateMutation.mutate(updatedData)
                  }}
                >
                  Level 2
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => {
              const updatedData = {
                ...article,
                content: article["content"].map((item, i) => 
                  i === index ? { type: "paragraph", text: content.text } : item
              )}
              setArticle(updatedData)
              updateMutation.mutate(updatedData)
            }}
            className={content.style === "heading" ? "bg-blue-600" : ''}
          >
            Paragraph
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}