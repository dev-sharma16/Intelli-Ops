"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export function ProfileCard() {
  const user = {
    name: "Dev Sharma",
    email: "dev@example.com",
    image:
      "https://avatars.githubusercontent.com/u/000000?v=4" // replace with real user DP
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
            w-full flex items-center gap-3 px-3 py-2 
            rounded-lg hover:bg-sidebar-accent transition 
            border border-sidebar-border
          "
        >
          <Image
            src={user.image}
            alt="profile"
            width={34}
            height={34}
            className="rounded-full"
          />
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-sidebar-foreground">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>

          <span className="ml-auto text-muted-foreground">⌄</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 bg-sidebar border-sidebar-border"
        align="end"
        side="right"
      >
        <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
          <Image
            src={user.image}
            alt="profile"
            width={38}
            height={38}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => console.log("Profile clicked")}>
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => console.log("Billing clicked")}>
          Billing
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => console.log("Notifications clicked")}>
          Notifications
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-400">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
