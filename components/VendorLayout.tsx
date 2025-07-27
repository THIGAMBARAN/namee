"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Home, Package, History, User, LogOut, Menu, Bell } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface VendorLayoutProps {
  children: React.ReactNode
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: Home },
    { name: "Browse Products", href: "/vendor/products", icon: Package },
    { name: "Order History", href: "/vendor/orders", icon: History },
    { name: "Profile", href: "/vendor/profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-orange-600">
          <ShoppingCart className="h-8 w-8 text-white" />
          <span className="ml-2 text-xl font-bold text-white">SupplyConnect</span>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="px-4">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Vendor Dashboard</p>
                <p className="text-gray-500">Manage your orders and suppliers</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
