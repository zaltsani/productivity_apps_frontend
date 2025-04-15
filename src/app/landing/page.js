import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-screen h-screen flex items-center justify-center space-x-4">
      <Link href='/login'>
        <Button variant='blue'>Login</Button>
      </Link>
      <Link href='/register'>
        <Button variant='blue'>Sign Up</Button>
      </Link>
    </div>
  )
}