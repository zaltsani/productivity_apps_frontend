import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function JournalCard({ article }) {
  return (
    <Link href={`/article/${article.id}`}>
      <Card className="">
        <CardHeader>
          <CardTitle className="text-lg">{article.title ? article.title : <span className="text-gray-600/70">No Title Yet</span>}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="">
            <p>Description:</p>
            <p>{article.description ? article.description : <span className="text-gray-600/70">No Description Yet</span>}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}