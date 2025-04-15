import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div>
        <Loader2 className="animate-spin" />
      </div>
      <div>Loading...</div>
    </div>
  )
}