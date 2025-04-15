'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { postRegister } from "@/lib/data"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [error, setError] = useState(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget
    const username = form.elements.username.value
    const password1 = form.elements.password1.value
    const password2 = form.elements.password2.value
    const response = await postRegister(username, password1, password2)
    console.log("response", response)
    if (response.status === 400) {
      setError(response.response.data.non_field_errors[0])
    } else if (response.status === 201) {
      router.push('/login')
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Register your Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password1">Password</Label>
                </div>
                <Input id="password1" type="password" placeholder="Password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password2">Password Confirmation</Label>
                </div>
                <Input id="password2" type="password" placeholder="Confirm Password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              {error && (
                <div>{error}</div>
              )}
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
