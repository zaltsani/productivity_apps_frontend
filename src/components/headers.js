'use client'

import { SidebarTrigger } from "./ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";

export default function Header({ listBreadcrumb }) {
  const { data: session } = useSession()
  
  return (
    // <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {listBreadcrumb && listBreadcrumb.map((item, index) => {
                  if (index+1 !== listBreadcrumb.length) { return (
                    <Fragment key={index}>
                      <BreadcrumbItem className='hidden md:block'>
                        <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block"/>
                    </Fragment>
                  )} else { return (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-6">
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex justify-between gap-4 items-center cursor-pointer">
                    <span className="hidden md:block">{session.user.username}</span>
                    <ChevronDown />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button
                        onClick={() => signOut()}
                      >
                        Sign out
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    // {/* </SidebarInset> */}
  )
}