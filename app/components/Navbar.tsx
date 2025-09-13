"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"; // ✅ ใช้งาน next-auth
import { LogInIcon, LogOutIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavigationMenuDemo() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center p-4 sticky top-0 z-50">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/addmembers">เพิ่มสมาชิก</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/allmembers">สมาชิกทั้งหมด</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* ✅ Auth menu */}
          {!session ? (
            <NavigationMenuItem>
              <button
                onClick={() => signIn()}
                className={navigationMenuTriggerStyle()}
              >
                <LogInIcon className="mr-2 h-4 w-4" />
                เข้าสู่ระบบ
              </button>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={navigationMenuTriggerStyle()}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                ออกจากระบบ
              </button>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
