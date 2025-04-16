import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center space-y-2">
      <div>
        <Loader2 className="animate-spin" />
      </div>
      <div>Loading...</div>
    </div>
  )
}