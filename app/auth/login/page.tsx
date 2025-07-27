"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShoppingCart, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Only create Supabase client if config is available
  const supabase = hasSupabaseConfig() ? createSupabaseClient() : null

  // Show configuration error if environment variables are missing
  if (!hasSupabaseConfig()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h1 className="text-2xl font-bold text-red-600">Configuration Required</h1>
            </div>
            <CardTitle>Supabase Setup Needed</CardTitle>
            <CardDescription>Please configure your Supabase environment variables to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Missing Environment Variables</strong>
                <br />
                <br />
                Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root with:
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm block">
                NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
                <br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
              </code>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>How to get these values:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Go to{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    supabase.com
                  </a>
                </li>
                <li>Create a new project or select existing one</li>
                <li>Go to Settings → API</li>
                <li>Copy your Project URL and anon/public key</li>
                <li>Add them to your .env.local file</li>
                <li>Restart your development server</li>
              </ol>
            </div>

            <div className="text-center pt-4">
              <Link href="/" className="text-orange-600 hover:underline">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!supabase) {
      setError("Supabase is not configured properly")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user profile to determine role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

      if (profile?.role === "vendor") {
        router.push("/vendor/dashboard")
      } else if (profile?.role === "supplier") {
        router.push("/supplier/dashboard")
      } else {
        router.push("/auth/complete-profile")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold">SupplyConnect</h1>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/auth/register" className="text-orange-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
